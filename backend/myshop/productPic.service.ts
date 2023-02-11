import { Knex } from "knex";

export class ProductPicService {
  constructor(public knex: Knex) {}

  async addPhoto(input: { intro: any; image: any; shop_id: any }) {
    await this.knex
      .insert({
        intro: input.intro,
        images: input.image,
        shop_id: input.shop_id,
      })
      .into("shop_products_photo");
  }

  async getProductPic(shop_id: number) {
    let products = await this.knex
      .select(
        "id as  products_id",
        "images as products_image",
        "intro as products_intro",
        "shop_id as shop_id"
      )
      .from("shop_products_photo")
      .where("shop_id", "=", shop_id);
    return { products };
  }

  async delProductPic(pic_id: number) {
    await this.knex.from("like").where("products_id", "=", pic_id).delete();

    await this.knex
      .from("collection")
      .where("products_id", "=", pic_id)
      .delete();

    await this.knex.from("shop_products_photo").where("id", "=", pic_id).del();

    return {};
  }
}
