import fs from "fs";
import express from "express";
import { db, connectToDb } from "./db.js";
import admin from "firebase-admin";

const credentials = JSON.parse(fs.readFileSync("./credential.json"));

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const app = express();

app.use(express.json());

app.use(async (req, res, next) => {
  const { authtoken } = req.headers;

  if (authtoken) {
    try {
      req.user = await admin.auth().verifyIdToken(authtoken);
    } catch (e) {
      return res.sendStatus(400);
    }
  }

  req.user = req.user || {};

  next();
});

app.get("/api/articles/:name", async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user;

  const article = await db.collection("articles").findOne({ name });

  if (article) {
    const upvotesIds = article.upvoteIds || [];
    article.canUpVote = uid && !upvotesIds.include(uid);
    res.json(article);
  } else {
    res.sendStatus(404);
  }
});

app.use((req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
});

app.put("/api/articles/:name/upvote", async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user;

  if (article) {
    const upvotesIds = article.upvoteIds || [];
    const canUpVote = uid && !upvotesIds.includes(uid);

    if (canUpVote) {
      await db.collection("articles").updateOne(
        { name },
        {
          $inc: { upvotes: 1 },
          $push: { upvotesIds: uid },
        }
      );
    }

    const updatedArticle = await db.collection("articles").findOne({ name });
    res.json(updatedArticle);
  } else {
    res.send(`Article doesn't exit.`);
  }
});

app.post("/api/articles/:name/comments", async (req, res) => {
  const { name } = req.params;
  const { text } = req.body;
  const { email } = req.user;

  await db.collection("articles").updateOne(
    { name },
    {
      $push: { comments: { postedBy: email, text } },
    }
  );

  const article = await db.collection("articles").findOne({ name });

  if (article) {
    res.json(article);
  } else {
    res.send("Article not found");
  }
});

connectToDb(() => {
  console.log("Succesfully connected to database!");
  app.listen(8000, () => {
    console.log("Server is listening on port :8000");
  });
});
