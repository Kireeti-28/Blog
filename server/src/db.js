import { MongoClient } from "mongodb";

let db;

async function connectToDb(cb) {
  const client = new MongoClient(
    "mongodb+srv://Kireeti428:<password>@cluster0.aspzp8b.mongodb.net/"
  );
  await client.connect();
  db = client.db("react-blog-db");
  cb();
}

export { db, connectToDb };
