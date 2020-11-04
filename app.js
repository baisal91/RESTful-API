//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const { timeStamp } = require("console");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//connect to mongo db
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});


//create collection
const articleSchema = {
    title: String,
    content: String
}

//create model mongoose
const Article = mongoose.model("Article", articleSchema);

/* ************** Request Targetting all Articles ***********************************************/

//Get Route  mongoose
app.get("/articles", function(req, res){
    Article.find(function(err, result){
        if(!err){
            res.send(result);
        }else{
            res.send(err);
        }
        
    })
});

//POST Route  mongoose
app.post("/articles", function(req, res){
    console.log();
    console.log();
    
    const newArticle = new Article({
        title:req.body.title,
        content:req.body.content
    });


    newArticle.save(function(err){
        if(!err){
            res.send("Succsess");
        }else{
            res.send(err);
        }
    });
    
});

//DELETE Route  mongoose
app.delete("/articles", function(req, res){
    Article.deleteMany(function(err){   //model name
        if(!err){
            res.send("Success!");

        }else{
            res.send(err);
        }
    })
});


/* ************** Request Targetting a Spesific Article ***********************************************/
//chaning method same as above
app.route("/articles/:articleTitle")

.get(function(req, res){

    
    Article.findOne(
        {title: req.params.articleTitle},
        function(err, foundArticel){
            if(foundArticel){
                res.send(foundArticel);
            }else{
                res.send("No matching Article!");
            }
        }
    );
})

//update spesific article (all the content of the articles, complete replace)
.put(function(req, res){
    Article.update(
        {title: req.params.articleTitle}, //condition
        {title: req.body.title, content: req.body.content}, //updates
        {overwrite: true},//overwrite
        function(err){
            if(!err){
                res.send("Success!");
            }else{
                res.send(err);
            }
        }
    )
})

//update spesific article (only updates spesicif content)
.patch(function(req, res){
    Article.update(
        {title: req.params.articleTitle},
        {$set: req.body}, //to update only field we want
        function(err){
            if(!err){
                res.send("Success!");
            }else{
                res.send(err);
            }
        }
    )
})

.delete(function(req, res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Success!");
            }else{
                res.send(err);
            }
        }
    )
});






app.listen(3000, function() {
  console.log("Server started on port 3000");
});