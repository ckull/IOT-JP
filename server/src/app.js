/**************************************************************
*  
*   App.js
*
*   Main server file for node.js server
*
*   Command: 
*   - npm install (install dependencies)
*   - npm start (run server)
*
*   Created by Kullapat Siribodhi (CHRIS)
*
****************************************************************/ 

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
// const app = express()
const mongodb_conn_module = require('./mongoose');
var db = mongodb_conn_module.connect();

var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.on('connection', function () {
  console.log('User connected ', socket.id)
});


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

// GET ALL DATABASES
app.get('/devices', (req, res) => {
  Device.find({}, (err, devices) => {
    if (err) {
      console.error(err)
    }
    res.send({
      devices: devices
    })
  }).sort({
    _id: -1
  })
})

// UPDATE DEVICE
app.post('/devices/update/:id', (req, res) => {
  var device = new Device({
    uid: req.params.id,
    values: req.body.values
  })

  device.save(err => {
    if (err) {
      console.error(err)
    }
    res.send({
      success: true,
      message: 'Update device successfully!'
    })
  })
  // Device.aggregate([{
  //     $match: {
  //       uid: req.params.id
  //     }
  //   },
  //   {
  //     $project: {
  //       location: 1
  //     }
  //   },
  //   {
  //     $group: {
  //       _id: {
  //         location: '$location'
  //       }
  //     }
  //   }
  // ], (err, device) => {
  //   var vm = this
  //   if (err) {
  //     console.error(err)
  //   }

  //   if(device.length === 0){
  //     console.log('No data: ', req.params.id)

  //     var newDevice = new Device({
  //       uid: req.params.id,
  //       values: req.body.values
  //     })

  //     newDevice.save(err => {
  //       if (err) {
  //         console.error(err)
  //       }
  //       vm.res.send({
  //         success: true,
  //         message: 'Update device successfully!'
  //       })
  //     })
  //   }else{
  //     device.forEach(res => {
  //       console.log('location: ', res._id)
  //       var newDevice = new Device({
  //         uid: req.params.id,
  //         values: req.body.values,
  //         location: res._id
  //       })

  //       newDevice.save(err => {
  //         if (err) {
  //           console.error(err)
  //         }
  //         // vm.res.send({
  //         //   success: true,
  //         //   message: 'Update device successfully!'
  //         // })
  //         console.log('Update succeed')
  //         return
  //       })
  //     })
  //   }
  // })
})

//TEST UPDATE DEVICE
app.post('/test/devices/update/:id', (req, res) => {

  Device.aggregate([{
      $match: {
        uid: req.params.id
      }
    },
    {
      $project: {
        location: 1
      }
    },
    {
      $group: {
        _id: {
          location: '$location'
        }
      }
    }
  ], (err, device) => {
    if (err) {
      console.error(err)
    }

    var vm = this
    var newLocation = 'NONE'
    device.map(res => vm.newLocation = res._id)

    var device = new Device({
      uid: req.params.id,
      values: req.body.values,
      location: newLocation
    })

    device.save(err => {
      if (err) {
        console.error(err)
      }
      res.send({
        success: true,
        message: 'Update device successfully!'
      })
    })
  })
})

// DELETE ALL DATABASE TO SPECIFIC DEVICE
app.delete('/device/remove/:id', (req, res) => {
  Device.deleteMany({
    uid: req.params.id
  }, (err) => {
    if (err) {
      console.error(err)
    }
    res.send({
      success: true,
      message: `Device: ${req.params.id} has been removed!`
    })
  })
})

// GET THE NUMBER OF DEVICES IN DATABASE
app.get('/devices/group', (req, res) => {
  Device.aggregate([{
    $group: {
      _id: "$uid"
    }
  }], (err, device) => {
    if (err) {
      console.error(err)
    }
    res.send({
      device: device
    })
  })
})

// GET EACH DEVICE VIA UID
app.get('/device/query/:id', (req, res) => {
  Device.find({
    uid: req.params.id
  }, (err, device) => {
    if (err) {
      console.error(err)
    }
    res.send({
      device: device
    })
  })
})

// // UPDATE NAME IN SPECIFIC DEVICE
// app.post('/device/:id/name/:name', (req, res) => {
//   Device.update({uid: req.params.id}, {$set: {name: req.params.name}}, {multi: true}, (err) => {
//     if(err) {
//       console.error(err)
//     }
//     res.send({
//       success: true,
//       message: `Update device name: ${req.params.name}, to device: ${req.params.id} successfully!`
//     })
//   })
// })

// UPDATE LOCATION IN SPECIFIC DEVICE
app.post('/device/:id/location/:location', (req, res) => {
  Device.update({
    uid: req.params.id
  }, {
    $set: {
      location: req.params.location
    }
  }, {
    multi: true
  }, (err) => {
    if (err) {
      console.error(err)
    }
    res.send({
      success: true,
      message: `Update device location: ${req.params.location}, to device: ${req.params.id} successfully!`
    })
  })
})

// GET LATEST DATA FROM SPECIFIC DEVICE
app.get('/device/latest/:id', (req, res) => {
  Device.find({
    uid: req.params.id
  }, (err, device) => {
    if (err) {
      console.error(err)
    }
    res.send({
      device: device
    })
  }).sort({
    _id: -1
  }).limit(1)
})

// GET DEVICE FROM SPECIFIC LOCATION
app.get('/device/location/:location', (req, res) => {
  Device.find({
    location: req.params.location
  }, (err, device) => {
    if (err) {
      console.error(err)
    }
    res.send({
      device: device
    })
  })
})

// GET ALL LOCATION
app.get('/devices/location', (req, res) => {
  Device.aggregate([{
    $group: {
      _id: "$location"
    }
  }], (err, location) => {
    if (err) {
      console.error(err)
    }
    res.send({
      location: location
    })
  })
})

app.get('/device/series/:uid', (req, res) => {
  Device.find(
    {
      uid: req.params.uid
    }, 
    {
      values: 1,
      time: 1
    }
  , (err, device) => {
    if (err) {
      console.error(err)
    }
    res.send({
      device: device
    })
  }).sort({_id: 1})
})


app.get('/devices/latest/', (req, res) => {
  Device.aggregate([{
      $group: {
        _id: "$uid",
        location: {
          $last: "$location"
        },
        values: {
          $last: "$values"
        }
      }
    },
    {
      $project: {
        "uid": "$_id",
        "location": "$location",
        "values": "$values"
      }
    }
  ], (err, devices) => {
    if (err) {
      console.error(err)
    }
    res.send({
      devices: devices
    })
  }).sort({
    _id: -1
  })
})

app.get('/devices/group/location', (req, res) => {
  Device.aggregate([{
    $group: {
      _id: {
        location: "$location"
      },
      uid: {
        $addToSet: "$uid"
      }
    }
  }], (err, devices) => {
    if (err) {
      console.error(err)
    }
    res.send({
      devices: devices
    })
  })
})

app.get('/database', (req, res) => {
  Device.aggregate([{
    $group: {
      _id: {
        uid: "$uid",
        location: "$location"
      }
    }
  }], (err, devices) => {
    res.send({
      devices: devices
    })
  })
})

app.get('/mongo', (req, res) => {
  Device.collection.stats((err, stats) => {
    if (err) {
      console.error(err)
    }
    res.send({
      stats: stats
    })
  })
})

// app.listen(process.env.PORT || 3000, () => {
//   console.log('Server listening on PORT: 3000')
// })

server.listen(3000, () => {
  console.log('PORT: 3000')
})