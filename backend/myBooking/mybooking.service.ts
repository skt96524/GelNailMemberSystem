import { Knex } from "knex";
import { HttpError } from "../http.error";

export class MybookingService {
  constructor(public knex: Knex) {}

  bookingTable() {
    return this.knex("booking");
  }

  async getMyBookingConfirm(userID: number) {
    let myBookingConfirm = await this.knex
      .select(
        "booking.id",
        "plan_name",
        "shop_plan.intro",
        "shop_plan.image",
        "name",
        "address",
        "schedule",
        "price",
        "booking_status",
        "apply_time",
        "confirm_time",
        "reject_time",
        "cancel_time",
        "finish_time"
      )
      .from("booking")
      .join("shop_plan", "shop_plan_id", "shop_plan.id")
      .join("shop", "shop.id", "shop_id")
      .where("users_id", "=", userID)
      .andWhere("booking_status", "=", "confirm");
    if (!myBookingConfirm)
      throw new HttpError(404, "Confirmed Booking not found");
    return { myBookingConfirm };
  }

  async getMyBookingTbc(userID: number) {
    let myBookingTbc = await this.knex
      .select(
        "booking.id",
        "plan_name",
        "shop_plan.intro",
        "shop_plan.image",
        "shop.name",
        "address",
        "schedule",
        "price",
        "booking_status",
        "apply_time",
        "confirm_time",
        "reject_time",
        "cancel_time",
        "finish_time"
      )
      .from("booking")
      .join("shop_plan", "shop_plan_id", "=", "shop_plan.id")
      .join("shop", "shop.id", "=", "shop_id")
      .where("users_id", "=", userID)
      .andWhere("booking_status", "=", "apply")
      .orderBy("booking.schedule", "desc");
    if (!myBookingTbc) throw new HttpError(404, "Booking not found");

    return { myBookingTbc };
  }

  async getMyBookingHistory(userID: number) {
    let myBookingHistory = await this.knex
      .select(
        "booking.id",
        "plan_name",
        "shop_plan.intro",
        "shop_plan.image",
        "shop.name",
        "address",
        "schedule",
        "price",
        "booking_status",
        "apply_time",
        "confirm_time",
        "reject_time",
        "cancel_time",
        "finish_time"
      )
      .from("booking")
      .join("shop_plan", "shop_plan_id", "=", "shop_plan.id")
      .join("shop", "shop.id", "=", "shop_id")
      .where("booking_status", "cancel")
      .orWhere("booking_status", "finish")
      .orWhere("booking_status", "reject")
      .andWhere("users_id", userID)

      .orderBy("booking.schedule", "desc");
    if (!myBookingHistory)
      throw new HttpError(404, "Canceled booking not found");

    return { myBookingHistory };
  }

  async getMyBookingCancel(userID: number) {
    let myBookingCancel = await this.knex
      .select(
        "booking.id",
        "plan_name",
        "shop_plan.intro",
        "shop_plan.image",
        "shop.name",
        "address",
        "schedule",
        "price",
        "booking_status",
        "apply_time",
        "confirm_time",
        "reject_time",
        "cancel_time",
        "finish_time"
      )
      .from("booking")
      .join("shop_plan", "shop_plan_id", "=", "shop_plan.id")
      .join("shop", "shop.id", "=", "shop_id")
      .where("booking_status", "cancel")
      .andWhere("users_id", userID)

      .orderBy("booking.schedule", "desc");
    if (!myBookingCancel)
      throw new HttpError(404, "Canceled booking not found");

    return { myBookingCancel };
  }

  async getMyBookingReject(userID: number) {
    let myBookingReject = await this.knex
      .select(
        "booking.id",
        "plan_name",
        "shop_plan.intro",
        "shop_plan.image",
        "shop.name",
        "address",
        "schedule",
        "price",
        "booking_status",
        "apply_time",
        "confirm_time",
        "reject_time",
        "cancel_time",
        "finish_time"
      )
      .from("booking")
      .join("shop_plan", "shop_plan_id", "=", "shop_plan.id")
      .join("shop", "shop.id", "=", "shop_id")
      .where("users_id", "=", userID)
      .andWhere("booking_status", "=", "reject")
      .whereNotNull("reject_time")

      .orderBy("booking.schedule", "desc");
    if (!myBookingReject)
      throw new HttpError(404, "Rejected Booking not found");

    return { myBookingReject };
  }

