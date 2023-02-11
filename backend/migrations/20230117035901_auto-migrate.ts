import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable("users"))) {
    await knex.schema.createTable("users", (table) => {
      table.increments("id");
      table.string("username", 60).notNullable().unique();
      table.string("hash_password", 60).notNullable();
      table.string("nick_name", 50).notNullable();
      table.integer("phone_number");
      table.string("email", 64).notNullable();
      table
        .enum("identity", ["admin", "shop_owner", "member"])
        .defaultTo("member")
        .notNullable();
      table
        .enum("users_status", ["active", "inactive"])
        .defaultTo("active")
        .notNullable();
      table.string("image", 1000).nullable();
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("article"))) {
    await knex.schema.createTable("article", (table) => {
      table.increments("id");
      table.integer("users_id").unsigned().notNullable().references("users.id");
      table.string("title", 255).notNullable();
      table.string("main_img", 1000).notNullable();
      table.text("html_content").notNullable();
      table.integer("views");
      table
        .enum("article_status", ["active", "inactive"])
        .defaultTo("active")
        .notNullable();
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("shop"))) {
    await knex.schema.createTable("shop", (table) => {
      table.increments("id");
      table.integer("owner").unsigned().notNullable().references("users.id");
      table.string("name", 255).notNullable();
      table.string("area", 20).notNullable();
      table.string("address", 255).notNullable();
      table.time("open_time").notNullable();
      table.time("close_time").notNullable();
      table.text("intro").notNullable();
      table.string("image", 1000).notNullable();
      table
        .enum("shop_status", ["applying", "active", "inactive"])
        .defaultTo("applying")
        .notNullable();
      table.integer("shop_tel").notNullable();
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("message"))) {
    await knex.schema.createTable("message", (table) => {
      table.increments("id");
      table.integer("sender").unsigned().references("users.id");
      table.integer("receiver").unsigned().references("users.id");
      table.integer("sender_shop").unsigned().references("shop.id");
      table.integer("receiver_shop").unsigned().references("shop.id");
      table.text("content").notNullable();
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("shop_products_photo"))) {
    await knex.schema.createTable("shop_products_photo", (table) => {
      table.increments("id");
      table.string("images", 1000).notNullable();
      table.text("intro");
      table.integer("shop_id").unsigned().notNullable().references("shop.id");
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("like"))) {
    await knex.schema.createTable("like", (table) => {
      table.increments("id");
      table.integer("users_id").unsigned().references("users.id");
      table.integer("shop_id").unsigned().references("shop.id");
      table.integer("article_id").unsigned().references("article.id");
      table
        .integer("products_id")
        .unsigned()
        .references("shop_products_photo.id");
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("collection"))) {
    await knex.schema.createTable("collection", (table) => {
      table.increments("id");
      table
        .integer("collection_owner_id")
        .unsigned()
        .notNullable()
        .references("users.id");
      table.integer("shop_id").unsigned().references("shop.id");
      table.integer("article_id").unsigned().references("article.id");
      table.integer("follow_id").unsigned().references("users.id");
      table
        .integer("products_id")
        .unsigned()
        .references("shop_products_photo.id");
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("shop_intro_photos"))) {
    await knex.schema.createTable("shop_intro_photos", (table) => {
      table.increments("id");
      table.string("images", 1000).notNullable();
      table.integer("shop_id").unsigned().notNullable().references("shop.id");
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("shop_plan"))) {
    await knex.schema.createTable("shop_plan", (table) => {
      table.increments("id");
      table.string("plan_name", 255).notNullable();
      table.text("intro").notNullable();
      table.string("image", 1000).notNullable();
      table.integer("shop_id").unsigned().notNullable().references("shop.id");
      table.integer("cancel_period");
      table.integer("price").notNullable();
      table.enum("types", ["limit", "package"]).notNullable();
      table.timestamp("buy_period").notNullable();
      table.integer("due_period");
      table.integer("package_qty");
      table
        .enum("plan_status", ["active", "inactive"])
        .defaultTo("active")
        .notNullable();
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("shop_members"))) {
    await knex.schema.createTable("shop_members", (table) => {
      table.increments("id");
      table.integer("users_id").unsigned().notNullable().references("users.id");
      table.integer("shop_id").unsigned().notNullable().references("shop.id");
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("booking"))) {
    await knex.schema.createTable("booking", (table) => {
      table.increments("id");
      table
        .integer("shop_plan_id")
        .unsigned()
        .notNullable()
        .references("shop_plan.id");
      table.integer("users_id").unsigned().notNullable().references("users.id");
      table.timestamp("schedule").notNullable();
      table
        .enum("booking_status", [
          "apply",
          "confirm",
          "reject",
          "cancel",
          "finish",
        ])
        .defaultTo("apply")
        .notNullable();
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("notification"))) {
    await knex.schema.createTable("notification", (table) => {
      table.increments("id");
      table.integer("users_id").unsigned().notNullable().references("users.id");
      table.string("link", 255).notNullable();
      table.text("content").notNullable();
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("users_package"))) {
    await knex.schema.createTable("users_package", (table) => {
      table.increments("id");
      table.integer("users_id").unsigned().notNullable().references("users.id");
      table
        .integer("shop_plan_id")
        .unsigned()
        .notNullable()
        .references("shop_plan.id");
      table.integer("original_qty").notNullable();
      table.integer("remain_qty").notNullable();
      table.integer("buy_price").notNullable();
      table.timestamp("due_time").notNullable();
      table.timestamps(false, true);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("users_package");
  await knex.schema.dropTableIfExists("notification");
  await knex.schema.dropTableIfExists("booking");
  await knex.schema.dropTableIfExists("shop_members");
  await knex.schema.dropTableIfExists("shop_plan");
  await knex.schema.dropTableIfExists("shop_intro_photos");
  await knex.schema.dropTableIfExists("collection");
  await knex.schema.dropTableIfExists("like");
  await knex.schema.dropTableIfExists("shop_products_photo");
  await knex.schema.dropTableIfExists("message");
  await knex.schema.dropTableIfExists("shop");
  await knex.schema.dropTableIfExists("article");
  await knex.schema.dropTableIfExists("users");
}
