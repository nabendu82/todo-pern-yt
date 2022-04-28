const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

//middleware
app.use(cors());
app.use(express.json());

//ROUTES
//Create a todo
app.post("/todos", async (req, res) => {
    try {
        const { description } = req.body;
        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES ($1) RETURNING *",
            [description]
        )
        res.json(newTodo.rows[0]);

    } catch (error) {
        console.log(error);
    }
})

//Get all todos
app.get("/todos", async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo");
        res.json(allTodos.rows);
    } catch (error) {
        console.log(error);
    }
})

//Get single todo
app.get("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE id = $1", [id]);
        res.json(todo.rows[0]);
    } catch (error) {
        console.log(error);
    }
})

//Update a todo
app.put("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        await pool.query(
            "UPDATE todo SET description = $1 WHERE id = $2", [description, id]
        )
        res.json("Todo was updated");
    } catch (error) {
        console.log(error);
    }
})

//Delete a todo
app.delete("/todos/:id", async(req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM todo WHERE id = $1", [id]);
        res.json("Todo was deleted");
    } catch (error) {
        console.log(error);
    }
})

app.listen(8001, () => {
    console.log('Server running on port 8001');
})