  async getMyBookingFinish(userID: number) {
    let myBookingFinish = await this.knex
      .select(
        "booking.id",
        "plan_name",
        "shop_plan.intro",
        "shop_plan.image",
        "shop.name",
        "address",
        "schedule",
        "price",
        "booking_status",
        "apply_time",
        "confirm_time",
        "reject_time",
        "cancel_time",
        "finish_time"
      )
      .from("booking")
      .join("shop_plan", "shop_plan_id", "=", "shop_plan.id")
      .join("shop", "shop.id", "=", "shop_id")
      .where("users_id", "=", userID)
      .andWhere("booking_status", "=", "finish")
      .whereNotNull("finish_time")

      .orderBy("booking.schedule", "desc");
    if (!myBookingFinish)
      throw new HttpError(404, "Finished_booking not found");

    return { myBookingFinish };
  }

  async getBookingDetail(booking_id: string, userID: number) {
    let bookingDetail = await this.knex()
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
      .from("booking")
      .join("shop_plan", "shop_plan_id", "shop_plan.id")
      .join("shop", "shop_id", "shop.id")
      .join("users", "users.id", "booking.users_id")
      .where("booking.id", booking_id)
      .first();

    if (!bookingDetail) throw new HttpError(404, "booking not found");
    if (
      bookingDetail.users_id != userID &&
      bookingDetail.shop_owner != userID
    ) {
      throw new HttpError(403, "Unauthorized");
    }

    return {
      bookingDetail,
    };
  }

  async updateBookingStatus(
    action: string,
    booking_id: number,
    users_id: number
  ) {
    let bookingDetail = await this.knex()
      .select(
        "booking.id as booking_id",
        "shop.id as shop_id",
        "shop.name as shop_name",
        "shop.owner as shop_owner",
        "shop.shop_tel as shop_tel",
        "users_id",
        "plan_name",
        "shop_plan.intro as shop_plan_intro",
        "price",
        "booking_status",
        "schedule",
        "address",
        "cancel_period"
      )
      .from("booking")
      .join("shop_plan", "shop_plan_id", "shop_plan.id")
      .join("shop", "shop_id", "shop.id")
      .where("booking.id", booking_id)
      .first();

    if (
      bookingDetail.users_id != users_id &&
      bookingDetail.shop_owner != users_id
    ) {
      throw new HttpError(403, "Unauthorized");
    }

    let thisTable = this.bookingTable().where({ id: booking_id });
    let notification = {
      users_id: users_id,
      link: "/booking/" + bookingDetail.booking_id,
      content: "",
    };
    let now = new Date();

    if (action == "cancel") {
      bookingDetail.cancel_before = new Date(
        Number(bookingDetail.schedule) - bookingDetail.cancel_period
      );
      if (
        bookingDetail.cancel_before < now &&
        bookingDetail.shop_owner != users_id
      ) {
        throw new HttpError(400, "Unable to cancel booking");
      }

      thisTable = thisTable.update({
        booking_status: "cancel",
        cancel_time: now,
      });

      if (bookingDetail.shop_owner == users_id) {
        notification.content = `Your booking has been canceled by ${bookingDetail.shop_name}`;
      } else {
        notification.users_id = bookingDetail.shop_owner;
        notification.content = `Booking: ${new Date(
          bookingDetail.schedule
        ).toLocaleString()} has been canceled by User`;
      }
    }

    if (action == "confirm") {
      if (
        bookingDetail.booking_status != "apply" ||
        bookingDetail.shop_owner != users_id
      ) {
        throw new HttpError(
          403,
          "Unauthorized / Booking status is not Applying, can't reconfirm booking"
        );
      }

      thisTable = thisTable.update({
        booking_status: "confirm",
        confirm_time: now,
      });
      notification.content = `Your Booking: ${new Date(
        bookingDetail.schedule
      ).toLocaleString()} has been confirmed by ${bookingDetail.shop_name}`;
    }

    if (action == "reject") {
      if (
        bookingDetail.booking_status != "apply" ||
        bookingDetail.shop_owner != users_id
      ) {
        throw new HttpError(
          403,
          "Unauthorized / Booking status is not Applying, can't reconfirm booking"
        );
      }

      thisTable = thisTable.update({
        booking_status: "reject",
        reject_time: now,
      });
      notification.content = `Your Booking: ${new Date(
        bookingDetail.schedule
      ).toLocaleString()} has been rejected by ${bookingDetail.shop_name}`;
    }

    if (action == "finish") {
      if (
        bookingDetail.booking_status != "confirm" ||
        bookingDetail.shop_owner != users_id
      ) {
        throw new HttpError(
          403,
          "Unauthorized / Booking status is not confirmed schedule, can't update booking"
        );
      }

      thisTable = thisTable.update({
        booking_status: "finish",
        reject_time: now,
      });

      notification.content = `Your Booking: ${new Date(
        bookingDetail.schedule
      ).toLocaleString()} has been finished by ${bookingDetail.shop_name}`;
    }

    await thisTable;
    await this.knex("notification").insert(notification);

    return { message: "update successful" };
  }

