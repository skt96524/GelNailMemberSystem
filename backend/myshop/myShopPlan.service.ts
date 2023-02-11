import { Knex } from "knex";
import { HttpError } from "../http.error";

export class MyShopPlanService {
  constructor(public knex: Knex) {}

  async getMyShopPlanList(shop_id: number) {
    let planList = await this.knex
      .from("shop_plan")
      .where("shop_id", "=", shop_id)
      .select(
        "id as id",
        "plan_name as plan_name",
        "intro as intro",
        "image as image",
        "shop_id as shop_id",
        "price as price",
        "types as types",
        "buy_period as buy_period",
        "due_period as due_period",
        "package_qty as package_qty",
        "plan_status as plan_status"
      );
    // .where("plan_status", "=", "active");
    return { planList };
  }

  async postEditShopPlan(input: {
    plan_name: any;
    intro: any;
    image: string;
    shop_id: number;
    cancel_period: number;
    price: number;
    types: string;
    due_period: number;
    buy_period: string;
    package_qty: number;
    period: number;
  }) {
    await this.knex
      .insert({
        plan_name: input.plan_name,
        intro: input.intro,
        image: input.image,
        shop_id: input.shop_id,
        cancel_period: input.cancel_period * (1000 * 60 * 60 * 24),
        price: input.price,
        types: input.types,
        buy_period: input.buy_period,
        due_period: input.due_period * (1000 * 60 * 60 * 24 * input.period),
        package_qty: input.package_qty,
      })
      .into("shop_plan");
  }

  async checkShopOwner(user_id: number) {
    let row = await this.knex
      .select("id")
      .from("shop")
      .where({ owner: user_id })
      .andWhere("shop_status", "!=", "inactive")
      .first();
    if (row.id) {
      throw new HttpError(
        403,
        "You have already applying on created shop / own a shop."
      );
    }
    return;
  }
  async patchEditShopPlan(id: number) {
    await this.knex("shop_plan")
      .update({
        plan_status: "inactive",
      })
      .where("id", "=", id);
  }
}

// }
