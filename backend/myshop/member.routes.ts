import express from "express";
import { memberService, myShopService } from "../services";
import { MemberController } from "./member.controller";

export const memberRouter = express.Router();
let memberController = new MemberController(memberService, myShopService);

memberRouter.post("/memberslist", memberController.postMembersList);
memberRouter.get("/members/:id", memberController.getMemberDetail);
memberRouter.get("/validmemberPlan", memberController.getValidMemberPlan);
memberRouter.get("/InvalidmemberPlan", memberController.getInvalidMemberPlan);
memberRouter.get("/shopPlanDetail", memberController.getShopPlanDetail);
memberRouter.post("/memberSearch", memberController.postMemberSearch);
memberRouter.post("/addmemberslist", memberController.getAddMemberData);
memberRouter.post("/addmember", memberController.addMember);
