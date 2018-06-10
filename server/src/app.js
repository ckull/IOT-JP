const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const mongodb_conn_module = require('./mongoose');
var db = mongodb_conn_module.connect();

app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send(
    [{
      title: "Hello World!",
      description: "Hi there! How are you?"
    }]
  )
})

var Device = require("../models/device");

app.post('/devices', (req, res) => {
  var db = req.db;
  var title = req.body.title;
  var description = req.body.description;

  var new_device = new Device({
    title: title,
    description: description
  })

  new_device.save( err => {
    if (err) {
      console.log(err)
    }
    res.send({
      success: true,
      message: 'Add device successfully!'
    })
  })
})

app.get('/devices', (req, res) => {
  Device.find({}, (err, devices) => {
    if (err) {
      console.error(err)
    }
    res.send({
      devices: devices
    })
  })
})

app.get('/device/:id', (req, res) => {
  Device.findById(req.params.id, (err, device) => {
    if(err) {
      console.error(err)
    }
    res.send({
      device: device
    })
  })
})

app.post('/devices/:id', (req, res) => {
  Device.findById(req.params.id, (err, device) => {
    if(err) {
      console.error(err)
    }
    device.title = req.body.title;
    device.description = req.body.description;
    device.save( err => {
      if(err) {
        console.error(err)
      }
      res.send({
        success: true,
        message: 'Update device successfully!'
      })
    })
  })
})

app.delete('/device/:id', (req, res) => [
  Device.remove({
    _id: req.params.id
  }, (err) => {
    if(err){
      console.error(err)
    }
    res.send({
      success: true,
      message: 'Delete device successfully!'
    })
  })
])


app.listen(process.env.PORT || 3000, () => {
  console.log('Server listening on PORT: 3000')
})