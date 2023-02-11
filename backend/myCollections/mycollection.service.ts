import { Knex } from "knex";
import { HttpError } from '../http.error';

export class MycollectionService {
    constructor(public knex: Knex) { }

    async getMyBookMarkArticle(userID: number) {
        let articles = await this.knex
            .select(`article.id`, `title`, `main_img`, `views`, `article.created_at`, `nick_name`)
            .from("collection")
            .join("article", "article.id", "=", "article_id")
            .join("users", "users.id", "=", "article.users_id")
            .where("collection_owner_id", "=", userID)
            .orderBy("article.id", "desc")
        if (!articles) throw new HttpError(404, 'collection not found')

        return { articles };
    }

    async getMyBookMarkShop(userID: number) {
        let shops = await this.knex
            .select(`shop.id`, `name`, `image`, `intro`)
            .from("collection")
            .join("shop", "shop.id", "=", "shop_id")
            .where("collection_owner_id", "=", userID)
            .orderBy("shop.id", "desc")
        if (!shops) throw new HttpError(404, 'collection not found')

        return { shops };
    }

    async getMyBookMarkNail(userID: number) {
        let nails = await this.knex
            .select(`shop_products_photo.id`, `images`)
            .from("collection")
            .join("shop_products_photo", "shop_products_photo.id", "=", "products_id")
            .where("collection_owner_id", "=", userID)
            .orderBy("shop_products_photo.id", "desc")
        if (!nails) throw new HttpError(404, 'collection not found')

        return { nails };
    }
}