  async newBooking(filter: {
    plan_id: number;
    booker: number;
    users_id: number;
    schedule: string;
    package_id?: number;
  }) {
    let message;
    let data = {
      shop_plan_id: filter.plan_id,
      users_id: filter.booker,
      schedule: filter.schedule,
      apply_time: new Date(),
      booking_status: "apply",
    };
    let notification = {
      link: "/booking/",
      content: new Date(filter.schedule).toLocaleString(),
    };

    if (filter.package_id) {
      let validPackage = await this.knex.raw(
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
            shop_plan.image,
            shop.owner,
            price,
            buy_time,
            (shop_plan.package_qty - count(booking.id)) as remain
        from users_package
    inner join shop_plan on shop_plan.id = users_package.shop_plan_id
    join  shop on shop_id = shop.id
    left join booking on booking.package_id = users_package.id
    where users_package.users_id = 29 and users_package.id = 13
    and booking.reject_time is null
    and booking.cancel_time is null
    and users_package.due_time > CURRENT_TIMESTAMP

group by users_package.id,shop.id,
        shop_plan.id
having (shop_plan.package_qty - count(booking.id)) > 0
    `,
        [filter.booker, filter.package_id]
      );
      if (!validPackage) {
        throw new HttpError(403, "Package remaining not enough for booking");
      }
      //   let package_id= filter.package_id
      data["package_id"] = filter.package_id;
    }
    let shopOwner = await this.knex("shop_plan")
      .select("owner", "name")
      .where("shop_plan.id", "=", filter.plan_id)
      .rightJoin("shop", "shop.id", "shop_plan.shop_id")
      .first();
    if (filter.booker == filter.users_id) {
      notification["users_id"] = shopOwner.owner;
      if (shopOwner.owner != filter.users_id) {
        notification["content"] =
          "你的顧客已提交預約" + notification.content + "請進行確認";
        message = "你的預約已提交，正待店舖確認，你亦可到'我的預約'查看狀態";
      }
    }
    if (shopOwner.owner == filter.users_id) {
      data["booking_status"] = "confirm";
      data["confirm_time"] = data.apply_time;
      notification["users_id"] = filter.booker;
      notification[
        "content"
      ] = `${shopOwner.name} 已為你預約行程： ${notification.content}`;
      message = "成功為顧客安排行程";
    }
    let id = await this.bookingTable().insert(data).returning("id");
    if (id) {
      notification["link"] = notification.link + id[0].id;
    }

    await this.knex("notification").insert(notification);
    return { message };
  }
}
