var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DeviceSchema = new Schema({
  uid: String,
  location: {type: String, default: "NONE"},
  values: {
    temp: Number,
    humidity: Number,
    acc_x: Number,
    acc_y: Number,
    acc_z: Number,
    gyro_x: Number,
    gyro_y: Number,
    gyro_z: Number,
    theta: Number,
    psi: Number,
    phi: Number
  },
  time: { type: Date, default: Date.now }
});

var Device = mongoose.model("Device", DeviceSchema);
module.exports = Device;