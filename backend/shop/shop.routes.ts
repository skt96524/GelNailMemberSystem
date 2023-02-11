import express from "express";
import { knex } from "../knex";
import { ShopController } from "./shop.controller";
import { ShopService } from "./shop.service";

export const shopRouter = express.Router();
let shopService = new ShopService(knex);
let shopController = new ShopController(shopService);

shopRouter.get("/shopList", shopController.getShopList);
shopRouter.get("/shopbooking", shopController.getShopBooking);
