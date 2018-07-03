var express = require("express"),
    mongoose = require("mongoose"),
    expressSanitizer = require("express-sanitizer"),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
    app = express();
  
//Connect to mongoose
mongoose.connect("mongodb://localhost/book_review_blog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//Blog model
/*
title
image
body
created date
*/
//MOngoose/model config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type:Date, default:Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

Blog.create({
    title: "Test Blog",
    image:"this is an image",
    body: "Hello this is a test Blog"
});
//Restful Routes
//All 7 routes.

app.get("/",function(req,res){
    res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
    Blog.find({},function(err, blogs){
        if(err){
            console.log(err);
        }else{
               res.render("index",{blogs:blogs});
        }
    });
});


//New route
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

//Create Route
app.post("/blogs", function(req,res){
    Blog.create(req.body.blog, function(err,newBlog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
});

//Show page
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
           res.render("show",{blog:foundBlog}); 
        }
    });
});


//Edit Route
app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("edit", {blog: foundBlog});
        
        }
    });
});

//Update Route
app.put("/blogs/:id", function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

//Delete Route
app.delete("/blogs/:id", function(req,res){
    //Find the blog by id and destroy the blog
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs");
        }
    });
    //redirect to blogs
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
});