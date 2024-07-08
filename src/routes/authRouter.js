import { Router } from "express";
import { register, login ,logout} from "../controllers/authController.js";

const authRouter = Router();

/*
modelo de la tabla users
create table users (
    id_user serial primary key,
    name_user varchar(50) not null,
    user_password varchar(255) not null,
    user_email varchar(50) not null unique
);
*/

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

export default authRouter;
