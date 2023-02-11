import { Knex } from "knex";

export class MemberService {
  constructor(public knex: Knex) {}

  memberTable() {
    return this.knex("shop_members");
  }

  shopTable() {
    return this.knex("shop");
  }
  async getMyshopService(input: { userID: number; searchState: any }) {
    let query = this.shopTable()
      .select(
        "users.id as id",
        "users.nick_name as name",
        "users.phone_number as tel",
        "users.image as icon",
        "users.email as email"
      )
      .where("shop.owner", "=", input.userID)
      .join("shop_members", "shop_members.shop_id", "shop.id")
      .join("users", "users.id", "=", "shop_members.users_id");

    if (input.searchState) {
      query = query
        .whereILike("users.nick_name", `%${input.searchState}%`)
        .orWhereILike("users.email", `%${input.searchState}%`);
    }
    let rows = await query;
    return rows;
  }

  async getAddMemberData(input: {
    userID: number;
    addMemberSearchState: string;
  }) {
    let query = this.knex("users")
      .select(
        "users.id as id",
        "users.nick_name as name",
        "users.phone_number as tel",
        "users.image as icon",
        "users.email as email"
      )
      .whereNotIn("users.id", function () {
        this.select("shop_members.users_id")
          .from("shop_members")
          .join("shop", "shop_members.shop_id", "shop.id")
          .where("shop.owner", input.userID);
      });

    if (input.addMemberSearchState) {
      query = query
        .andWhereILike("users.nick_name", `%${input.addMemberSearchState}%`)
        .orWhereILike("users.email", `%${input.addMemberSearchState}%`);
    }
    let rows = await query;
    return rows;
  }

  async addMember(shop_id: number, member_id: number) {
    let id = await this.knex("shop_members")
      .insert({ shop_id, users_id: member_id })
      .returning("id");
    return id;
  }

  async getMemberDetail(input: { shop_id: number; member_id: number }) {
    let memberInfo = await this.knex
      .where("id", "=", +input.member_id)
      .select(
        "users.id as id",
        "nick_name as name",
        "phone_number as tel",
        "image as icon",
        "email as email"
      )
      .from("users")
      .first();

    let result = await this.knex.raw(
      /* sql */ `
SELECT users_package.id,
    (shop_plan.package_qty > count(booking.id))
    and (users_package.due_time > CURRENT_TIMESTAMP) as is_valid,
    shop_plan.package_qty,
    (shop_plan.package_qty - count(booking.id)) as remain,
    users_package.due_time,
    shop_plan.due_period,
    shop_plan.id as plan_id,
    shop_plan.intro,
    shop_plan.price,
    shop_plan.image
from users_package
    inner join shop_plan on shop_plan.id = users_package.shop_plan_id
    left join booking on booking.package_id = users_package.id
where shop_plan.shop_id = ?
    and users_package.users_id = ?
    and booking.reject_time is null
    and booking.cancel_time is null
group by users_package.id,
    shop_plan.id
`,
      [input.shop_id, input.member_id]
    );

    let plans = result.rows;

    return { memberInfo, plans };
  }

  async getValidMemberPlanSql(user_id: number) {
    return (
      await this.knex.raw(
        /*sql */ `
            select users_package.id as package_id,
                users_package.due_time,
                shop_plan.id as plan_id,
                shop_plan.package_qty,
                plan_name,
                shop.name,
                shop.id,
                due_period,
                shop.address,
                shop_plan.intro,
                shop_plan.price,
                shop_plan.image,
                (shop_plan.package_qty - count(booking.id)) as remain
            from users_package
        inner join shop_plan on shop_plan.id = users_package.shop_plan_id
        join  shop on shop_id = shop.id
        left join booking on booking.package_id = users_package.id
    where users_package.users_id = ?
        and booking.reject_time is null
        and booking.cancel_time is null
        and users_package.due_time > CURRENT_TIMESTAMP

    group by users_package.id,shop.id,
            shop_plan.id
    having (shop_plan.package_qty - count(booking.id)) > 0
        `,
        [user_id]
      )
    ).rows;
  }

  async getValidMemberPlan(user_id: number) {
    let validPackage = await this.getValidMemberPlanSql(user_id);
    return { validPackage: validPackage };
  }

  async getInvalidMemberPlan(user_id: number) {
    let validPackage = await this.getValidMemberPlanSql(user_id);

    const validPackageIdList = validPackage.map((v: any) => v.package_id);

    let invalidPackage = await this.knex.raw(
      /*sql */ `
    select users_package.id as package_id,
        users_package.due_time,
        shop_plan.id as plan_id,
        shop_plan.package_qty,
        plan_name,
        shop.name,
        shop.id,
        due_period,
        shop.address,
        shop_plan.price,
        shop_plan.intro,
        shop_plan.image,
        (shop_plan.package_qty - count(booking.id)) as remain
    from users_package
inner join shop_plan on shop_plan.id = users_package.shop_plan_id
join  shop on shop_id = shop.id
left join booking on booking.package_id = users_package.id
where users_package.id NOT IN(?)
group by users_package.id,shop.id,
    shop_plan.id
`,
      [`${validPackageIdList.join(",")}`]
    );
    return { invalidPackage: invalidPackage.rows };
  }

  async getShopPlanDetail(id: number) {
    let shopPlan = await this.knex("shop_plan")
      .select(
        "shop.id as shop_id",
        "shop_plan.id as shop_plan_id",
        "shop_plan.image as shop_plan_image",
        "shop_plan.plan_name as shop_plan_name",
        "shop_plan.price as shop_plan_price",
        "shop_plan.intro as shop_plan_intro",
        "shop_plan.cancel_period as shop_plan_cancel_period",
        "shop_plan.types as shop_plan_types",
        "shop_plan.due_period as shop_plan_due_period",
        "shop_plan.package_qty as shop_plan_package_qty",
        "shop_plan.plan_status as shop_plan_status",
        this.knex.raw(
          "TO_CHAR(shop_plan.buy_period,'YYYY-MM-DD')as shop_plan_buy_period"
        )
      )
      // .select("*")
      .where("shop_plan.id", "=", id)
      .join("shop", "shop.id", "=", "shop_plan.shop_id")
      .first();

    return shopPlan;
  }

  async postMemberSearch(data: any) {
    let search = await this.knex
      .select(
        "users.id as id",
        "nick_name as name",
        "phone_number as tel",
        "image as icon",
        "email as email"
      )
      .whereILike("nick_name", `%${data.data}%`)
      .from("users");
    return search;
  }
}
