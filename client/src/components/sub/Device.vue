<template>
    <v-card hover v-if="value" @click.native="routeData" class="rounded-card">
        <v-container>
            <v-layout row wrap>
                <v-flex xs12>
                    <v-layout row wrap class=" align-center">
                        <v-flex xs6 class="text-xs-center">
                            <v-avatar color="grey lighten-3" size="72">
                                <img src="../../assets/sound-card.png" alt="">
                            </v-avatar>
                        </v-flex>
                        <v-flex xs6 class="text-xs-left">
                            <div class="headline mb-0 text-overflow: ellipsis">UID: <span class="value">{{ value.uid }}</span></div>
                            <div class="headline mb-0 text-overflow: ellipsis">LOCATION: <span class="value">{{ value.location }}</span></div>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex xs12 lg6>
                    <v-card class="rounded-card">
                        <v-container text-xs-center>
                            <v-layout row wrap class="align-center">
                                <v-flex xs6>
                                    <img src="../../assets/celsius.png" alt="">
                                </v-flex>
                                <v-flex xs6>
                                    <v-progress-circular :size="90" :width="15" :rotate="-90" :value="value.values.temp" color="teal">
                                        {{ value.values.temp.toFixed(2) }}
                                    </v-progress-circular>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card>
                </v-flex>
                <v-flex xs12 lg6>
                    <v-card class="rounded-card">
                        <v-container text-xs-center>
                            <v-layout row wrap class="align-center">
                                <v-flex xs6>
                                    <img src="../../assets/humidity.png" alt="">
                                </v-flex>
                                <v-flex xs6>
                                    <v-progress-circular :size="90" :width="15" :rotate="-90" :value="value.values.humidity" color="teal">
                                        {{ value.values.humidity.toFixed(1) }} %
                                    </v-progress-circular>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card>
                </v-flex>
                <v-flex xs6 sm4>
                    <v-card class="text-xs-center rounded-card">
                        <v-card-text>
                            <div><b>Acc_X:</b> <span class="value">{{ value.values.acc_x.toFixed(2) }}</span></div>
                            <div><b>Acc_Y:</b> <span class="value">{{ value.values.acc_y.toFixed(2) }}</span></div>
                            <div><b>Acc_Z:</b> <span class="value">{{ value.values.acc_z.toFixed(2) }}</span></div>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex xs6 sm4>
                    <v-card class="text-xs-center rounded-card">
                        <v-card-text>
                            <div><b>Gyro_X</b>: <span class="value">{{ value.values.gyro_x.toFixed(2) }}</span></div>
                            <div><b>Gyro_Y</b>: <span class="value">{{ value.values.gyro_y.toFixed(2) }}</span></div>
                            <div><b>Gyro_Z</b>: <span class="value">{{ value.values.gyro_z.toFixed(2) }}</span></div>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex xs6 sm4>
                    <v-card class="text-xs-center rounded-card">
                        <v-card-text>
                            <div><b>θ:</b> <span class="value">{{ value.values.theta.toFixed(2) }}</span></div>
                            <div><b>Ψ:</b> <span class="value">{{ value.values.psi.toFixed(2) }}</span></div>
                            <div><b>Ф:</b> <span class="value">{{ value.values.phi.toFixed(2) }}</span></div>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </v-card>
</template>

<script>
    import Device from '../../services/device'
    // import LineChart from './Temperature.vue'
    // import { ModelThree } from 'vue-3d-model'
    
    export default {
        props: ['deviceUid'],
        components: {
            // LineChart,
            // ModelThree
        },
        data() {
            return {
                device: [],
                interval: null,
                value: null
            }
        },
        created() {
            var vm = this
            this.interval = setInterval(() => {
                vm.fetchLatestDevice()
            }, this.time);
        },
        destroyed() {
            clearInterval(this.interval)
        },
        computed: {
            time() {
                return this.$store.getters.time
            }
        },
        methods: {
            fetchLatestDevice() {
                var vm = this
                return Device.fetchDeviceLatest(this.deviceUid._id).then(res => {
                    res.data.device.map(device => {
                        vm.value = device
                    })
                }).catch(err => {
                    console.error(err)
                })
            },
            routeData() {
                return this.$router.push({
                    name: 'Device',
                    params: {
                        uid: this.value.uid
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .box {
        border-style: groove;
    }
    
    .gradient {
        background: #8e9eab;
        /* fallback for old browsers */
        background: -webkit-linear-gradient(to top, #eef2f3, #8e9eab);
        /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to top, #eef2f3, #8e9eab);
        /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    }
</style>
