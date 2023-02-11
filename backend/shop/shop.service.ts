import { Knex } from "knex";

export class ShopService {
  constructor(public knex: Knex) {}

  async getShopList(filter: {
    type?: string;
    offset?: number;
    searchText?: string;
    area?: string;
  }) {
    let query = this.knex("shop")
      .select(
        "shop.id as id",
        "shop.name as name",
        "shop.address as address",
        "shop.image as image"
      )
      .where("shop_status", "=", "active");
    if (filter.area) {
      query = query.andWhere("area", "=", filter.area);
    }
    if (filter.type) {
      if (filter.type == "精品店舖") {
        query = query
          .leftJoin("like", "shop_id", "=", "shop.id")
          .count("shop_id as like_qty")
          .groupBy("shop.id", "like.id")
          .orderBy("like_qty", "desc");
      }
      if (filter.type == "人氣店舖") {
        query = query
          .leftJoin("shop_plan", "shop_id", "=", "shop.id")
          .leftJoin("booking", "shop_plan_id", "=", "shop_plan.id")
          .count("booking.finish_time as booking_qty")
          .groupBy("shop.id", "booking.id", "shop_plan.id")
          .orderBy("booking_qty", "desc");
      }
      if (filter.type == "最新店舖") {
        query = query.orderBy("shop.created_at", "desc");
      }
    }
    if (filter.offset) {
      query = query.offset(filter.offset);
    }
    if (filter.searchText) {
      query = query
        .whereILike("name", "%" + filter.searchText + "%")
        .orWhereILike("intro", "%" + filter.searchText + "%")
        .orWhereILike("address", "%" + filter.searchText + "%");
    }
    let shopList = await query.limit(10);

    return { shopList };
  }

  async getShopBooking(input: { userID: number; dateValue: string }) {
    let result = await this.knex("booking")
      .select(
        "booking.id as booking_id",
        "shop.id as shop_id",
        "shop.name as shop_name",
        "shop.owner as shop_owner",
        "shop.shop_tel as shop_tel",
        "booking.users_id",
        "users.nick_name as users_nick_name",
        "users.phone_number as phone_number",
        "shop_plan.plan_name",
        "shop_plan.intro as shop_plan_intro",
        "shop_plan.types as types",
        "price",
        "booking_status",
        "schedule",
        "address",
        "cancel_period"
      )
      .join("shop_plan", "shop_plan.id", "booking.shop_plan_id")
      .join("shop", "shop.id", "shop_plan.shop_id")
      .join("users", "users.id", "booking.users_id")
      .where("shop.owner", input.userID)
      .whereBetween("schedule", [
        input.dateValue,
        input.dateValue + " 23:59:59",
      ]);
    return result;
  }
}
