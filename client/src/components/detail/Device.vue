<template>
    <v-container align-center grid-list-lg v-if="value">
        <v-layout row wrap>
            <v-flex xs12>
                <v-card class="rounded-card">
                    <v-container>
                        <v-layout row wrap>
                            <v-flex xs12 class="text-xs-right">
                                <div class="headline">UID: {{ value.uid}}</div>
                                <div class="headline">LOCATION: {{value.location}}</div>
                            </v-flex>
                        </v-layout>
                    </v-container>
                    <v-card-actions>
                        <v-container>
                            <v-layout row wrap>
                                <v-flex xs12 sm6>
                                    <v-card hover class="rounded-card">
                                        <v-container class="text-xs-center">
                                            <v-layout row wrap class="align-center">
                                                <v-flex xs6>
                                                    <img src="../../assets/celsius.png">
                                                    <!-- <span>Temperature</span> -->
                                                </v-flex>
                                                <v-flex xs6>
                                                    <v-progress-circular :size="100" :width="15" :rotate="-90" :value="Number(value.values.temp.toFixed(2))" color="teal">
                                                        {{ value.values.temp.toFixed(2) }}
                                                    </v-progress-circular>
                                                </v-flex>
                                            </v-layout>
                                        </v-container>
                                    </v-card>
                                </v-flex>
                                <v-flex xs12 sm6>
                                    <v-card hover class="rounded-card">
                                        <v-container class="text-xs-center">
                                            <v-layout row wrap class="align-center">
                                                <v-flex xs6>
                                                    <img src="../../assets/humidity.png">
                                                </v-flex>
                                                <v-flex xs6>
                                                    <v-progress-circular :size="100" :width="15" :rotate="-90" :value="Number(value.values.humidity.toFixed(2))" color="teal">
                                                        {{ value.values.humidity.toFixed(1) }} %
                                                    </v-progress-circular>
                                                </v-flex>
                                            </v-layout>
                                        </v-container>
                                    </v-card>
                                </v-flex>
                                <v-flex xs12 sm4>
                                    <bar-chart :chart-data="datacollection_acc"></bar-chart>
                                </v-flex>
                                <v-flex xs12 sm4>
                                    <bar-chart :chart-data="datacollection_gyro"></bar-chart>
                                </v-flex>
                                <v-flex xs12 sm4>
                                    <bar-chart :chart-data="datacollection_eular"></bar-chart>
                                </v-flex>
                                <v-flex xs12>
                                    <v-card class="rounded-card">
                                        <v-container>
                                            <v-layout row wrap>
                                                <v-flex xs12>
                                                    <spline-temp :temp="value.values.temp" :humidity="value.values.humidity"></spline-temp>
                                                </v-flex>
                                            </v-layout>
                                        </v-container>
                                    </v-card>
                                </v-flex>
                                <v-flex xs12>
                                    <v-card class="rounded-card">
                                        <v-container>
                                            <v-layout row wrap>
                                                <v-flex xs12>
                                                    <spline-acc :accX="value.values.acc_x" :accY="value.values.acc_y" :accZ="value.values.acc_z"></spline-acc>
                                                </v-flex>
                                            </v-layout>
                                        </v-container>
                                    </v-card>
                                </v-flex>
                                <v-flex xs12>
                                    <v-btn block round color="warning" @click.prevent="showAnalysis = !showAnalysis">{{ moreAnalysis }}</v-btn>
                                </v-flex>
                                <v-flex xs12 v-if="showAnalysis">
                                    <!-- Time-series -->
                                    <v-flex xs12>
                                        <v-card class="rounded-card">
                                            <v-container>
                                                <v-layout row wrap>
                                                    <v-flex xs12>
                                                        <spline-daily :uid="value.uid"></spline-daily>
                                                    </v-flex>
                                                </v-layout>
                                            </v-container>
                                        </v-card>
                                    </v-flex>
                                    <!-- 3D-Scatter Plot [TOO OVERLOADED]-->
                                    <!-- <v-flex xs12>
                                        <v-card class="rounded-card">
                                            <v-container>
                                                <v-layout row wrap>
                                                    <v-flex xs12>
                                                        <scatter-plot :uid="value.uid"></scatter-plot>
                                                    </v-flex>
                                                </v-layout>
                                            </v-container>
                                        </v-card>
                                    </v-flex> -->
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import Device from '../../services/device'
    import BarChart from './BarChart.vue'
    import LineChart from './LineChart.vue'
    import SplineTemp from './SplineTemp.vue'
    import SplineAcc from './SplineAcc.vue'
    import SplineDaily from './SplineDaily.vue'
    import ThreeModel from './ThreeModel.vue'
    import ScatterPlot from './ScatterPlot.vue'
    import Chart from 'chart.js'
    import Moment from 'moment'
    import plugin from 'chartjs-plugin-streaming'
    
    export default {
        components: {
            BarChart,
            LineChart,
            SplineTemp,
            SplineAcc,
            ThreeModel,
            SplineDaily,
            ScatterPlot
        },
        data() {
            return {
                interval: null,
                value: null,
                datacollection_acc: null,
                datacollection_gyro: null,
                datacollection_eular: null,
                datacollection_temp: null,
                dates: [],
                temp: [],
                showAnalysis: false
            }
        },
        computed: {
            time() {
                return this.$store.getters.time
            },
            moreAnalysis() {
                if (this.showAnalysis) {
                    return 'Less Analysis'
                } else {
                    return 'More Analysis'
                }
            }
        },
        created() {
            var vm = this
            this.interval = setInterval(() => {
                vm.fetchLatestDevice().then(() => {
                    vm.fillAllData()
                }).catch(err => {
                    console.error(err)
                })
            }, this.time);
        },
        destroyed() {
            clearInterval(this.interval)
        },
        methods: {
            fetchLatestDevice() {
                var vm = this
                return new Promise((resolve, reject) => {
                    Device.fetchDeviceLatest(this.$route.params.uid).then(res => {
                        res.data.device.map(device => {
                            vm.value = device
                        })
                        resolve()
                    }).catch(err => {
                        reject(err)
                    })
                })
            },
            fillAllData() {
                this.fillAccData()
                this.fillGyroData()
                this.fillEularData()
                // this.fillTempData()
            },
            fillAccData() {
                return this.datacollection_acc = {
                    labels: ['acc_x', 'acc_y', 'acc_z'],
                    datasets: [{
                        label: 'Acceleration',
                        borderWidth: 1,
                        data: [this.value.values.acc_x, this.value.values.acc_y, this.value.values.acc_z],
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.6)",
                            "rgba(54, 162, 235, 0.6)",
                            "rgba(255, 206, 86, 0.6)",
                        ]
                    }]
                }
            },
            fillGyroData() {
                return this.datacollection_gyro = {
                    labels: ['gyro_x', 'gyro_y', 'gyro_z'],
                    datasets: [{
                        label: 'Gyroscope',
                        borderWidth: 1,
                        data: [this.value.values.gyro_x, this.value.values.gyro_y, this.value.values.gyro_z],
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.6)",
                            "rgba(54, 162, 235, 0.6)",
                            "rgba(255, 206, 86, 0.6)",
                        ]
                    }]
                }
            },
            fillEularData() {
                return this.datacollection_eular = {
                    labels: ['psi', 'phi', 'theta'],
                    datasets: [{
                        label: 'Euler Angle',
                        borderWidth: 1,
                        data: [this.value.values.psi, this.value.values.phi, this.value.values.theta],
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.6)",
                            "rgba(54, 162, 235, 0.6)",
                            "rgba(255, 206, 86, 0.6)",
                        ]
                    }]
                }
            },
            fillTempData() {
                const ctx = this.$refs.lineChart
                var vm = this
                var chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        datasets: [{
                            data: [],
                            label: 'Celcius',
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            lineTension: 0,
                            borderDash: [8, 4]
                        }]
                    },
                    options: {
                        scales: {
                            xAxes: [{
                                type: 'realtime'
                            }],
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        },
                        plugins: {
                            streaming: {
                                onRefresh: function(chart) {
                                    chart.data.datasets.forEach(function(dataset) {
                                        dataset.data.push({
                                            x: Date.now(),
                                            y: Math.random()
                                        });
                                    });
                                }
                            }
                        }
                    }
                });
            }
        }
    }
</script>