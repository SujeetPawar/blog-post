//jshint esversion:6

import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose, { mongo } from "mongoose";
import _ from "lodash";

const port = 3000;
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// Database connection
mongoose.connect(
  "mongodb+srv://sujeetpawar17:acuYZHhVXDFbbBGt@todolistdb.gjsqsjh.mongodb.net/blogPost?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Database Schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

// mongoose model
const Post = mongoose.model("Post", postSchema);

//routing for main page
app.get("/", async (req, res) => {
  try {
    const posts = await Post.find({}); // Retrieve posts from the database

    res.render("home.ejs", {
      startingContent: homeStartingContent,
      posts: posts,
    });
  } catch (err) {
    // Handle the error, render an error page or send an error message
    res.status(500).send("An error occurred while fetching posts.");
  }
});

//routing for about page
app.get("/about", (req, res) => {
  res.render("about.ejs", { aboutContent: aboutContent });
});
app.get("/contact", (req, res) => {
  res.render("contact.ejs", { contactContent: contactContent });
});
app.get("/compose", (req, res) => {
  res.render("compose.ejs");
});

//routing to post on the side
app.post("/compose", async (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  try {
    await post.save(); // Save the new post to the database
    res.redirect("/");
  } catch (err) {
    // Handle the error, render an error page or send an error message
    res.status(500).send("An error occurred while saving the post.");
  }
});

//to go on the post following is the routing
app.get("/posts/:postId", async (req, res) => {
  const requestedPostId = req.params.postId; // Assuming postId is the parameter in the URL
  try {
    const post = await Post.findById(requestedPostId);

    if (post) {
      res.render("post.ejs", {
        title: post.title,
        content: post.content,
      });
    } else {
      res.status(404).send("Post not found.");
    }
  } catch (err) {
    res.status(500).send("An error occurred while fetching the post.");
  }
});

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});

// Key Points

/*The older version of mongoose was working with the call back fuction but it will give error now so you have to  use either asyn fuction that will imply the await and catch else you have to promises i.e. then()and catch but await is rather simple as it is asychronous type we can do it via try and catch block the if have to further condition it will be easy but in promises it will be little bit tricky use chatgpt but uder stand the reason of each line why there it is */
