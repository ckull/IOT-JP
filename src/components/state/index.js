import Vuex from 'vuex';
import Vue from 'vue';
import {ref, auth} from '../../config/firebase.js'
import { stat } from 'fs';


Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        user: null,
        loading: false, 
        error: null
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
        }
    },
    getters: {
        user (state){
            return state.user
        },
        error (state) {
            return state.error
        }, 
        loading (state) {
            return state.loading
        }
    }
})