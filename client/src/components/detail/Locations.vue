<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" max-width="600px">
            <v-card v-if="dialog">
                <v-card-title></v-card-title>
                <pie-chart></pie-chart>
                <v-card-actions></v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    import PieChart from './PieChart.vue'
    import Device from '../../services/device'
    
    export default {
        components: {
            PieChart
        },
        computed: {
            dialog: {
                get() {
                    return this.$store.getters.dialog
                },
                set(value) {
                    this.$store.commit('setDialog', value)
                }
            }
        }
    }
</script>


