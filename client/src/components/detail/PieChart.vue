<script>
  import {
    Pie
  } from 'vue-chartjs'
  import Device from '../../services/device'
  
  export default {
    extends: Pie,
    mounted() {
      var vm = this
      this.fetchDevicesLocation().then(() => {
        vm.renderChart({
          labels: vm.labels,
          datasets: [{
            data: vm.values,
            backgroundColor: vm.colors
          }]
        }, {
          responsive: true,
          maintainAspectRatio: false
        })
      })
    },
    data() {
      return {
        labels: [],
        values: [],
        colors: []
      }
    },
    methods: {
      fetchDevicesLocation() {
        var vm = this
        return new Promise((resolve, reject) => {
          Device.fetchDevicesLocation().then(res => {
            res.data.devices.map(device => {
              vm.labels.push(device._id.location)
              vm.values.push(device.uid.length)
              vm.colors.push(vm.dynamicColors())
            })
            resolve()
          }).catch(err => {
            reject(err)
          })
        })
      },
      dynamicColors() {
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        return "rgb(" + r + "," + g + "," + b + ")";
      }
    }
  }
</script>