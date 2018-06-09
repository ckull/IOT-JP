var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DeviceSchema = new Schema({
  title: String,
  description: String
});

var Device = mongoose.model("Device", DeviceSchema);
module.exports = Device;