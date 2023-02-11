import express from "express";
import { knex } from "../knex";
import { myShopService } from "../services";
import { form } from "../uploads";
import { MyShopPlanController } from "./myshopplan.controller";
import { MyShopPlanService } from "./myshopplan.service";

export const myshopplanRouter = express.Router();
let myshopplanService = new MyShopPlanService(knex);
let myshopplanController = new MyShopPlanController(
  myshopplanService,
  form,
  myShopService
);

myshopplanRouter.get("/my-shop/plans", myshopplanController.getMyShopPlanList);

myshopplanRouter.post(
  "/shops/editshopplan",
  myshopplanController.postEditShopPlan
);

myshopplanRouter.post("/inactive", myshopplanController.patchEditShopPlan);
