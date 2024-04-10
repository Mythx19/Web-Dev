require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// initialize Session
app.use(
  session({
    secret: process.env.SECRET_ID,
    resave: false,
    saveUninitialized: false,
  })
);
// initialize passport
app.use(passport.initialize());
// initialize passport to use the session package
app.use(passport.session());

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(
    "mongodb://127.0.0.1:27017/gameDB" //Local database Mongod
    // "mongodb+srv://gamedeck23:vGy35m75KMdNtMG2@cluster0.qafayms.mongodb.net/GameDeckDB?retryWrites=true&w=majority"
  );
}


const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/developer",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      User.findOrCreate(
        {
          googleId: profile.id,
        },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);

const gameSchema = new mongoose.Schema({
  name: String,
  background: String,
  display: String,
  developer: String,
  classification: String,
  instructions: String,
  about: String,
  gamelink: String
});

const Game = mongoose.model("Game", gameSchema);

// const test1 = new Game({
//   name: "Minecraft",
//   background: "minecraft-bg.jpg",
//   display: "minecraft-dp.jpg",
//   developer: "Orion",
//   classification: "Adventure",
//   instructions:
//     "WASD = move around, Q = place blocks, 1-9 = change block types, Spacebar = Jump, Click = break Blocks",
//   about:
//     "Minecraft is open world adventure game. Explore a blocky three-dimensional world with virtually infinite terrain.",
//   gamelink: "/Games/Minecraft/index.html"
// });
// test1.save();

// const test5 = new Game({
//   name: "Tetris",
//   background: "tetris-bg.jpg",
//   display: "tetris-dp.png",
//   developer: "Orion",
//   classification: "Puzzle",
//   instructions: "down, left & right arrows = move brick, up arrow = rearrange brick",
//   about: "A simple game of the clasasic Tetris puzzle game",
//   gamelink: "/Games/Tetris/index.html"
// });
// test5.save();

// const test2 = new Game({
//   name: "Dicee",
//   background: "dice-bg.jpg",
//   display: "dice-dp.jpg",
//   developer: "Myth",
//   classification: "Other",
//   instructions: "Click Throw to play",
//   about: "A simple dice game.",
//   gamelink: "/Games/Dicee/index.html"
// });
// test2.save();

// const test3 = new Game({
//   name: "Simon Game",
//   background: "default-bg.jpg",
//   display: "simon-dp.jpeg",
//   developer: "Myth",
//   classification: "Action",
//   instructions: "Click the corresponding color pads to advance",
//   about: "Simon game is the exciting game of lights and sounds where one must repeat random sequences of lights by pressing the colored pads in the correct order. Experience the fun as you repeat the patterns and advance to higher levels.",
//   gamelink: "/Games/Simon\ Game/index.html"
// });
// test3.save();

// const test4 = new Game({
//   name: "Simple Drum",
//   background: "drum-bg.jpg",
//   display: "drum-dp.jpg",
//   developer: "Myth",
//   classification: "Simulator",
//   instructions: "Click or Press buttons to play drums",
//   about: "Real Drum Kits Simulator. Experience the true drumming experience",
//   gamelink: "/Games/Simple\ Drum/index.html"
// });
// test4.save();

// const test6 = new Game({
//   name: "Zork",
//   background: "zork-bg.jpg",
//   display: "zork-dp.jpg",
//   developer: "DLzer",
//   classification: "Puzzle",
//   instructions: "Types text commands to traverse locations, solve puzzles, and collect treasure.",
//   about: "Zork is a text-based adventure game where you explores the abandoned Great Underground Empire in search of treasure.",
//   gamelink: "/Games/Zork/index.html"
// });
// test6.save();

// const test7 = new Game({
//   name: "2048",
//   background: "2048-bg.png",
//   display: "2048-dp.png",
//   developer: "Gabriele Cirulli",
//   classification: "Puzzle",
//   instructions: "Press arrow keys to move tiles",
//   about: "2048 is a single-player sliding tile puzzle video game. The objective of the game is to slide numbered tiles on a grid to combine them to create a tile with the number 2048.",
//   gamelink: "/Games/2048/index.html"
// });
// test7.save();

// const test8 = new Game({
//   name: "Tic Tac Toe",
//   background: "tic-tac-toe-bg.jpg",
//   display: "tic-tac-toe-dp.jpg",
//   developer: "Justin Kim",
//   classification: "Puzzle",
//   instructions: "Click to place X & O mark",
//   about: "Tic Tac Toe is game for two players who take turns marking the spaces in a 3x3 grid with X or O. The player who succeeds in placing three of their marks in a horizontal, vertical, or diagonal row is the winner.",
//   gamelink: "/Games/Tic\ Tac\ Toe/index.html"
// });
// test8.save();

