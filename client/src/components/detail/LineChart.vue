<script>
    import {
        Line,
        mixins
    } from 'vue-chartjs'
    const {
        reactiveProp
    } = mixins
    
    export default {
        extends: Line,
        mixins: [reactiveProp],
        data() {
            return {
                options: { //Chart.js options
                    responsive: true,
                    maintainAspectRatio: false
                }
            }
        },
        mounted() {
            this.addPlugin({
    
            })
            this.renderChart(this.chartData, this.options)
        }
    }
</script>