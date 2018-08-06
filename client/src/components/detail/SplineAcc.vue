<template>
        <div id="Acceleration" style="min-width: 310px; height: 400px; margin: 0 auto">
        </div>
</template>

<script>
    import Highcharts from 'highcharts'
    
    export default {
        props: ['accX', 'accY', 'accZ'],
        mounted() {
            var vm = this
            Highcharts.setOptions({
                global: {
                    useUTC: false
                }
            });
    
            Highcharts.chart('Acceleration', {
                chart: {
                    type: 'spline',
                    // animation: false, // don't animate in old IE
                    marginRight: 50,
                    events: {
                        load: function() {
                            // set up the updating of the chart each second
                            var series_0 = this.series[0];
                            var series_1 = this.series[1];
                            var series_2 = this.series[2];
                            setInterval(function() {
                                var x = (new Date()).getTime()
                                series_0.addPoint([x, vm.accX], false, true);
                                series_1.addPoint([x, vm.accY], false, true);
                                series_2.addPoint([x, vm.accZ], true, true);
                            }, 500);
                        }
                    }
                },
                title: {
                    text: 'Acceleration'
                },
                xAxis: {
                    type: 'datetime',
                    tickPixelInterval: 150
                },
                yAxis: {
                    title: {
                        text: 'Value'
                    },
                    plotLines: [
                        {
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }
                    ]
                },
                tooltip: {
                    formatter: function() {
                        return '<b>' + this.series.name + '</b><br/>' +
                            Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                            Highcharts.numberFormat(this.y, 2);
                    }
                },
                series: [{
                        name: 'X',
                        data: (function() {
                            // generate an array of random data
                            var data = [],
                                time = (new Date()).getTime(),
                                i;
    
                            for (i = -10; i <= 0; i += 1) {
                                data.push({
                                    x: time + i * 500,
                                    y: vm.accX
                                });
                            }
                            return data;
                        }())
                    },
                    {
                        name: 'Y',
                        data: (function() {
                            // generate an array of random data
                            var data = [],
                                time = (new Date()).getTime(),
                                i;
    
                            for (i = -10; i <= 0; i += 1) {
                                data.push({
                                    x: time + i * 500,
                                    y: vm.accY
                                });
                            }
                            return data;
                        }())
                    },
                     {
                        name: 'Z',
                        data: (function() {
                            // generate an array of random data
                            var data = [],
                                time = (new Date()).getTime(),
                                i;
    
                            for (i = -10; i <= 0; i += 1) {
                                data.push({
                                    x: time + i * 500,
                                    y: vm.accZ
                                });
                            }
                            return data;
                        }())
                    }
                ]
            });
        }
    }
</script>