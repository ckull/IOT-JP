<template>
  <v-app>
    <!-- <vue-particles color="#dedede" :particleOpacity="1" :particleSize="5" :particlesNumber="180" shapeType="circle" :linesWidth="1" :moveSpeed="4">
    </vue-particles> -->
    <canvas id="granim-canvas"></canvas>
    <v-container fluid fill-height>
      <snack-bar></snack-bar>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-6">
            <v-toolbar color="primary">
              <v-toolbar-title class="white--text">Control Panel</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-form @keyup.native.enter="loginWithEmail">
                <v-text-field required :rules="emailRules" prepend-icon="person" name="email" label="Email" type="email" v-model="email"></v-text-field>
                <v-text-field required prepend-icon="lock" name="password" label="Password" type="password" v-model="password"></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="loginWithEmail">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
      <v-dialog hide-overlay origin persistent v-model="loading">
        <v-container fill-height>
          <v-layout row wrap align-center justify-center fill-height>
            <app-spinner :animation-duration="1250" :size="65" color="#64FFDA" />
          </v-layout>
        </v-container>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>
  import Granim from 'granim'
  
  export default {
    data() {
      return {
        email: '',
        password: '',
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
        ]
      }
    },
    mounted() {
      var granimInstance = new Granim({
        element: '#granim-canvas',
        name: 'granim',
        direction: 'diagonal',
        opacity: [1, 1],
        states: {
          "default-state": {
            gradients: [
              ['#c2e59c', '#64b3f4'],
              ['#00C9FF', '#92FE9D'],
              ['#b993d6', '#8ca6db'],
              ['#24c6dc', '#514a9d']
            ]
          }
        }
      });
    },
    created() {
      this.$store.dispatch('signOut').then(() => {
        //signOut
      }).catch(err => {
        console.log(err)
      })
    },
    computed: {
      user() {
        return this.$store.getters.user
      },
      error() {
        return this.$store.getters.error
      },
      loading() {
        return this.$store.getters.loading
      }
    },
    methods: {
      loginWithEmail() {
        var vm = this;
        if (this.user === null) {
          this.$store.dispatch('signIn', {
            email: this.email,
            password: this.password
          }).then(() => {
            vm.$router.push({
              name: 'Dashboard'
            })
          }).catch(err => {
            console.error(err)
          })
        } else {
          console.log('Already sign in')
        }
      }
    }
  }
</script>

<style scoped>
  /* #particles-js {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 0;
  } */

  #granim-canvas {
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 1;
  }
</style>
