import Api from './api'

export default {
  fetchDevices () {
    return Api().get('devices')
  }
}