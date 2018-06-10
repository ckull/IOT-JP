import Api from './api'

export default {
  fetchDevices() {
    return Api().get('devices')
  },
  addDevice(params) {
    return Api().post('devices', params)
  },
  fetchDevice(params) {
    return Api().get('device/' + params.id)
  },
  updateDevice(params) {
    return Api().put('devices/' + params.id, params)
  }
}