const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const Pool = require("pg").Pool;
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./middleware/authorization");
// const { jwtToken } = require("./utils/jwt-token");
dotenv.config();
const jsonParser = bodyParser.json();
//MIDDLEWARES
const app = express();
app.use(express.json());
app.use(cookieParser());
const client = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: process.env.PASSWORD,
  port: 5000,
});
client.connect(err => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Database connected");
});

const corsOptions = {
  origin: [
    "http://localhost:3500",
    "http://localhost:3000",
    "http://localhost:4200",
    "http://localhost:5000",
  ],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(function (req, res, next) {
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  next();
});
app.use((req, res, next) => {
  res.set({
    // "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers":
      "'Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token'",
  });

  next();
});

// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );

app.get("/auth/all/usernames", jsonParser, async (req, res) => {
  try {
    const usernames = await client.query(`SELECT username FROM users`);
    let tab = [];
    let usernameObject = usernames.rows;
    usernameObject.map(username => tab.push(username.username));

    res.status(200).json(tab);
  } catch (error) {
    res.status(500).json(error.message);
  }
});
//LOGIN
let jwtToken = ({ id, username, email }) => {
  const user = { id, username, email };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10h",
  });
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "10h",
  });
  return { accessToken, refreshToken };
};

app.post("/auth/user/login", jsonParser, async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const user = await client.query(`SELECT * FROM users WHERE username = $1`, [
      username,
    ]);
    if (user.rows.length === 0)
      return res.status(401).json({ error: "Email is incorrect" });
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      res.status(401).json({ error: "Incorrect password" });
    }
    let currentUser = {
      id: user.rows[0].id,
      username: user.rows[0].username,
      email: user.rows[0].email,
    };

    let tokens = jwtToken(currentUser);

    res.cookie("refresh_token", tokens.refreshToken, {
      // httpOnly: true,
      // sameSite: "none",
      // secure: true,
    });

    res.cookie("access_token", tokens.accessToken, {
      // httpOnly: true,
      // sameSite: "none",
      // secure: true,
    }); //będzie dostępny token tylko po stronie serwera
    res.status(200).json(tokens);
  } catch (error) {
    res.status(500).json(error.message);
  }
});
//Register
app.post("/auth/user/register", jsonParser, async (req, res) => {
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
    const role = "USER";

    const hashedPassword = await bcrypt.hash(password, 10);

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
        hashedPassword,
        role,
      ]
    );
    res.status(200).json(newUser);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//GET ALL USERS
app.get("/users", authenticateToken, async (req, res) => {
  try {
    var page = parseInt(req.query.page);
    var limit = parseInt(req.query.limit);

    var startIndex = (page - 1) * limit;
    var endIndex = page * limit;
    var responseAll = await client.query(`SELECT * FROM users`);

    let search = req.query.search;
    if (!search) {
      var response = await client.query(`SELECT * FROM users`);
    } else {
      var response = await client.query(
        `SELECT * FROM users WHERE username = $1 OR firstname = $1 OR lastname = $1`,
        [search]
      );
    }
    results = {};
    if (endIndex < response.rows.length)
      results.next = {
        page: page + 1,
        limit: limit,
      };
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    results.len = responseAll.rows.length;

    results.results = response.rows.slice(startIndex, endIndex);
    await res.status(200).json(results);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.get("/auth/refresh_token", (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (refreshToken === null) return res.status(403).json(error.message);

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (error, user) => {
        if (error) return res.status(403).json({ error: error.message });
        let tokens = jwtToken(user);

        console.log(user);
        res.cookie("refresh_token", tokens.refreshToken, {});
        res.status(200).json(tokens);
      }
    );
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.delete("/delete/refresh_token", (req, res) => {
  try {
    res.clearCookie("refresh_token", {
      domain: "localhost",
      path: "/",
    });
    res.clearCookie("access_token", {
      domain: "localhost",
      path: "/",
    });
    return res.status(200).json({ message: "refresh token deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/delete/refresh_token", (req, res) => {
  try {
    let user = {
      id: "",
      username: "",
      email: "",
    };
    res.clearCookie(req.cookies.refresh_token);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "0s",
    });
    res.cookie("refresh_token", refreshToken, {});
    return res.status(200).json({ message: "refresh token deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Start app!");
});

app.listen(3500, () => {
  console.log("SERVER RUNNING!");
});
