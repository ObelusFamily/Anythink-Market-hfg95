//TODO: seeds script should come here, so we'll be able to put some data in our local env
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
var mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  keepAlive: false,
  keepAliveInitialDelay: 3000,
});

let countData = 0;

require("../models/User");
require("../models/Item");
require("../models/Comment");
var Item = mongoose.model("Item");
var Comment = mongoose.model("Comment");
var User = mongoose.model("User");

const ItemData = require("../data/item.json");
const CommentData = require("../data/comment.json");
const UserData = require("../data/user.json");

function InsertData() {
  ItemData.forEach(async (item) => {
    item.seller = item.seller.$oid;
    const oldItem = await Item.find({ title: item.title });
    if (!oldItem.length) {
      var newItem = new Item(item);
      await newItem.save();
      countData++;
    } else {
      console.log(item.slug);
    }
  });

  UserData.forEach(async (user) => {
    const oldUser = await User.find({ username: user.username });
    if (!oldUser.length) {
      var user = new User(user);
      await user.save();
      countData++;
    } else {
      console.log(user.username);
    }
  });

  CommentData.forEach(async (comment) => {
    comment.item = comment.item.$oid;
    comment.seller = comment.seller.$oid;
    var newComment = new Comment(comment);
    const oldComment = await Comment.find({ _id: newComment.id });
    if (!oldComment.length) {
      await newComment.save();
      countData++;
    } else {
      console.log(comment.body);
    }
  });
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

async function cleanup() {
  await Item.deleteMany({}, () => console.log("Data Cleared Item"));
  await Comment.deleteMany({}, () => console.log("Data Cleared Comment"));
  await User.deleteMany({}, () => console.log("Data Cleared User"));
}

async function main() {
  InsertData();
  console.debug("Data Inserted. Closing connection.");
}

main();
setTimeout(() => {
  mongoose.connection.close();
}, 30000);