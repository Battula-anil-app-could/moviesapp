const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

let app = express();
app.use(express.json());

let dbPath = path.join(__dirname, "moviesData.db");

let db = null;

let startbdAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("server is running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`Error: ${e}`);
    process.exit(i);
  }
};

startbdAndServer();

app.get("/movies/", async (request, response) => {
  let query = `select * from movie`;
  let list = await db.all(query);
  let newList = list.map((obj) => {
    let n = {
      movie_name: obj.movie_name,
    };
    return n;
  });
  response.send(newList);
});

module.exports = app;
