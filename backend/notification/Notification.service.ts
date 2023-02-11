import { Knex } from "knex";

export class NotificationService {
  constructor(public knex: Knex) {}

  async getNotification(filter: { users_id: number; offset?: number }) {
    let query = this.knex("notification")
      .select()
      .where("users_id", filter.users_id)
      .orderBy("created_at", "desc");
    if (filter.offset) {
      query = query.offset(filter.offset);
    }
    let notificationList = await query.limit(15);
    return { notificationList };
  }
}
