import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("booking", (table) => {
    table.integer("package_id").notNullable().references("users_package.id");
    table.timestamp("apply_time").notNullable();
    table.timestamp("confirm_times");
    table.timestamp("reject_time");
    table.timestamp("cancel_time ");
    table.timestamp("finish_time");
    table.renameColumn("confirm_times", "confirm_time");
  });

  await knex.schema.table("users_package", (table) => {
    table.dropColumn("original_qty");
    table.dropColumn("buy_price");
    table.dropColumn("remain_qty");
  });

  await knex.schema.alterTable("shop_plan", (table) => {
    table.bigint("due_period").alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("booking", (table) => {
    table.dropColumn("package_id");
    table.dropColumn("apply_time");
    table.dropColumn("confirm_times");
    table.dropColumn("reject_time");
    table.dropColumn("cancel_time ");
    table.dropColumn("finish_time");
    table.renameColumn("confirm_time", "confirm_times");
  });
  await knex.schema.table("users_package", (table) => {
    table.integer("original_qty");
    table.integer("buy_price");
    table.integer("remain_qty");
  });
}
