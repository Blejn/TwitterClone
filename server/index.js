const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const Pool = require("pg").Pool;
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const authenticateToken = require("./middleware/authorization");
const asyncHandler = require("express-async-handler");
const multer = require("multer");
const fs = require("fs");
// const { jwtToken } = require("./utils/jwt-token");
dotenv.config();
const jsonParser = bodyParser.json();

//MIDDLEWARES
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
const corsOptions = {
  // origin: [
  //   "http://localhost:3500",
  //   "http://localhost:3000",
  //   "http://localhost:4200",
  //   "http://localhost:5000",
  // ],
  origin: "http://localhost:4200",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(function (req, res, next) {
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  next();
});
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

cloudinary.config({
  cloud_name: "doe12qx3f",
  api_key: 589686272378283,
  api_secret: "Ef-EYk1b5kpHv0O1bhl3sL55bv0",
});
const upload = multer({ dest: "uploads/" });

//KONIEC KONFOGURACJi-----------------------------------------------------

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
let jwtToken = ({ id, username, email, profile_picture }) => {
  const user = { id, username, email, profile_picture };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10h",
  });
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "10h",
  });
  return { accessToken, refreshToken };
};

app.get("/users/:id", authenticateToken, async (req, res) => {
  try {
    let userId = req.params.id;
    let userDetails = await client.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);
    res.status(200).json(userDetails.rows[0]);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: "Internal server error." });
});

app.post("/auth/user/login", jsonParser, async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Sprawdzenie poprawności danych wejściowych
    if (!username || !password) {
      return res
        .status(400)
        .send({ error: "Both username and password are required." });
    }

    const user = await client.query(`SELECT * FROM users WHERE username = $1`, [
      username,
    ]);
    console.log(user.rows);
    if (user.rows.length === 0) {
      return res.status(401).send({ error: "Username is incorrect." });
    }

    // Porównanie hasła
    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).send({ error: "Incorrect password." });
    }

    // Utworzenie tokenów JWT
    let currentUser = {
      id: user.rows[0].id,
      username: user.rows[0].username,
      email: user.rows[0].email,
      profile_picture: user.rows[0].profile_picture
        ? user.rows[0].profile_picture
        : null,
    };
    console.log(currentUser);

    let tokens = jwtToken(currentUser);

    // Zabezpieczenia plików cookie
    res.cookie("refresh_token", tokens.refreshToken, {
      // httpOnly: true,
      // sameSite: "none",
      // secure: true,
    });

    res.cookie("access_token", tokens.accessToken, {
      // httpOnly: true,
      // sameSite: "none",
      // secure: true,
    });

    res.status(200).json(tokens);
  } catch (error) {
    next(error);
  }
});

// St

