<template>
  <v-app>
    <v-navigation-drawer persistent :mini-variant="miniVariant" :clipped="clipped" v-model="drawer" enable-resize-watcher fixed app v-if='user'>
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <v-icon>face</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Admin</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list class="pt-0" dense>
        <v-divider></v-divider>
        <v-list-tile value="true" v-for="(item, i) in items" :key="i" @click="routeMenu(item)">
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app :clipped-left="clipped" v-if="user">
      <v-toolbar-side-icon @click.stop="drawer = !drawer" v-if="user"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat color="red" @click="signOut">SIGN OUT</v-btn>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <v-footer :fixed="fixed" app v-if="user">
      <v-layout row wrap justify-center>
        <span>&copy; 2018 - Kullapat Siribodhi</span>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data() {
      return {
        clipped: false,
        drawer: true,
        fixed: false,
        items: [{
            icon: 'home',
            title: 'Home',
            name: 'Dashboard'
          },
          {
            icon: 'location_searching',
            title: 'Devices',
            name: 'Devices'
          },
          {
            icon: 'storage',
            title: 'Database',
            name: 'Database'
          }
        ],
        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'Internship'
      }
    },
    computed: {
      user() {
        return this.$store.getters.user
      }
    },
    methods: {
      routeMenu(item) {
        return this.$router.push({
          name: item.name
        })
      },
      signOut() {
        return this.$store.dispatch('signOut').catch(err => {
          console.error(err)
        })
      },
      mouseOver() {
        console.log('mouse')
      }
    }
  }
</script>

<style>
  .rounded-card {
    border-radius: 25px;
  }
  
  .value {
    color: teal;
  }
</style>

