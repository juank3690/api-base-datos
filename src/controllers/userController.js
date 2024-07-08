import { pool } from "../db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validateLoginSchema } from "../schemas/schema.js";
import { JWT_SECRET } from "../config.js";
/* Modelo de la tabla users
create table users (
    id_user serial primary key,
    name_user varchar(50) not null,
    user_password varchar(255) not null,
    user_email varchar(50) not null unique
);
*/


// //Obtener todos los usuarios
// const getUsers = async (req,res)=>{
//     try{
//         console.log("Getting users");
//         const result = await pool.query("SELECT id_user,name_user,user_email FROM users");
//         res.status(200).json(result.rows); //Enviar respuesta
//     }catch(error){
//         res.status(500).send("Error getting users");
//     }
// }



const getUserProfile = async (req, res) => {
    const id = req.user.id;
    try {
        const result = await pool.query("SELECT id_user,name_user,user_email FROM users WHERE id_user = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).send("User not found");
        }
        res.status(200).json(result.rows[0]); //Enviar respuesta
    } catch (error) {
        res.status(500).send("Error getting user");
    }
}

const updateUserProfile = async (req, res) => {
    const id = req.user.id;
    const { username, email, password } = req.body;

    const validationResult = validateLoginSchema(req.body);
    if (!validationResult.success) {
        return res.status(400).send(validationResult.error);
    }

    if (!validationResult.success) {
        return res.status(400).send(validationResult.error);
    }
    try {
        let query = "UPDATE users SET ";

        if (username) {
            query += `name_user = '${username}',`;
        }
        if (email) {
            query += `user_email = '${email}',`;
        }
        if (password) {
            const hashedPassword = bcrypt.hashSync(password, 10);
            query += `user_password = '${hashedPassword}',`;
        }

        query = query.slice(0, -1); //Eliminar la última coma

        query += ` WHERE id_user = ${id}`;
        
        const result = await pool.query(query);

        //Obtener el usuario actualizado
        const resultUpdated = await pool.query("SELECT id_user,name_user,user_email FROM users WHERE id_user = $1", [id]);
        const user = resultUpdated.rows[0];

        //Crear token nuevo
        const token = jwt.sign(
            { id: user.id_user, username: user.name_user, email: user.user_email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );
        //Clear cookie
        res.clearCookie("access_token");
        res.cookie("access_token", token, { httpOnly: true});
        res.status(200).send("User updated");
    } catch (error) {
        res.status(500).send("Error updating user");
    }
}


export { getUserProfile, updateUserProfile};