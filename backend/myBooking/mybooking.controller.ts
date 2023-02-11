import { HttpController } from "../http.controller";
import { Request } from "express";
import { MybookingService } from "./mybooking.service";
import { getJWTPayload } from "../jwt";
import { HttpError } from "../http.error";

export class MybookingController extends HttpController {
  constructor(public myBookingService: MybookingService) {
    super();
    this.router.get(
      "/mybookingConfirm",
      this.wrapMethod(this.getMyBookingConfirm)
    );
    this.router.get("/mybookingTbc", this.wrapMethod(this.getMyBookingTbc));
    this.router.get(
      "/mybookingReject",
      this.wrapMethod(this.getMyBookingReject)
    );
    this.router.get(
      "/mybookingCancel",
      this.wrapMethod(this.getMyBookingCancel)
    );
    this.router.get(
      "/mybookingFinish",
      this.wrapMethod(this.getMyBookingFinish)
    );
    this.router.get(
      "/mybookingHistory",
      this.wrapMethod(this.getMyBookingHistory)
    );
    this.router.get("/bookingDetail/:id", this.wrapMethod(this.bookingDetail));
    this.router.post(
      "/updatebookingstatus",
      this.wrapMethod(this.updateBookingStatus)
    );
    this.router.post("/newbooking", this.wrapMethod(this.newBooking));

    // this.router.delete("/booking", this.wrapMethod, (this.cancelBooking));

    // this.router.post("/booking", this.wrapMethod, (this.book));
  }

  getMyBookingConfirm = (req: Request) => {
    let jwt = getJWTPayload(req);
    return this.myBookingService.getMyBookingConfirm(jwt.id);
  };

  getMyBookingTbc = (req: Request) => {
    let jwt = getJWTPayload(req);
    return this.myBookingService.getMyBookingTbc(jwt.id);
  };

  getMyBookingReject = (req: Request) => {
    let jwt = getJWTPayload(req);
    return this.myBookingService.getMyBookingReject(jwt.id);
  };

  getMyBookingCancel = (req: Request) => {
    let jwt = getJWTPayload(req);
    return this.myBookingService.getMyBookingCancel(jwt.id);
  };

  getMyBookingFinish = (req: Request) => {
    let jwt = getJWTPayload(req);
    return this.myBookingService.getMyBookingFinish(jwt.id);
  };

  getMyBookingHistory = (req: Request) => {
    let jwt = getJWTPayload(req);
    return this.myBookingService.getMyBookingHistory(jwt.id);
  };

  bookingDetail = (req: Request) => {
    let booking_id = req.params.id;
    let jwt = getJWTPayload(req);
    if (!booking_id) {
      throw new HttpError(400, "invalid booking id");
    }
    return this.myBookingService.getBookingDetail(booking_id, jwt.id);
  };
  updateBookingStatus = (req: Request) => {
    let { action, booking_id } = req.body;
    let jwt = getJWTPayload(req);
    let users_id = jwt.id;
    if (!jwt) {
      throw new HttpError(403, "Pls login first");
    }
    return this.myBookingService.updateBookingStatus(
      action,
      booking_id,
      users_id
    );
  };

  newBooking = (req: Request) => {
    let jwt = getJWTPayload(req);
    let users_id = jwt.id;
    let { plan_id, package_id, booker, schedule } = req.body;
    let query = { plan_id, booker, users_id, schedule };
    if (package_id) {
      query = { ...query, ...package_id };
    }
    if (!jwt) {
      throw new HttpError(403, "Pls login first");
    }
    return this.myBookingService.newBooking(query);
  };
}
