import { Router } from "express";
import authcontroller from "./auth.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
const route = Router();

route.post("/signup", authcontroller.signup);

route.post("/login", authcontroller.login);

route.post("/contributor", authcontroller.contributor);

route.post("/contributorSignup", authcontroller.contributorSignup);

route.get("/getme", authMiddleware, authcontroller.getme)

route.get("/getAuthMe", authMiddleware, authcontroller.getAuthMe)

route.post("/logout", authcontroller.logout);

export default route;
