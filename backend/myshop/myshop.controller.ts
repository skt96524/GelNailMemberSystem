import { MyShopService } from "./myshop.service";
import { Request, Response } from "express";
import { getJWTPayload } from "../jwt";
import { object, string } from "cast.ts";
import { HttpError } from "../http.error";
import { shopImageForm } from "../utils/formidable";

export class MyShopController {
  constructor(public myShopService: MyShopService) {}

  getshopID = async (req: Request, res: Response) => {
    try {
      let userID = getJWTPayload(req).id;

      if (!userID) {
        return res.status(400).json({
          status: false,
          message: "no userID received from myShopProductPic controller",
        });
      }

      let shopID = await this.myShopService.getShopID(userID);
      return res
        .status(200)
        .json({ status: true, message: "able to fetch", result: shopID });
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  };

  getshopinfo = async (req: Request, res: Response) => {
    try {
      let id = req.query.id;
      if (!id) {
        return res.status(400).json({
          status: false,
          message: "no shopID received from myshopcontroller",
        });
      }

      let rows = await this.myShopService.getshopinfo(+id);
      return res
        .status(200)
        .json({ status: true, message: "able to fetch", result: rows });
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  };

  checkApplyShop = async (req: Request, res: Response) => {
    let jwt = getJWTPayload(req);
    let user_id = jwt.id;
    let identity = jwt.identity;

    if (identity == "shop_owner") {
      throw new HttpError(
        403,
        "You have already applying on created shop / own a shop."
      );
    }

    await this.myShopService.checkApplyShop(user_id);
    return res.json({});
  };

  updateShopStatus = async (req: Request, res: Response) => {
    let jwt = getJWTPayload(req);

    if (jwt.identity != "admin") {
      throw new HttpError(400, "Unauthorized");
    }

    let { status, id } = req.body;

    if (!id) {
      throw new HttpError(403, "Invalid shop id");
    }
    try {
      let message = await this.myShopService.updateShopStatus(status, id);

      res.status(200).json(message);
      return;
    } catch (error) {
      return res.status(400).json({ message: String(error) });
    }
  };

  createShop = async (req: Request, res: Response) => {
    shopImageForm.parse(req, async (err, fields, files) => {
      try {
        let jwt = getJWTPayload(req);
        let user = jwt.id;
        if (!user) {
          throw new HttpError(400, "invalid users id");
        }
        // let owner = 9;
        await this.myShopService.checkApplyShop(user);

        let body = object({
          name: string({}),
          area: string({}),
          address: string({}),
          open_time: string({}),
          close_time: string({}),
          intro: string({}),
          shop_tel: string({}),
        }).parse(fields);
        // let owner: number = Number(req.session["user_id"]);
        if (
          !fields.name ||
          !fields.area ||
          !fields.address ||
          !fields.open_time ||
          !fields.close_time ||
          !fields.intro ||
          !fields.shop_tel
        ) {
          return res.json({
            status: false,
            message: "Missing form information",
          });
        }

        if (body.shop_tel.length != 8) {
          return res.json({
            status: false,
            message: "Telephone number must be 8 characters",
          });
        }
        this.myShopService.createShop({
          owner: user,
          name: fields.name + "",
          image: (files as any).image.newFilename + "",
          area: fields.area + "",
          address: fields.address + "",
          open_time: fields.open_time + "",
          close_time: fields.close_time + "",
          intro: fields.intro + "",
          shop_tel: fields.shop_tel + "",
        });
        return res.status(200).json({});
      } catch (error) {
        return res.status(503).json(error);
      }
    });
  };
}
