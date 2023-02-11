import { Knex } from "knex";
import { comparePassword, hashPassword } from "../hash";
import { HttpError } from "../http.error";
import { encodeJWT } from "../jwt";

export class UserService {
  constructor(public knex: Knex) {}

  table() {
    return this.knex("users");
  }

  async login(users: { username: string; password: string }) {
    let row = await this.table()
      .select(`id`, `hash_password`, `identity`)
      .where("username", users.username)
      .first();
    if (!row) throw new HttpError(404, "user not found");
    let is_matched = await comparePassword({
      password: users.password,
      hash_password: row.hash_password,
    });

    if (!is_matched)
      throw new HttpError(401, "username or password not matched");

    let token = encodeJWT({ id: row.id, identity: row.identity });
    return { token };
  }

  async signup(users: {
    username: string;
    password: string;
    nick_name: string;
    email: string;
    identity: string;
  }) {
    let [{ id }] = await this.table()
      .insert({
        username: users.username,
        hash_password: await hashPassword(users.password),
        nick_name: users.nick_name,
        email: users.email,
      })
      .returning("id");
    return id;
  }

  async getProfile(id: number) {
    let profile = await this.table()
      .select("id", "username", "nick_name", "phone_number", "email", "image")
      .where({ id })
      .first();
    if (!profile) throw new HttpError(404, "user not found");
    return { profile };
  }

  async getUsersProfile(users_id: string) {
    let usersProfile = await this.knex
      .select(
        "username",
        "nick_name",
        "users.image",
        "identity",
        "name",
        "address",
        "intro",
        "shop.id as shop_id",
        "shop.image as shop_image"
      )
      .from("users")
      .where("users.id", "=", users_id)
      .leftJoin("shop", "owner", "=", "users.id")
      .first();

    if (usersProfile.length == 0) {
      return { message: "invalid users no." };
    }
    return { usersProfile };
  }

  async uploadProfilePic(usersID: number, image: string) {
    await this.knex("users").update({ image }).where("id", "=", usersID);
    return;
  }

  async getPerformance(users_id: number, id: number | string) {
    let collected = await this.knex("collection")
      .select("id as collection_id")
      .where("collection_owner_id", "=", users_id)
      .andWhere("follow_id", "=", id)
      .first();

    return collected;
  }

  async addUsersCollection(users_id: number, id: number | string) {
    await this.knex("collection").insert({
      collection_owner_id: users_id,
      follow_id: id,
    });
    return;
  }

  async removeUsersCollection(users_id: number, id: number | string) {
    await this.knex("collection")
      .delete()
      .where("collection_owner_id", "=", users_id)
      .andWhere("follow_id", "=", id);
    return;
  }
}
