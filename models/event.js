var mongoose = require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");
var eventSchema=new mongoose.Schema({
    eventName: String,
    details: String
});
module.exports = mongoose.model("Event",eventSchema)