import { knex } from "./knex";
import { MemberService } from "./myshop/member.service";
import { MyShopService } from "./myshop/myshop.service";
import { ProductPicService } from "./myshop/productPic.service";

export let memberService = new MemberService(knex);
export let myShopService = new MyShopService(knex);
export let productPicService = new ProductPicService(knex);
