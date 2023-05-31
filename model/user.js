const crypto = require("crypto")

const mongoose = require("mongoose")

const jwt = require("jsonwebtoken")

const UserSchema = new mongoose.Schema({

    firstName : {
        type :String,
        required : [true ,"Please provide a username"]
    },
    lastName : {
        type :String,
        required : [true ,"Please provide a username"]
    },
    email : {
        type: String ,
        required : [true ,"Please provide a email"],
        unique : true ,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password : {
        type:String,
        minlength: [6, "Please provide a password with min length : 6 "],
        required: [true, "Please provide a password"]
    },
    age: {
        type: Number,
        required : [true, "Please enter your age"]
    },
    token : {
        type:String
    },


},{timestamps: true})








const User = mongoose.model("User",UserSchema)

module.exports = User  ;