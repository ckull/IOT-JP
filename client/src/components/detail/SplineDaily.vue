<template>
    <!-- <div id="Accelerations" style="min-width: 310px; height: 400px; margin: 0 auto">
                                                             </div> -->
    
    <div v-if="date">
        <div id="Accelerations" style="min-width: 310px; height: 400px; margin: 0 auto">
        </div>
    </div>
</template>

<script>
    import Highcharts from 'highcharts'
    import Highstock from 'highcharts/highstock'
    import Device from '../../services/device'
    
    export default {
        props: ['uid'],
        methods: {
            fetchDeviceSeries() {
                var vm = this
                return new Promise((resolve, reject) => {
                    Device.fetchDeviceSeries(this.uid).then(res => {
                        res.data.device.forEach(device => {
                            vm.acc_x.push(device.values.acc_x)
                            vm.acc_y.push(device.values.acc_y)
                            vm.acc_z.push(device.values.acc_z)
                            vm.date.push(device.time)
                        })
                        resolve()
                    }).catch(err => {
                        reject(err)
                    })
                })
            },
            fetchAssignData() {
                var vm = this
                return new Promise((resolve, reject) => {
                    vm.fetchDeviceSeries().then(() => {
                        let promise_acc_x = vm.date.map((v, i) => {
                            return [new Date(v).getTime(), vm.acc_x[i]];
                        });
    
                        let promise_acc_y = vm.date.map((v, i) => {
                            return [new Date(v).getTime(), vm.acc_y[i]];
                        });
    
                        let promise_acc_z = vm.date.map((v, i) => {
                            return [new Date(v).getTime(), vm.acc_z[i]];
                        });
    
                        Promise.all([promise_acc_x, promise_acc_y, promise_acc_z]).then((values) => {
                            resolve(values)
                        })
                    }).catch(err => {
                        reject(err)
                    })
                })
            }
        },
        data() {
            return {
                acc_x: [],
                acc_y: [],
                acc_z: [],
                date: [],
                graph_acc_x: null,
                graph_acc_y: null,
                graph_acc_z: null,
                status: true
            }
        },
        mounted() {
            var vm = this
            this.fetchDeviceSeries().then(() => {
                vm.fetchAssignData().then((values) => {
    
                    Highstock.setOptions({
                        global: {
                            useUTC: false
                        }
                    })

                    Highstock.stockChart('Accelerations', {
                        rangeSelector: {
                            selected: 1
                        },
                        title: {
                            text: 'Acceleration Time Series'
                        },
                        series: [
                            {
                                name: 'Acc_X',
                                data: values[0],
                                type: 'spline',
                                tooltip: {
                                    valueDecimals: 2
                                }
                            },
                            {
                                name: 'Acc_Y',
                                data: values[1],
                                type: 'spline',
                                tooltip: {
                                    valueDecimals: 2
                                }
                            },
                            {
                                name: 'Acc_Z',
                                data: values[2],
                                type: 'spline',
                                tooltip: {
                                    valueDecimals: 2
                                }
                            }
                        ]
                    });
                }).catch(err => {
                    console.error(err)
                })
            }).catch(err => {
                console.error(err)
            })
        }
    }
</script>