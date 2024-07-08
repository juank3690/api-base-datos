/*
Características de la Aplicación:
Los usuarios pueden crear "cards" con título, descripción en formato markdown, y asignarlas a diferentes "columns" (estados).
Los usuarios pueden crear, modificar y eliminar "columns".
Autenticación y autorización para asegurar que solo el propietario de los recursos pueda modificarlos.
Sistema de registro y perfil de usuario donde se pueda modificar la información personal.
Primera Fase del Proyecto:
Desarrollar la API REST que permita realizar todas las operaciones mencionadas.
Asegurar que la API cumpla con los principios REST, manejo de errores y estándares de seguridad.
*/

/* modelo de la card o tarea
CREATE TABLE tasks(
    id_task serial primary key,
    title_task varchar(50) not null,
    description_task TEXT not null,
    id_section integer not null,
    foreign key (id_section) references sections(id_section) on delete cascade on update cascade
);
*/

import { pool } from "../db.js";

const createTask = async (req, res) => {
    const { title_task, description_task} = req.body;
    const { id_section } = req.params;
    const id_user = req.user.id;
    console.log(req.user);
    try {
        //Verificar que el usuario sea el dueño de la sección
        const sectionResult = await pool.query("SELECT * FROM sections WHERE id_section = $1 and id_user = $2", [id_section, id_user]);
        if (sectionResult.rows.length === 0) {
            return res.status(401).send("Unauthorized");
        }

        //Insertar tarea en la base de datos
        const result = await pool.query( "INSERT INTO tasks (title_task,description_task,id_section) VALUES ($1,$2,$3)", [title_task, description_task, id_section]);

        res.status(201).send("Task created");
    } catch (error) {
        res.status(500).send("Error creating task");
    }
}

const getTasks = async (req, res) => {
    const {id_section} = req.params;
    const id_user = req.user.id;
    try {
        //Verificar que el usuario sea el dueño de la sección
        const sectionResult = await pool.query("SELECT * FROM sections WHERE id_section = $1 and id_user = $2", [id_section, id_user]);
        if (sectionResult.rows.length === 0) {
            return res.status(401).send("Unauthorized");
        }

        const result = await pool.query("SELECT * FROM tasks WHERE id_section = $1", [id_section]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).send("Error getting tasks");
    }
}


const updateTask = async (req, res) => {
    const { title_task, description_task } = req.body;
    const { id_task } = req.params;
    const id_user = req.user.id;
    try {

        //Verificar que el usuario sea el dueño de la tarea
        const taskResult = await pool.query("SELECT * FROM tasks WHERE id_section in (SELECT id_section FROM sections WHERE id_user = $1) and id_task = $2", [id_user, id_task]);

        if (taskResult.rows.length === 0) {
            return res.status(401).send("Unauthorized");
        }

        //Actualizar tarea en la base de datos
        const result = await pool.query("UPDATE tasks SET title_task = $1, description_task = $2 WHERE id_task = $3", [title_task, description_task, id_task]);

        res.send("Task updated");
    } catch (error) {
        res.status(500).send("Error updating task");
    }
}

const deleteTask = async (req, res) => {
    const { id_task } = req.params;
    const id_user = req.user.id;
    try {

        //Verificar que el usuario sea el dueño de la tarea
        const taskResult = await pool.query("SELECT * FROM tasks WHERE id_section in (SELECT id_section FROM sections WHERE id_user = $1) and id_task = $2", [id_user, id_task]);

        if (taskResult.rows.length === 0) {
            return res.status(401).send("Unauthorized");
        }

        //Eliminar tarea en la base de datos
        const result = await pool.query("DELETE FROM tasks WHERE id_task = $1", [id_task]);

        res.send("Task deleted");
    } catch (error) {
        res.status(500).send("Error deleting task");
    }
}

const updateTaskSection = async (req, res) => {
    const { id_task } = req.params;
    const { id_section } = req.body;
    const id_user = req.user.id;
    try {

        //Verificar que el usuario sea el dueño de la tarea
        const taskResult = await pool.query("SELECT * FROM tasks WHERE id_section in (SELECT id_section FROM sections WHERE id_user = $1) and id_task = $2", [id_user, id_task]);

        if (taskResult.rows.length === 0) {
            return res.status(401).send("Unauthorized");
        }

        //Verificar que el usuario sea el dueño de la nueva sección
        const sectionResult = await pool.query("SELECT * FROM sections WHERE id_section = $1 and id_user = $2", [id_section, id_user]);

        if (sectionResult.rows.length === 0) {
            return res.status(401).send("Unauthorized");
        }

        //Actualizar tarea en la base de datos
        const result = await pool.query("UPDATE tasks SET id_section = $1 WHERE id_task = $2", [id_section, id_task]);

        res.send("Task updated");
    } catch (error) {
        res.status(500).send("Error updating task");
    }
}

const getAllTasksUser = async (req, res) => {
    const id_user = req.user.id;
    try {
        const result = await pool.query("SELECT * FROM tasks WHERE id_section in (SELECT id_section FROM sections WHERE id_user = $1)", [id_user]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).send("Error getting tasks");
    }
}


export { createTask, getTasks, updateTask, deleteTask,updateTaskSection, getAllTasksUser};