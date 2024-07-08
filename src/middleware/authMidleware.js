import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
const authMiddleware = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).send("Unauthorized");//Poner 401
  }
  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    console.log(user);
    next();
  } catch (error) {
    return res.status(401).send("Unauthorized");
  }
};

export default authMiddleware;