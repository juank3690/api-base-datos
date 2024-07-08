import { pool } from "../db.js";
/*
modelo de la tabla sections
CREATE TABLE sections(
    id_section serial primary key,
    title_section varchar(50) not null,
    id_user integer not null,
    foreign key (id_user) references users(id_user) on delete cascade on update cascade
);*/

const createSection = async (req, res) => {
    const { title_section } = req.body;
    const {id_user} = req.params;
    console.log(req.params);
    try {
        //Comparar id_user con el id_user del token
        const tokenid = req.user.id;
        if (id_user != tokenid) {
            return res.status(401).send("Unauthorized");
        }

        //Insertar sección en la base de datos
        const result = await pool.query( "INSERT INTO sections (title_section,id_user) VALUES ($1,$2)", [title_section, id_user]);

        console.log(result);
        res.status(201).send("Section created");
    } catch (error) {
        res.status(500).send("Error creating section");
    }
}

const getSections = async (req, res) => {
    const {id_user} = req.params;
    try {
        //Comparar id_user con el id_user del token
        const tokenid = req.user.id;
        if (id_user != tokenid) {
            return res.status(401).send("Unauthorized");
        }

        const result = await pool.query("SELECT * FROM sections WHERE id_user = $1", [id_user]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).send("Error getting sections");
    }
}

const updateSection = async (req, res) => {
    const { title_section } = req.body;
    const { id_section } = req.params;
    const id_user = req.user.id;
    try {

        //Verificar que el usuario sea el dueño de la sección
        const sectionResult = await pool.query("SELECT * FROM sections WHERE id_section = $1 and id_user = $2", [id_section, id_user]);
        if (sectionResult.rows.length === 0) {
            return res.status(401).send("Unauthorized");
        }

        //Actualizar sección en la base de datos
        const updateResult = await pool.query("UPDATE sections SET title_section = $1 WHERE id_section = $2", [title_section, id_section]);

        res.send("Section updated");
    } catch (error) {
        res.status(500).send("Error updating section");
    }
}

const deleteSection = async (req, res) => {
    const { id_section } = req.params;
    const id_user = req.user.id;
    try {
        //Verificar que el usuario sea el dueño de la sección
        const sectionResult = await pool.query("SELECT * FROM sections WHERE id_section = $1 and id_user = $2", [id_section, id_user]);
        if (sectionResult.rows.length === 0) {
            return res.status(401).send("Unauthorized");
        }

        const result = await pool.query("DELETE FROM sections WHERE id_section = $1", [id_section]);
        res.send("Section deleted");
    } catch (error) {
        res.status(500).send("Error deleting section");
    }
}

const getAllSectionsUser = async (req, res) => {
    const id_user = req.user.id;
    try {
        const result = await pool.query("SELECT * FROM sections WHERE id_user = $1", [id_user]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).send("Error getting sections");
    }
}


export { createSection, getSections, updateSection, deleteSection, getAllSectionsUser };