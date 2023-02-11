import { MyShopPlanService } from "./myshopplan.service";
import { NextFunction, Request, Response } from "express";
import { MyShopService } from "./myshop.service";
import Formidable from "formidable/Formidable";
import { getJWTPayload } from "../jwt";
import { HttpError } from "../http.error";
import { toArray } from "../uploads";

export class MyShopPlanController {
  constructor(
    public myShopPlanService: MyShopPlanService,
    private form: Formidable,
    public myShopService: MyShopService
  ) {}

  getMyShopPlanList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let user_id = getJWTPayload(req).id;
      let shop_id = await this.myShopService.getShopID(user_id);
      let json = await this.myShopPlanService.getMyShopPlanList(shop_id);
      res.status(200).json(json);
    } catch (error) {
      next(error);
    }
  };

  postEditShopPlan = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    this.form.parse(req, async (error, fields, files) => {
      try {
        if (error) throw error;

        let image = toArray(files.image)[0]?.newFilename;
        if (!image) throw new HttpError(400, "missing image");

        let user_id = getJWTPayload(req).id;
        let shop_id = await this.myShopService.getShopID(user_id);

        let plan_name = fields.plan_name;
        let intro = fields.intro;
        let cancel_period = +fields.cancel_period;
        let price = +fields.price;
        let types = fields.types + "";
        let due_period = +fields.due_period;
        let buy_period = fields.buy_period + "";
        let package_qty = +fields.package_qty;
        let period = +fields.period;

        await this.myShopService.checkShopOwner({ user_id, shop_id });

        await this.myShopPlanService.postEditShopPlan({
          plan_name,
          intro,
          image,
          shop_id,
          cancel_period,
          price,
          types,
          due_period,
          buy_period,
          package_qty,
          period,
        });

        res.status(200).json({ message: "success" });
      } catch (error) {
        next(error);
      }
    });
  };
  patchEditShopPlan = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let { id } = req.body;
      if (!id) throw new HttpError(400, "invalid product id");
      await this.myShopPlanService.patchEditShopPlan(id);
      res.status(200).json({ message: "success" });
    } catch (error) {
      next(error);
    }
  };
}
