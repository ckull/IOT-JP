import Vuex from 'vuex';
import Vue from 'vue';
import {ref, auth} from '../../config/firebase'
import Devices from '../../services/device'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        user: null,
        loading: false, 
        error: null,
        devices: [],
        locations: [],
        dialog: false,
        TIME: 500
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload
        },
        setLoading(state, payload) {
            state.loading = payload
        },
        setError(state, payload) {
            state.error = payload
        },
        clearError(state) {
            state.error = null
        },
        setDevices(state, payload) {
            state.devices = payload
        },
        setLocations(state, payload) {
            state.locations = payload
        },
        setDialog(state, payload) {
            state.dialog = payload
        }
    },
    actions: {
        signIn({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('setLoading', true)
                auth.signInWithEmailAndPassword(payload.email, payload.password)
                .then(user => {
                        commit('setLoading', false)
                        const uid = user.uid
                        commit('setUser', uid)
                        resolve()
                    }
                ).catch(err => {
                    commit('setLoading', false)
                    commit('setError', err)
                    reject(err)
                })
            })
        },
        signOut({commit}) {
            return new Promise((resolve, reject) => {
                auth.signOut().then(() => {
                    commit('setUser', null)
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        },
        autoSign({commit}, payload) {
            commit('setUser', payload.uid)
        },
        clearError({commit}) {
            commit('clearError')
        },
        // actionDialog({commit}, payload) {
        //     commit('setDialog', payload)
        // },
        fetchDevices({commit}) {
            return new Promise((resolve, reject) => {
                Devices.fetchDevices().then( res => {
                    commit('setDevices', res.data)
                    resolve()
                }).catch( err => {
                    reject(err)
                })
            })
        },
        fetchLocations({commit}) {
            return new Promise((resolve, reject) => {
                Devices.fetchLocations().then( res => {
                    commit('setLocations', res.data)
                    resolve()
                }).catch( err => {
                    reject(err)
                })
            })
        }
    },
    getters: {
        user(state) {
            return state.user
        },
        error(state) {
            return state.error
        }, 
        loading(state) {
            return state.loading
        },
        devices(state) {
            return state.devices
        },
        time(state) {
            return state.TIME
        },
        locations(state) {
            return state.locations
        },
        dialog(state) {
            return state.dialog
        }
    }
})