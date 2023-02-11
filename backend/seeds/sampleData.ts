import { Knex } from "knex";
import { article, plans, productnails, shops, users } from "../excel";
import { hashPassword } from "../hash";

export async function seed(knex: Knex): Promise<void> {
  async function seedRow(table: any, data: any): Promise<[{ id: number }]> {
    let { hash_password, ...filter } = data;

    let row = await knex(table).select("id").where(filter).first();
    if (row) {
      return [{ id: row.id }];
    }

    let [{ id }] = await knex.insert(data).into(table).returning("id");

    return [{ id }];
  }

  function generateRng() {
    let rand = Math.floor(Math.random() * 89) + 1;
    return rand;
  }

  // Deletes ALL existing entries
  await knex("collection").del();
  await knex("like").del();
  await knex("article").del();
  await knex("message").del();
  await knex("notification").del();
  await knex("booking").del();
  await knex("users_package").del();
  await knex("shop_members").del();
  await knex("shop_products_photo").del();
  await knex("shop_intro_photos").del();
  await knex("shop_plan").del();
  await knex("shop").del();
  await knex("users").del();
  // Inserts seed entries

  let hash_password = await hashPassword("kkkkkkkk");

  let userIDArr = [];
  let shopIDArr = [];
  let planIDArr = [];
  let packageIDArr = [];

  for (let i = 0; i < users.length; i++) {
    let userID = await seedRow("users", {
      username: users[i].username,
      hash_password: hash_password,
      nick_name: users[i].nickname,
      phone_number: 69993641,
      email: "Doonygayclub@gmail.com",
      identity: "shop_owner",
      image: users[i].image,
    });
    userIDArr.push(userID[0].id);

    let shopID = await seedRow("shop", {
      owner: userID[0].id,
      name: shops[i].shopname,
      area: shops[i].area,
      address: shops[i].address,
      open_time: "13:30",
      close_time: "23:00",
      image: shops[i].image,
      intro: shops[i].intro,
      shop_status: "active",
      shop_tel: 21800000,
    });
    shopIDArr.push(shopID[0].id);
  }

  for (let i = 0; i < plans.length; i++) {
    let planID = await seedRow("shop_plan", {
      plan_name: plans[i].plan_name,
      intro: plans[i].intro,
      image: plans[i].image,
      shop_id: shopIDArr[0],
      cancel_period: 172800000,
      price: 5000,
      types: "package",
      buy_period: new Date(),
      due_period: 31556952000,
      package_qty: 10,
      plan_status: "active",
    });
    planIDArr.push(planID[0].id);
  }

  for (let i = 0; i < planIDArr.length; i++) {
    let packageID = await seedRow("users_package", {
      users_id: userIDArr[0],
      shop_plan_id: planIDArr[i],
      buy_time: new Date("01-02-2023"),
      due_time: new Date("01-02-2024"),
    });
    packageIDArr.push(packageID[0].id);
  }

  for (let i = 0; i < packageIDArr.length; i++) {
    await seedRow("booking", {
      shop_plan_id: planIDArr[0],
      users_id: userIDArr[0],
      package_id: packageIDArr[i],
      schedule: "2023-03-05",
      booking_status: "apply",
      apply_time: "2023-02-09",
    });
  }

  for (let i = 0; i < article.length; i++) {
    await seedRow("article", {
      users_id: userIDArr[0],
      title: article[i].title,
      main_img: article[i].main_img,
      html_content: article[i].html_content,
      views: article[i].views,
      article_status: article[i].article_status,
    });
  }

  for (let i = 0; i < shops.length; i++) {
    for (let a = 0; a < 10; a++) {
      await seedRow("shop_products_photo", {
        images: productnails[generateRng()].image,
        shop_id: shopIDArr[0],
      });
    }
  }

  await seedRow("users", {
    username: "admin",
    hash_password: hash_password,
    nick_name: "admin",
    phone_number: 69993641,
    email: "admin@gmail.com",
    identity: "admin",
    image: "https://picsum.photos/seed/admin-2/200/200",
  });
}
