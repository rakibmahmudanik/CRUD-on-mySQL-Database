const mysql = require("mysql2");
const { faker } = require("@faker-js/faker");
const express = require("express");
const path = require("path");
const app = express();
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");

// Override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "gram_bangla_user",
  password: "rakib@420",
});
let getRandUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(), // before version 9.1.0, use userName()
    faker.internet.email(),
    faker.internet.password(),
  ];
};

app.get("/", (req, res) => {
  let q = "SELECT count(*) FROM user";
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log(result[0]["count(*)"]);
      let count = result[0]["count(*)"];
      res.render("home", { count });
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/users", (req, res) => {
  let q = "SELECT * FROM user";
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      res.render("showusers.ejs", { users });
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/users/:id/edit", (req, res) => {
  let { id } = req.params;

  let q = `SELECT * FROM user WHERE id ='${id}'`;
  try {
    connection.query(q, (err, user) => {
      if (err) throw err;
      res.render("edit.ejs", { user });
    });
  } catch (err) {
    console.log(err);
  }
});

app.patch("/users/:id", (req, res) => {
  let { id } = req.params;
  let { username: newUsername, password: userPassword } = req.body;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (userPassword != user.password) {
        res.send("Password does not match");
      } else {
        q2 = `UPDATE user SET username = '${newUsername}' WHERE id = '${id}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/users");
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});
app.get("/users/add", (req, res) => {
  res.render("addusers.ejs");
});

app.post("/users", (req, res) => {
  let { username, email, password } = req.body;
  let q = `INSERT INTO user (id , username, email, password) VALUES ('${uuidv4()}', '${username}', '${email}', '${password}')`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log("User " + username + " was ADDED");
      res.redirect("/users");
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/users/delete/:id", (req, res) => {
  let { id } = req.params;

  let q = `SELECT * FROM user WHERE id ='${id}'`;
  try {
    connection.query(q, (err, user) => {
      if (err) throw err;
      res.render("distroy.ejs", { user });
    });
  } catch (err) {
    console.log(err);
  }
});
app.delete("/users/delete/:id", (req, res) => {
  let { id } = req.params;
  let { password: userPassword, username } = req.body;

  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (userPassword != user.password) {
        res.send("Password does not match");
      } else {
        q2 = `DELETE FROM user WHERE id = '${id}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          console.log("User " + username + " was DELETED");
          res.redirect("/users");
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

// Server start ======= nodemon index.js

// connect database to CLI  =======  /usr/local/mysql/bin/mysql -u root -p
