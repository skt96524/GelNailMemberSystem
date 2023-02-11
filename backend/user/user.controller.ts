import { HttpController } from "../http.controller";
import { Request } from "express";
import { object, string } from "cast.ts";
import { UserService } from "./user.service";
import { HttpError } from "../http.error";
import { getJWTPayload } from "../jwt";
import { userProfilePicForm } from "../utils/formidable";

let usernamePasswordParserL = object({
  username: string({ nonEmpty: true, minLength: 3, maxLength: 32 }),
  password: string({ nonEmpty: true, minLength: 6 }),
});

export class UserController extends HttpController {
  constructor(public userService: UserService) {
    super();

    this.router.post("/login", this.wrapMethod(this.login));
    this.router.post("/signup", this.wrapMethod(this.signup));
    this.router.get("/userinfo", this.wrapMethod(this.userinfo));
    this.router.get("/usersprofile/:id", this.wrapMethod(this.usersProfile));
    this.router.get(
      "/performanceUsers/:id",
      this.wrapMethod(this.getPerformance)
    );
    this.router.post("/collectusers", this.wrapMethod(this.addUsersCollection));
    this.router.delete(
      "/collectusers",
      this.wrapMethod(this.removeUsersCollection)
    );
    this.router.post(
      "/profilePic",
      (req, res, next) => {
        userProfilePicForm.parse(req, (err, fields, files) => {
          if (err) {
            next(err);
            return;
          }
          req.body = { ...fields, ...files };
          next();
        });
      },
      this.wrapMethod(this.uploadProfilePic)
    );
  }

  uploadProfilePic = (req: Request) => {
    let user = getJWTPayload(req);

    let body = object({
      image: object({
        newFilename: string({ nonEmpty: true }),
      }),
    }).parse(req.body);

    return this.userService.uploadProfilePic(user.id, body.image.newFilename);
  };

  login = (req: Request) => {
    let user = object({
      body: usernamePasswordParserL,
    }).parse(req).body;
    return this.userService.login(user);
  };

  signup = (req: Request) => {
    let user = req.body;
    if (!user.username) throw new HttpError(400, "Error:Missing username");
    if (typeof user.username !== "string" || user.username.length < 4) {
      throw new HttpError(
        400,
        "Error:invalid username, should have at least 4 characters"
      );
    }

    if (!user.password) throw new HttpError(400, "Missing password");
    if (!user.email) throw new HttpError(400, "Error:Missing email");
    if (typeof user.password !== "string" || user.password.length < 8) {
      throw new HttpError(
        400,
        "Error:invalid password,should have at least 8 characters "
      );
    }

    return this.userService.signup(user);
  };
  userinfo = (req: Request) => {
    let jwt = getJWTPayload(req);
    return this.userService.getProfile(jwt.id);
  };

  usersProfile = (req: Request) => {
    let users_id = req.params.id;
    if (!users_id) {
      throw new HttpError(400, "invalid users id");
    }
    return this.userService.getUsersProfile(users_id);
  };

  getPerformance = async (req: Request) => {
    let jwt = getJWTPayload(req);
    let users_id = jwt.id;
    let id = req.params.id;

    let result = await this.userService.getPerformance(users_id, id);
    return result;
  };

  addUsersCollection = async (req: Request) => {
    let jwt = getJWTPayload(req);
    const users_id = jwt.id;
    let { id } = req.body;
    if (!jwt.id) {
      throw new HttpError(400, "Unauthorized");
    }
    await this.userService.addUsersCollection(users_id, id);
    return { success: "Liked" };
  };
  removeUsersCollection = async (req: Request) => {
    let jwt = getJWTPayload(req);
    const users_id = jwt.id;
    let { id } = req.body;
    if (!jwt.id) {
      throw new HttpError(400, "Unauthorized");
    }
    await this.userService.removeUsersCollection(users_id, id);
    return { success: "UnLiked" };
  };
}
