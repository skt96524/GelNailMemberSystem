import { knex } from "./knex";
import { getJWTPayload } from "./jwt";
import { Request, Response, NextFunction } from "express";

// export function isLoggedApi(req: Request, res: Response, next: NextFunction) {

//     let jwt = getJWTPayload(req);
//     if (jwt.id) {
//       next();
//     } else {
//       res.redirect("/login.html");
//     }
//   }

export async function owner(req: Request, res: Response, next: NextFunction) {
  try {
    let shop_id: string = String(req.query.shop);
    let jwt = getJWTPayload(req);
    let user_id = jwt.id;
    let identify = jwt.identity;

    if (!user_id || identify == "member") {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    let result = await knex
      .select()
      .from("shop")
      .where("id", "=", shop_id)
      .andWhere("owner", "=", user_id);

    if (result[0].length == 0) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
  } catch (error) {
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
    return;
  }

  next();
}

export async function admin(req: Request, res: Response, next: NextFunction) {
  let jwt = getJWTPayload(req);
  let user_id = jwt.id;
  let identify = jwt.identity;

  if (!user_id || identify != "admin") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
}
