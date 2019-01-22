var mongoose = require("mongoose");

var contactSchema=new mongoose.Schema({
    teamname: String,
    details: String
});
module.exports = mongoose.model("Contact",contactSchema)