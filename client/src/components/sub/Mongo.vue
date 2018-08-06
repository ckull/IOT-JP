<template>
    <v-card hover height="100%" class="rounded-card">
        <v-container v-if="data" fluid fill-height>
            <v-layout row wrap align-center>
                <v-flex xs6 class="text-xs-center">
                    <img src="../../assets/mongo.png" style="max-height: 108px; max-width: 108px;">
                </v-flex>
                <v-flex xs6 class="text-xs-left">
                    <div >
                        Indexes: {{ data.nindexes }}
                    </div>
                    <div >
                        Total Size: {{ (data.size/1000000).toFixed(2) }} MB
                    </div>
                    <div >
                        Documents: {{ (data.count/1000).toFixed(2) }} K
                    </div>
                    <div >
                        Storage Size: {{ (data.storageSize/1000000).toFixed(2) }} MB
                    </div>
                </v-flex>
            </v-layout>
        </v-container>
    </v-card>
</template>

<script>
    import Devices from '../../services/device'
    
    export default {
        data() {
            return {
                data: null
            }
        },
        created() {
            this.fetchDataInfo()
        },
        methods: {
            fetchDataInfo() {
                var vm = this
                Devices.fetchDataInfo().then(res => {
                    vm.data = res.data.stats
                }).catch(err => {
                    console.error(err)
                })
            }
        }
    }
</script>