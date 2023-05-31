const mongoose = require("mongoose")

const jwt = require("jsonwebtoken")

const ArticleSchema = new mongoose.Schema({

    authorId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    Author:{
        type:new mongoose.Schema(
            {firstName : {
            type :String,
            required : [true ,"Please provide a username"]
        },
        lastName : {
            type :String,
            required : [true ,"Please provide a username"]
        },
        email : {
            type: String ,
            required : [true ,"Please provide a email"]
        },
        age: {
            type: Number,
            required : [true, "Please enter your age"]
        }
    }),
          required:true
    },
    slug: String,
    title: {
        type: String,
        required: [true, "Please provide a title"]
    },
    content: {
        type: String,
        required: [true, "Please a provide a content "],
        minlength: [10, "Please provide a content least 10 characters "],
    },


},{timestamps: true})








const Article = mongoose.model("Article",ArticleSchema)

module.exports = Article  ;