//Register
app.post(
  "/auth/user/register",
  jsonParser,
  upload.single("profile_picture"),
  async (req, res) => {
    try {
      const file = req.file ? req.file : null;
      const usernames = await client.query(`SELECT username FROM users`);
      const usernameObject = usernames.rows;
      const usernameExists = usernameObject.some(
        nameObj => nameObj.username === req.body.username
      );

      if (usernameExists) {
        return res.status(401).send("username already exists");
      }

      if (file != null) {
        cloudinary.uploader.upload(file.path, async (error, result) => {
          if (error) {
            console.error("Błąd przesyłania pliku do Cloudinary:", error);
            return res
              .status(500)
              .json({ error: "Wystąpił błąd podczas przesyłania pliku." });
          } else {
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
            const profile_picture = result.url;
            const description = req.body.description;
            const role = "USER";
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await client.query(
              `INSERT INTO "users" (id, firstname, lastname, username, email, location, observer, viewer, posts, profile_picture, description, password, role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
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

            // Usuń przesłany plik z serwera
            fs.unlink(file.path, err => {
              if (err) {
                console.error("Błąd usuwania pliku:", err);
              }
            });

            return res
              .status(200)
              .json({ message: "new user successfully created" });
          }
        });
      } else {
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
          `INSERT INTO "users" (id, firstname, lastname, username, email, location, observer, viewer, posts, profile_picture, description, password, role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
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

        return res
          .status(200)
          .json({ message: "new user successfully created" });
      }
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }
);

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

//GETTING FRIENDS
app.post("/friends/:id/follow", async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Start app!");
});

app.delete("/users/delete", async (req, res) => {
  try {
    let response = await client.query(`DELETE  FROM users`);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

//-------------------------------------follow users or unfollow user
app.post("/users/viewer/:id", async (req, res) => {
  try {
    let currentUserId = req.body.id;
    let userId = req.params.id;
    let userDetails = await client.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);
    console.log(userDetails.rows[0]);

    if (userDetails.rows[0]?.viewer.includes(currentUserId)) {
      let addViewer = await client.query(
        `UPDATE users set viewer = array_remove(viewer,$1) WHERE id=$2 `,
        [currentUserId, userId]
      );

      let addObserver = await client.query(
        `UPDATE users set observer = array_remove(observer,$1) WHERE id=$2 `,
        [userId, currentUserId]
      );

      res.status(200).json({ viewer: addViewer, observer: addObserver });
    } else {
      let addViewer = await client.query(
        `UPDATE users set viewer = array_append(viewer,$1) WHERE id=$2 `,
        [currentUserId, userId]
      );

      let addObserver = await client.query(
        `UPDATE users set observer = array_append(observer,$1) WHERE id=$2 `,
        [userId, currentUserId]
      );
      res.status(200).json({ viewer: addViewer, observer: addObserver });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

app.post("/users/delete/viewer/:id", async (req, res) => {
  try {
    let currentUserId = req.body.id;
    let userId = req.params.id;
    //TUTAJ SPRADZANIE CZY PRZYPADKIEM JUZ NIE OBSERWUJEMY TEGO USERA

    // TUTAJ DOŁĄCZANIE CURRENTUSERID DO TABLICY VIEWER
    let addViewer = await client.query(
      `UPDATE users set viewer = array_append(viewer,$1) WHERE id=$2 `,
      [currentUserId, userId]
    );

    let addObserver = await client.query(
      `UPDATE users set observer = array_append(observer,$1) WHERE id=$2 `,
      [userId, currentUserId]
    );
    res.status(200).json({ viewer: addViewer, observer: addObserver });
    res.status(200).json({});
  } catch (error) {
    res.status(500).json(error.message);
  }
});

app.post("/specific", authenticateToken, async (req, res) => {
  try {
    var ids = req.body.ids;
    let users = await client.query(
      `SELECT * FROM users WHERE id = ANY($1::text[])`,
      [ids]
    );
    res.status(200).json(users.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//---------------------------CREATING POSTS-----------------------------------------------------
app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;

  cloudinary.uploader.upload(file.path, (error, result) => {
    if (error) {
      console.error("Błąd przesyłania pliku do Cloudinary:", error);
      res
        .status(500)
        .json({ error: "Wystąpił błąd podczas przesyłania pliku." });
    } else {
      // Zwróć publiczną URL przesłanego obrazu z Cloudinary
      res.json({ url: result.url });
    }

    // Usuń przesłany plik z serwera
    fs.unlink(file.path, err => {
      if (err) {
        console.error("Błąd usuwania pliku:", err);
      }
    });
  });
});
app.post(
  "/createPost",
  upload.single("file"),
  authenticateToken,
  async (req, res) => {
    try {
      const file = req.file;

      if (file) {
        cloudinary.uploader.upload(file.path, (error, result) => {
          if (error) {
            console.error("Błąd przesyłania pliku do Cloudinary:", error);
            return res
              .status(500)
              .json({ error: "Wystąpił błąd podczas przesyłania pliku." });
          } else {
            console.log(result);
            const photo = result.url;
            const id = uuidv4();
            const username = req.body.username;
            const location = req.body.location;
            const description = req.body.description;
            const userid = req.body.userid;
            const comments = [];
            const reactions = [];
            const shares = [];
            const views = [];
            const date = req.body.date;

            // Wykonaj zapytanie do bazy danych
            const newPost = client
              .query(
                `INSERT INTO "posts" (id, username, location, description, photo, userid, comments, reactions, shares, views,date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                [
                  id,
                  username,
                  location,
                  description,
                  photo,
                  userid,
                  comments,
                  reactions,
                  shares,
                  views,
                  date,
                ]
              )
              .then(() => {
                // Usuń przesłany plik z serwera
                fs.unlink(file.path, err => {
                  if (err) {
                    console.error("Błąd usuwania pliku:", err);
                  }
                });

                // Zwróć odpowiedź
                res.status(200).json(newPost);
              })
              .catch(error => {
                throw error;
              });
          }
        });
      } else {
        const id = uuidv4();
        const username = req.body.username;
        const location = req.body.location;
        const description = req.body.description;
        const userid = req.body.userid;
        const comments = [];
        const reactions = [];
        const shares = [];
        const views = [];
        const date = req.body.date;

        // Wykonaj zapytanie do bazy danych
        const newPost = await client.query(
          `INSERT INTO "posts" (id, username, location, description, photo, userid, comments, reactions, shares, views, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [
            id,
            username,
            location,
            description,
            null,
            userid,
            comments,
            reactions,
            shares,
            views,
            date,
          ]
        );

        // Zwróć odpowiedź
        res.status(200).json(newPost);
      }
    } catch (error) {
      res.status(500).json({ message: `${error}` });
    }
  }
);
//-----------------------------DELETE ALL POSTS--------------------
app.delete("/posts/delete", async (req, res) => {
  try {
    let response = await client.query(`DELETE  FROM posts`);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error.message);
  }
});
//---------------------------Getting ALL POSTS-----------------------------------------------------

app.get("/posts", authenticateToken, async (req, res) => {
  try {
    var page = parseInt(req.query.page);
    var limit = parseInt(req.query.limit);
    var startIndex = (page - 1) * limit;
    var endIndex = page * limit;

    let search = req.query.search;

    if (!search) {
      var response = await client.query("SELECT * FROM posts");
    } else {
      var response = await client.query(
        "SELECT * FROM posts WHERE username = $1"
      );
    }
    results = {};

    if (endIndex < response.rows.length) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }
    // if (startIndex > 0) {
    //   results.previous = {
    //     page: page - 1,
    //     limit: limit,
    //   };
    // }
    results.len = response.rows.length;
    results.results = response.rows.slice(startIndex, endIndex);

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json(error.message);
  }
});
//ADD COMMMENTS---------------------------------------------------------------------
app.post("/posts/:postId/comments", (req, res) => {
  const postId = req.params.postId;
  const comment = req.body.comment;
  const userId = req.body.userId;
  const username = req.body.username;
  const id = req.body.id;

  // Sprawdź, czy istnieje post o podanym ID w bazie danych

  // Jeśli post istnieje, dodaj komentarz do tablicy comments
  const query = `UPDATE "posts" SET comments = array_append(comments, $1) WHERE id = $2`;
  const values = [
    {
      id: id,
      userId: userId,
      username: username,
      comment: comment,
    },
    postId,
  ];
  // Wykonaj zapytanie do bazy danych, aby dodać komentarz do posta
  client
    .query(query, values)
    .then(() => {
      // Komentarz został dodany pomyślnie
      res.status(200).json({ message: "Komentarz został dodany do posta" });
    })
    .catch(error => {
      // Wystąpił błąd podczas dodawania komentarza
      console.error("Błąd podczas dodawania komentarza:", error);
      res
        .status(500)
        .json({ error: "Wystąpił błąd podczas dodawania komentarza" });
    });
});
//USUWANIE KOMENTARZA--------------------------------
app.post("/posts/:postId/removeComment", (req, res) => {
  const postId = req.params.postId;
  const comment = req.body.comment;
  const userId = req.body.userId;
  const username = req.body.username;
  const id = req.body.id;

  // Sprawdź, czy istnieje post o podanym ID w bazie danych

  // Jeśli post istnieje, dodaj komentarz do tablicy comments
  const query = `UPDATE "posts" SET comments = array_remove(comments, $1) WHERE id = $2`;
  const values = [
    {
      id: id,
      userId: userId,
      username: username,
      comment: comment,
    },
    postId,
  ];

  // Wykonaj zapytanie do bazy danych, aby dodać komentarz do posta
  client
    .query(query, values)
    .then(() => {
      // Komentarz został dodany pomyślnie
      res.status(200).json({ message: "Komentarz został dodany do posta" });
    })
    .catch(error => {
      // Wystąpił błąd podczas dodawania komentarza
      console.error("Błąd podczas dodawania komentarza:", error);
      res
        .status(500)
        .json({ error: "Wystąpił błąd podczas dodawania komentarza" });
    });
});

//DODAWANIE REAKCJI-----------------------------------------------------------------------------------------------------------
app.post("/posts/:id/like", (req, res) => {
  const postId = req.params.id;
  const userId = req.body.userId;

  // Sprawdź, czy istnieje post o podanym ID w bazie danych

  // Jeśli post istnieje, dodaj komentarz do tablicy comments
  const query = `UPDATE posts set reactions  = array_append(reactions, $1) WHERE id = $2`;
  const values = [userId, postId];

  // Wykonaj zapytanie do bazy danych, aby dodać komentarz do posta
  client
    .query(query, values)
    .then(() => {
      // Komentarz został dodany pomyślnie
      res.status(200).json({ message: "Dodano reakcje do posta" });
    })
    .catch(error => {
      // Wystąpił błąd podczas dodawania komentarza
      console.error("Błąd podczas dodawania komentarza:", error);
      res.status(500).json({ error: "Wystąpił błąd podczas usuwania reakcji" });
    });
});
//USUWANIE REAKCJI-----------------------------------------------------------------------------------------------------------
app.post("/posts/:postId/dislike", (req, res) => {
  const postId = req.params.postId;
  const userId = req.body.userId;

  // Sprawdź, czy istnieje post o podanym ID w bazie danych

  // Jeśli post istnieje, dodaj komentarz do tablicy comments
  const query = `UPDATE posts set reactions  = array_remove(reactions, $1) WHERE id = $2`;
  const values = [userId, postId];

  // Wykonaj zapytanie do bazy danych, aby dodać komentarz do posta
  client
    .query(query, values)
    .then(() => {
      // Komentarz został dodany pomyślnie
      res.status(200).json({ message: "Usunięto reakcje z posta" });
    })
    .catch(error => {
      // Wystąpił błąd podczas dodawania komentarza
      console.error("Błąd podczas usuwania reakcji:", error);
      res.status(500).json({ error: "Wystąpił błąd podczas usuwania reakcji" });
    });
});

app.listen(3500, () => {
  console.log("SERVER RUNNING!");
});
