import { ShopService } from "./shop.service";
import { Request, Response } from "express";
import { int, object, optional, string } from "cast.ts";
import { getJWTPayload } from "../jwt";
// import { HttpError } from "../http.error";

export class ShopController {
  constructor(public shopService: ShopService) {}

  getShopList = async (req: Request, res: Response) => {
    // let productType = req.query.productType || "";
    // let offset = req.query.offset || "";
    // let searchText = req.query.searchText || "";
    try {
      let { query } = object({
        query: object({
          type: optional(string({ trim: true })),
          offset: optional(int({ min: 0 })),
          searchText: optional(string({ trim: true })),
          area: optional(string({ trim: true })),
        }),
      }).parse(req);
      let shopList = await this.shopService.getShopList(query);

      return res.status(200).json(shopList);
    } catch (err) {
      return res.json(err);
    }
  };

  getShopBooking = async (req: Request, res: Response) => {
    let jwt = getJWTPayload(req);
    let dateValue = String(req.query.dateValue);
    let input = { userID: jwt.id, dateValue: dateValue };
    if (!dateValue) {
      res.json({});
    }
    try {
      let bookingDetail = await this.shopService.getShopBooking(input);
      return res.json({ bookingDetail });
    } catch (error) {
      return res.status(400).json({ error: String(error) });
    }
  };
}
