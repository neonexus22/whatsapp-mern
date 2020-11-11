import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Pusher from "pusher";

import Messages from "./dbMessages.js";

const PORT = process.env.PORT || 8001;
const DB_URL = "Your database url";

// app config
const app = express();

// pusher config from the website
// go to pusher.com, crate a project and generate this code for you
const pusher = new Pusher({
  appId: "1102343",
  key: "4c5dec0123423f23rb40a3",
  secret: "71c3c09we45we998299f7",
  cluster: "ap2",
  useTLS: true,
});

// middleware
app.use(express.json());
app.use(cors());

// DB config
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.once("open", () => {
  console.log("DB Connected");

  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    console.log("change", change);

    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", messageDetails);
    } else {
      console.log("Error triggering pusher");
    }
  });
});

// ???

// api routes
app.get("/", (req, res) => {
  res.status(200).send("Welcome to Whatsapp MERN Backend!");
});

app.get("/messages/sync", (req, res) => {
  Messages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).send(data);
  });
});

app.post("/messages/new", (req, res) => {
  const dbMessage = req.body;
  Messages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(201).send(data);
  });
});

// listen
app.listen(PORT, () => console.log("Listening on port " + PORT));
