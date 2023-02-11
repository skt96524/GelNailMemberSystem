import { Knex } from "knex";
import { HttpError } from "../http.error";

export class MyShopService {
  constructor(public knex: Knex) {}

  shopTable() {
    return this.knex("shop");
  }

  async getShopID(userID: number) {
    let shop = await this.knex
      .select("id")
      .from("shop")
      .where("owner", "=", userID)
      .first();

    if (!shop) throw new HttpError(403, "not a shop owner");

    return shop.id as number;
  }

  async updateShopStatus(status: string, shop_id: string) {
    let shop = await this.knex("shop")
      .update("shop_status", status)
      .where("shop.id", shop_id)
      .returning("shop.owner");

    if (status == "active") {
      await this.knex("notification").insert({
        users_id: shop[0].owner,
        link: "/shop/" + shop_id,
        content: "你的開店申請已批准",
      });
    }

    if (status == "inactive") {
      await this.knex("notification").insert({
        users_id: shop[0].owner,
        link: "/shop/" + shop_id,
        content: "你的開店申請已被拒絕",
      });
    }

    return { message: "success" };
  }

  async createShop(shop: {
    owner: number;
    name: string;
    area: string;
    address: string;
    open_time: string;
    close_time: string;
    intro: string;
    image: string;
    shop_tel: string;
  }) {
    try {
      let id = await this.shopTable().insert(shop).returning("id");
      let admins = await this.knex("users")
        .select("id")
        .where("users.identity", "=", "admin");
      let notifications: {}[] = [];
      for (let admin of admins) {
        notifications.push({
          users_id: admin,
          link: "/shop/" + id,
          content: `新店鋪申請 ${shop.name}`,
        });
      }
      await this.knex("notification").insert(notifications);
      return { id };
    } catch (error) {
      throw new Error(String(error));
    }
  }

  async checkApplyShop(user_id: number) {
    let row = await this.knex
      .select("id")
      .from("shop")
      .where({ owner: user_id })
      .andWhere("shop_status", "!=", "inactive")
      .first();
    if (row) {
      throw new HttpError(403, "You have already applying shop / own a shop");
    }
  }

  async checkShopOwner(input: { user_id: number; shop_id: number }) {
    let row = await this.knex
      .select("id")
      .from("shop")
      .where({ id: input.shop_id, owner: input.user_id })
      .first();
    if (!row) {
      throw new HttpError(403, "not shop owner");
    }
  }

  async getshopinfo(shop_id: number) {
    let shopInfo = await this.knex
      .from("shop")
      .where("id", "=", shop_id)
      .select(
        "owner as owner",
        "name as name",
        "area as area",
        "address as address",
        "open_time as open_time",
        "close_time as close_time",
        "intro as intro",
        "image as image",
        "shop_status as shop_status",
        "shop_tel as shop_tel"
      )
      .first();

    let shop_intro_photos = await this.knex("shop_intro_photos").where(
      "shop_id",
      shop_id
    );
    let shop_plan;
    if (shopInfo.shop_status == "active") {
      shop_plan = await this.knex("shop_plan")
        .select("id", "plan_name", "intro", "price", "types")
        .where("shop_id", shop_id)
        .andWhere("plan_status", "active");
    }

    if (shop_intro_photos) {
      shopInfo = { ...shopInfo, shop_intro_photos: [...shop_intro_photos] };
    }
    if (shop_plan) {
      shopInfo = { ...shopInfo, shop_plan: [...shop_plan] };
    }

    return shopInfo;
  }
}
