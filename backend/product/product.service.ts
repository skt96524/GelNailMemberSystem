import { Knex } from "knex";

export class ProductService {
  constructor(public knex: Knex) {}

  productTable() {
    return this.knex("shop_products_photo");
  }

  async getProductsList(filter: {
    productType?: string;
    offset?: number;
    searchText?: string;
    shop_id?: number;
    collecter_id?: number;
  }) {
    let query = this.productTable();

    if (filter.collecter_id) {
      query = this.knex("collection")
        .where("collection_owner_id", filter.collecter_id)
        .innerJoin(
          "shop_products_photo",
          "shop_products_photo.id",
          "collection.products_id"
        );
    }
    query = query
      .select(
        "shop_products_photo.id as id",
        "images",
        "intro",
        "shop_products_photo.shop_id as shop_id"
      )
      .leftJoin("like", "like.products_id", "=", "shop_products_photo.id")
      .count("like.products_id as like_qty")
      .groupBy("shop_products_photo.id", "like.id");

    if (filter.shop_id) {
      query = query.where("shop_products_photo.shop_id", "=", filter.shop_id);
    }
    if (filter.productType) {
      if (filter.productType == "精品作品") {
        query = query.orderBy("like_qty", "desc");
      }
      if (filter.productType == "最新作品") {
        query = query.orderBy("shop_products_photo.created_at", "desc");
      }
    }
    if (filter.offset) {
      query = query.offset(filter.offset);
    }
    if (filter.searchText) {
      query = query.whereILike("intro", "%" + filter.searchText + "%");
    }
    let products = await query.limit(16);
    return { products };
  }
  async getPerformance(users_id: number, products_id: number | string) {
    let liked = await this.knex("like")
      .select("id as like_id")
      .where("users_id", "=", users_id)
      .andWhere("products_id", "=", products_id)
      .first();
    let collected = await this.knex("collection")
      .select("id as collection_id")
      .where("collection_owner_id", "=", users_id)
      .andWhere("products_id", "=", products_id)
      .first();

    let result = { ...liked, ...collected };
    return result;
  }

  async addLikeProduct(users_id: number, products_id: number | string) {
    await this.knex("like").insert({ users_id, products_id });
    return { success: "Liked" };
  }

  async removeLikeProduct(users_id: number, products_id: number | string) {
    await this.knex("like")
      .delete()
      .where("users_id", "=", users_id)
      .andWhere("products_id", "=", products_id);
    return { success: "UnLiked" };
  }

  async addProductCollection(users_id: number, products_id: number | string) {
    await this.knex("collection").insert({
      collection_owner_id: users_id,
      products_id,
    });
    return { success: "Added" };
  }

  async removeProductCollection(
    users_id: number,
    products_id: number | string
  ) {
    await this.knex("collection")
      .delete()
      .where("collection_owner_id", "=", users_id)
      .andWhere("products_id", "=", products_id);
    return { success: "Removed" };
  }
}
