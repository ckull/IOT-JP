<template>
    <div id="container" style="min-width: 310px; height: 400px; margin: 0 auto">
    </div>
</template>

<script>
    import Highcharts from 'highcharts'
    require('highcharts/modules/exporting')(Highcharts);
    require('highcharts/highcharts-3d')(Highcharts);
    import Exporting from 'highcharts/modules/exporting'
    import Device from '../../services/device'
    
    export default {
        props: ['uid'],
        data() {
            return {
                acc: [],
                euler: [],
                gyro: []
            }
        },
        methods: {
            fetchDeviceSeries() {
                var vm = this
                return new Promise((resolve, reject) => {
                    Device.fetchDeviceSeries(this.uid).then(res => {
                        res.data.device.forEach(device => {
                            vm.acc.push([device.values.acc_x, device.values.acc_y, device.values.acc_z])
                            vm.gyro.push([device.values.gyro_x, device.values.gyro_y, device.values.gyro_z])
                            vm.euler.push([device.values.psi, device.values.phi, device.values.theta])
                        })
                        resolve()
                    }).catch(err => {
                        reject(err)
                    })
                })
            }
        },
        mounted() {
            var vm = this
            this.fetchDeviceSeries().then(() => {
                console.log(this.acc)

                var chart = Highcharts.chart('container', {
                    chart: {
                        type: 'scatter3d',
                        options3d: {
                            enabled: true,
                            alpha: 10,
                            beta: 30,
                            depth: 250,
                            viewDistance: 10,
                            frame: {
                                bottom: {
                                    size: 1,
                                    color: 'rgba(0,0,0,0.02)'
                                },
                                back: {
                                    size: 1,
                                    color: 'rgba(0,0,0,0.04)'
                                },
                                side: {
                                    size: 1,
                                    color: 'rgba(0,0,0,0.06)'
                                }
                            }
                        }
                    },
                    title: {
                        text: '3D Scatter Plot'
                    },
                    subtitle: {
                        text: 'Acc, Gyro, Euler'
                    },
                    plotOptions: {
                        scatter: {
                            width: 10,
                            height: 10,
                            depth: 10,
                        },
                        scatter3d: {
                            marker: {
                                lineColor: '#ffffff',
                                lineWidth: 1
                            }
                        }
                    },
                    yAxis: {
                        min: -20,
                        max: 20
                    },
                    xAxis: {
                        min: -20,
                        max: 20,
                        gridLineWidth: 1
                    },
                    zAxis: {
                        min: -20,
                        max: 20,
                        showFirstLabel: false
                    },
                    series: [{
                            name: 'Acceleration',
                            data: vm.acc
                        },
                        {
                            name: 'Gyroscope',
                            data: vm.gyro
                        },
                        {
                            name: 'Euler Angle',
                            data: vm.euler
                        },
                    ]
                });
    
                // Add mouse and touch events for rotation
                (function(H) {
                    function dragStart(eStart) {
                        eStart = chart.pointer.normalize(eStart);
    
                        var posX = eStart.chartX,
                            posY = eStart.chartY,
                            alpha = chart.options.chart.options3d.alpha,
                            beta = chart.options.chart.options3d.beta,
                            sensitivity = 5; // lower is more sensitive
    
                        function drag(e) {
                            // Get e.chartX and e.chartY
                            e = chart.pointer.normalize(e);
    
                            chart.update({
                                chart: {
                                    options3d: {
                                        alpha: alpha + (e.chartY - posY) / sensitivity,
                                        beta: beta + (posX - e.chartX) / sensitivity
                                    }
                                }
                            }, undefined, undefined, false);
                        }
    
                        chart.unbindDragMouse = H.addEvent(document, 'mousemove', drag);
                        chart.unbindDragTouch = H.addEvent(document, 'touchmove', drag);
    
                        H.addEvent(document, 'mouseup', chart.unbindDragMouse);
                        H.addEvent(document, 'touchend', chart.unbindDragTouch);
                    }
                    H.addEvent(chart.container, 'mousedown', dragStart);
                    H.addEvent(chart.container, 'touchstart', dragStart);
                }(Highcharts));
            })
        }
    }
</script>