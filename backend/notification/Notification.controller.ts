import { HttpController } from "../http.controller";
import { Request } from "express";
import { NotificationService } from "./Notification.service";
import { getJWTPayload } from "../jwt";
import { int, object, optional } from "cast.ts";

export class NotificationController extends HttpController {
  constructor(public notificationService: NotificationService) {
    super();
    this.router.get("/notification", this.wrapMethod(this.getNotification));
  }

  getNotification = (req: Request) => {
    let jwt = getJWTPayload(req);
    let users_id = jwt.id;
    let { query } = object({
      query: object({
        offset: optional(int({ min: 0 })),
      }),
    }).parse(req);
    let filter = { ...query, users_id };
    return this.notificationService.getNotification(filter);
  };
}
