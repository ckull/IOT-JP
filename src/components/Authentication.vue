<template>
  <v-app>
    <v-content>
      <vue-particles color="#dedede" 
        :particleOpacity="1"
        :particleSize = "5"
        :particlesNumber="180"
        shapeType="circle"
        :linesWidth="1"
        :moveSpeed="2"
        >
  
      </vue-particles>
      <v-container fluid>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-layout row v-if="error">
              <snack-bar @dismissed="onDismissed" :text="error.message"></snack-bar>
              <!-- <app-alert @dismissed="onDismissed" :text="error.message"></app-alert> -->
            </v-layout>
            <v-card class="elevation-9">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Control Panel</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field required :rules="emailRules" prepend-icon="person" name="email" label="Email" type="email" v-model="email"></v-text-field>
                  <v-text-field required prepend-icon="lock" name="password" label="Password" type="password" v-model="password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <!-- <v-btn color="primary" @click="registerWithEmail">Register</v-btn> -->
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="loginWithEmail">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout row align-center justify-center v-if="loading">
          <app-spinner :animation-duration="1250" :size="65" color="#64FFDA" />
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
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
      },
      onDismissed() {
        console.log('Dismissed Alert')
        this.$store.dispatch('clearError')
      }
    }
  }
</script>

<style scoped>
  #particles-js {
    position: absolute;
    /* background-color: darksalmon; */
    left: 0;
    right: 0;
    top: -80px;
    bottom: 0;
    z-index: 0;
  }
</style>