// const test9 = new Game({
//   name: "Dinosour Game",
//   background: "dino-bg.png",
//   display: "dino-dp.png",
//   developer: "CloudCannon",
//   classification: "Others",
//   instructions: "Press Spacebar to jump",
//   about: "The Dinosaur Game is a browser game where you guides a T-Rex across a side-scrolling landscape, avoiding obstacles to achieve a higher score.",
//   gamelink: "/Games/Dinosour\ Game/index.html"
// });
// test9.save();

// const test10 = new Game({
//   name: "Pacman",
//   background: "pacman-bg.jpg",
//   display: "pacman-dp.jpg",
//   developer: "RisDev",
//   classification: "Action",
//   instructions: "Press arrows keys to move",
//   about: "Pac-Man is an action maze chase video game where you controls the eponymous character through the enclosed maze. The objective of the game is to eat all of the dots placed in the maze while avoiding four colored ghosts",
//   gamelink: "/Games/Pacman/index.html"
// });
// test10.save();

// const test11 = new Game({
//   name: "Shooting Game",
//   background: "default-bg.jpg",
//   display: "default-dp.jpg",
//   developer: "Orion",
//   classification: "Survival",
//   instructions: "Click on screen to shoot the red balls",
//   about: "Shooting Game is a simple survival shooter game. Shoot the red balls to achieve higher scores.",
//   gamelink: "/Games/Shooting\ Game/index.html"
// });
// test11.save();

// const test12 = new Game({
//   name: "Basketball",
//   background: "default-bg.jpg",
//   display: "basketball-dp.png",
//   developer: "Orion",
//   classification: "Sports",
//   instructions: "Hold left click on the ball & swipe up to shoot",
//   about: "Basketball is an addictive endless basketball game where you swipe the ball to make it jump to perfectly to score. Keep going for as long as you can!",
//   gamelink: "/Games/Basketball/index.html"
// });
// test12.save();

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

app.get(
  "/auth/google/developer",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect("/profile");
  }
);

app.get("/login", (req, res) => {
  res.render("login", {
    login: "Show",
    register: "none",
  });
});

app.get("/register", (req, res) => {
  res.render("login", {
    login: "none",
    register: "Show",
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/profile/:name", async (req, res) => {
  if (req.isAuthenticated()) {
    User.findOne({
      name: req.params.name,
    })
      .then((findUser) => {
        Game.find({
          developer: req.params.name,
        })
          .then((findGame) => {
            res.render("profile", {
              user: findUser,
              games: findGame,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    console.log(err);
  });
  res.redirect("/");
});

app.get("/latest", (req, res) => {
  Game.find()
    .sort({
      $natural: -1,
    })
    .then((findGames) => {
      res.render("game", {
        title: "Lates Games",
        games: findGames,
      });
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get("/all-games", (req, res) => {
  Game.find().sort({ name: 1})
    .then((findGames) => {
      res.render("game", {
        title: "All Games",
        games: findGames,
      });
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get("/:gameClass", (req, res) => {
  const gameClass = req.params.gameClass;
  Game.find({
    classification: gameClass,
  })
    .then((findGames) => {
      res.render("game", {
        title: " " + gameClass + " ",
        games: findGames,
      });
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get("/game/:gameName", (req, res) => {
  const Name = req.params.gameName;
  Game.findOne({
    name: Name,
  })
    .then((foundGame) => {
      res.render("details", {
        game: foundGame,
      });
    })
    .catch((err) => {
      console.error(err);
    });
});

app.post("/search", (req, res) => {
  Game.find({
    name: req.body.searchName,
  })
    .then((game) => {
      if (game.length > 0) {
        res.render("game", {
          title: '"' + req.body.searchName + '"',
          games: game,
        });
      } else {
        res.render("game", {
          title: "No match found",
          games: [],
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/register", (req, res) => {
  const newUser = new User({
    name: req.body.name,
    username: req.body.username,
  });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      res.send("There was an error");
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/profile/" + req.body.name);
      });
    }
  });
});

app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, () => {
        User.findOne({
          username: req.body.username,
        })
          .then((foundUser) => {
            res.redirect("/profile/" + foundUser.name);
          })
          .catch((err) => {
            console.error(err);
          });
      });
    }
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
