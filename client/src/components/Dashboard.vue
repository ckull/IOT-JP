<template>
    <v-app>
        <v-container grid-list-xl>
            <v-layout row wrap>
                <v-flex xs12 sm3 md4>
                    <Devices></Devices>
                </v-flex>
                <v-flex xs12 sm3 md4>
                    <Locations></Locations>
                </v-flex>
                <v-flex xs12 sm6 md4>
                    <Mongo></Mongo>
                </v-flex>
                <v-flex xs12 sm6 v-for="device in devices" :key="device._id">
                    <Device :deviceUid="device"></Device>
                </v-flex>
            </v-layout>  
        </v-container>
    </v-app>
</template>

<script>
    import Devices from './sub/Devices.vue'
    import Device from './sub/Device.vue'
    import Locations from './sub/Locations.vue'
    import Mongo from './sub/Mongo.vue'
    
    export default {
        components: {
            Devices,
            Device,
            Locations,
            Mongo
        },
        data() {
            return {
                value: 30,
                oldValue: 0,
                interval: null
            }
        },
        created() {
            var vm = this
            this.interval = setInterval( () => {
                vm.$store.dispatch('fetchDevices').then( () => {
                   // fetch device
                }).catch(err => {
                    console.error(err)
                })

                vm.$store.dispatch('fetchLocations').then( () => {
                   // fetch location
                }).catch(err => {
                    console.error(err)
                })
            }, this.time);
        },
        destroyed () {
            console.log('Destroy devices')
            clearInterval(this.interval)
        },
        computed: {
            user() {
                return this.$store.getters.user
            },
            devices() {
                return this.$store.getters.devices.device
            },
            time() {
                return this.$store.getters.time
            }
        },
        methods: {
            devicesList(devices) {
                return devices.device
            }
        },
        update() {
            if (this.user === null) {
                this.$router.push({
                    name: 'Authentication'
                })
                // alert('Require Authentication')
            }
        }
    }
</script>

<style scoped>
    
</style>



