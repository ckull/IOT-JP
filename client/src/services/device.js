import Api from './api'

export default {
  fetchDevices() {
    return Api().get('devices/group')
  },
  fetchDevice(params) {
    return Api().get('device/' + params.id)
  },
  updateDevice(params) {
    return Api().post('devices/update/' + params.uid, params)
  },
  fetchLocations() {
    return Api().get('devices/location')
  },
  fetchDeviceLatest(params) {
    return Api().get('device/latest/' + params)
  },
  fetchDevicesLatest() {
    return Api().get('devices/latest')
  },
  fetchDataInfo() {
    return Api().get('mongo')
  },
  fetchDatabase() {
    return Api().get('database')
  },
  fetchDevicesLocation() {
    return Api().get('devices/group/location')
  },
  updateDeviceLocation(uid, location) {
    return Api().post('device/' + uid + '/location/' + location)
  },
  removeDevice(uid) {
    return Api().delete('device/remove/' + uid)
  },
  fetchDeviceSeries(uid) {
    return Api().get('device/series/' + uid)
  }
}