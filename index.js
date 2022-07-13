const express = require("express");
const moongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");

const redis = require("redis");
let RedisStore = require("connect-redis")(session);

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  REDIS_URL,
  REDIS_PORT,
  SESSION_SECRET,
} = require("./config/config");

let redisClient = redis.createClient({
  host: REDIS_URL,
  port: REDIS_PORT,
});

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
  moongoose
    .connect(mongoURL, {
      useNewUrlParser: true, //to clear the err msg
      userUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => console.log("succesfully conected to the db"))
    .catch((e) => console.log(e));
};
connectWithRetry();

app.enable("trust proxy");
app.use(cors({}));
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
      secure: false,
      resave: false,
      saveUninitialized: false,
      httpOnly: true,
      maxAge: 300000000,
    },
  })
);
app.use(express.json()); //middleware

app.get("/api/v1", (req, res) => {
  res.send("<h2>Hello</h2>");
  console.log("nginx runs");
});

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users, userRouter");

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));
