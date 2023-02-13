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
  response.send(list);
});

app.post("/movies/", async (request, response) => {
  let details = request.body;
  let { directorId, movieName, leadActor } = details;
  let query = `insert into movie 
                    (movie_id, director_id, movie_name, lead_actor)
                    VALUES 
                        (
                        (select count() from movie)+${1},
                            ${directorId},
                            ${movieName},
                            ${leadActor})`;
  let movies = await db.run(query);
  response.send(movies);
});

app.get("/movies/:movieId/", async (request, response) => {
  let { id } = request.params;
  let query = `select * from movie where movie_id = ${id}`;
  let obj = await db.get(query);
  response.send(query);
});

module.exports = app;
