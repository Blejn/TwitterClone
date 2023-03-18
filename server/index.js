const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const Pool = require("pg").Pool;
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
dotenv.config();
const jsonParser = bodyParser.json();
//MIDDLEWARES
const app = express();
app.use(cors());

const client = new Pool({
  user: "blejn",
  host: "demo-postgres.ckngqqeunoj2.eu-north-1.rds.amazonaws.com",
  database: "sampleDB",
  password: process.env.PASSWORD,
  port: 5432,
});
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );
//Register
app.post("/user/register", jsonParser, async (req, res) => {
  try {
    const id = uuidv4();
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const username = req.body.username;
    const email = req.body.email;
    const location = req.body.location;
    const password = req.body.password;
    const observer = req.body.observer;
    const viewer = req.body.viewer;
    const posts = req.body.posts;
    const profile_picture = req.body.profile_picture;
    const description = req.body.description;
    const role = req.body.role;

    const newUser = await client.query(
      `INSERT INTO "users" (id, firstname, lastname, username, email, location, observer, viewer, posts, profile_picture, description, password, role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,$13)`,
      [
        id,
        firstname,
        lastname,
        username,
        email,
        location,
        observer,
        viewer,
        posts,
        profile_picture,
        description,
        password,
        role,
      ]
    );
    res.status(200).json(newUser);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.get("/users", async (req, res) => {
  try {
    await client.connect(err => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Database connected");
    });
    // await client.query(
    //   "GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO blejn"
    // );
    const response = await client.query(`SELECT * FROM users`);
    await client.end;
    res.status(200).json(response.rows);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.listen(3500, () => {
  console.log(`App running on port 3500.`);
});
