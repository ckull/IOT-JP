<template>
    <v-card hover height="100%" @click.native="routeData" class="rounded-card">
        <v-container fluid fill-height>
            <v-layout row wrap align-center>
                <v-flex xs6 class="text-xs-center">
                    <div>
                        <img src="../../assets/home.png" >
                    </div>
                </v-flex>
                <v-flex xs6 class="text-xs-right">
                     <div class="headline" v-if="locations">{{locations.length}}</div>
                     <hr>
                     <div>Number of Locations</div>
                </v-flex>
                <Locations></Locations>
            </v-layout>
        </v-container>
    </v-card>
</template>

<script>
    import Devices from '../../services/device'
    import Locations from '../detail/Locations.vue'
    export default {
        components: {
            Locations
        },
        computed: {
            locations(){
                return this.$store.getters.locations.location
            },
            dialog() {
                return this.$store.getters.dialog
            }
        },
        methods: {
            routeData() {
                this.$store.commit('setDialog', true)
            }
        }
    }
</script>

<style scoped>
    hr{
        opacity: 0.5;
    }
</style>
