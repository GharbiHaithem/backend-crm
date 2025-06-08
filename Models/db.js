const mongoose = require("mongoose");

//const mongo_url = process.env.MONGO_CONN;

const mongo_url = "mongodb+srv://gharbihaythem1988:gharbihaythem1988@cluster0.qo7cz8z.mongodb.net/";
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected...");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error: ", err);
  });
