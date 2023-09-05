const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const pool = require("./utils/database");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get("/", async (req, res) => {
  let sortOrder = req.query.sort;
  try {
    let user;
    if (sortOrder === "asc") {
      user = await pool.execute("SELECT * FROM users ORDER BY id ASC");
    } else if (sortOrder === "desc") {
      user = await pool.execute("SELECT * FROM users ORDER BY id DESC");
    } else {
      user = await pool.execute("SELECT * FROM users");
    }
    res.json({
      user: user[0],
    });
  } catch (error) {
    res.json({
      error: error,
    });
  }
});
app.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const student = await pool.execute("SELECT * FROM users where id =?", [id]);
    res.json(student[0][0]);
  } catch (error) {
    res.json({ error: error });
  }
});
app.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;
    await pool.execute("INSERT INTO users(name,description) VALUES (?,?) ", [
      name,
      description,
    ]);
    res.json({
      message: "Create new student successfully",
      student: req.body,
    });
  } catch (error) {
    res.json({
      error: error,
    });
  }
});
app.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const data = await pool.execute("SELECT * FROM users where id =?", [id]);
    let row = data[0];
    if (row.length === 0) {
      res.json({ message: "Student not Found" });
    } else {
      await pool.execute("UPDATE users set name=? , description=? where id=?", [
        name || row[0].name,
        description || row[0].description,
        id,
      ]);
      res.json({
        message: "Update student successfully",
      });
    }
  } catch (error) {
    res.json({ error: error });
  }
});
app.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await pool.execute("Select * from users where id =?", [id]);
    let row = data[0];
    if (row.length === 0) {
      res.json({
        message: "Student not Found",
      });
    } else {
      await pool.execute("DELETE FROM users where id =?", [id]);
      res.json({
        message: "Delete student successfully",
        studentDel: row[0],
      });
    }
  } catch (error) {
    res.json({
      error: error,
    });
  }
});
app.listen(3000, () => {
  console.log("http://localhost:3000");
});
