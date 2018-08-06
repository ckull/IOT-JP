<template>
    <v-card hover @click.native="routeData" height="100%" class="rounded-card">
        <v-container fluid fill-height>
            <v-layout row wrap align-center>
                <v-flex xs6 class="text-xs-center">
                    <div>
                        <img src="../../assets/raspberry-pi.png">
                    </div>
                </v-flex>
                <v-flex xs6 class="text-xs-right">
                    <div class="headline" v-if="devices">{{devices.length}}</div>
                    <hr>
                    <div>Number of devices</div>
                </v-flex>
            </v-layout>
        </v-container>
    </v-card>
</template>

<script>
    import Device from '../../services/device'
    
    export default {
        computed: {
            devices() {
                return this.$store.getters.devices.device
            }
        },
        methods: {
            routeData() {
                return this.$router.push({
                    name: 'Devices'
                })
            }
        }
    }
</script>

<style scoped>
    hr {
        opacity: 0.5
    }
</style>

