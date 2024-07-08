import { pool } from "../db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs/dist/bcrypt.js";
import { JWT_SECRET } from "../config.js";
import { validateRegisterSchema,validateLoginSchema } from "../schemas/schema.js";

const register = async (req, res) => {
  const { username, email, password } = req.body;
  //Validar datos
  const validationResult = validateRegisterSchema(req.body);
  if (!validationResult.success) {
    return res.status(400).send(validationResult.error);
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  try {
    //Hashear la contraseña
    //Insertar usuario en la base de datos
    const result = await pool.query(
      "INSERT INTO users (name_user,user_password,user_email) VALUES ($1,$2,$3)",
      [username, hashedPassword, email]
    );
    //Enviar respuesta
    res.status(201).send("User created");
  } catch (error) {
    res.status(500).send(error);
  }
};

const login = async (req, res) => {
  //Extraer datos del body
  const { email, password } = req.body;

  //Validar datos
  const validationResult = validateLoginSchema(req.body);
  if (!validationResult.success) {
    return res.status(400).send(validationResult.error);
  }

  try {
    //Buscar usuario en la base de datos
    const result = await pool.query(
      "SELECT * FROM users WHERE user_email = $1",
      [email]
    );
    //Si no existe, enviar error
    if (result.rows.length === 0) {
      return res.status(401).send("Invalid credentials");
    }
    //Extraer usuario
    const user = result.rows[0];

    //Comparar contraseñas
    const isMatch = bcrypt.compareSync(password, user.user_password);
    if (!isMatch) {
      return res.status(401).send("Invalid credentials");
    }

    //Generar token
    const token = jwt.sign(
      { id: user.id_user, username: user.name_user, email: user.user_email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    //Enviar respuesta
    res.send("Logged in");
  } catch (error) {
    res.status(500).send("Error loggin in");
  }
};


const logout = (req, res) => {
  res.clearCookie("access_token");
  res.send("Logged out");
}




export { register, login ,logout};