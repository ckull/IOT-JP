<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12>
    
                <v-data-table :headers="headers" :items="devices" class="elevation-1">
                    <template slot="items" slot-scope="props">
                                <td class="text-xs-left">{{ props.item._id }}</td>
                                <td class="text-xs-right">{{ props.item.location }}</td>
                                <td class="text-xs-right">{{ props.item.values.acc_x.toFixed(2) }}</td>
                                <td class="text-xs-right">{{ props.item.values.acc_y.toFixed(2) }}</td>
                                <td class="text-xs-right">{{ props.item.values.acc_z.toFixed(2) }}</td>
                                <td class="text-xs-right">{{ props.item.values.gyro_x.toFixed(2) }}</td>
                                <td class="text-xs-right">{{ props.item.values.gyro_y.toFixed(2) }}</td>
                                <td class="text-xs-right">{{ props.item.values.gyro_z.toFixed(2) }}</td>
                                <td class="text-xs-right">{{ props.item.values.phi.toFixed(2) }}</td>
                                <td class="text-xs-right">{{ props.item.values.psi.toFixed(2) }}</td>
                                <td class="text-xs-right">{{ props.item.values.theta.toFixed(2) }}</td>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import Device from '../../services/device'
    
    export default {
        data() {
            return {
                interval: null,
                devices: [],
                headers: [{
                        text: 'UID',
                        align: 'left',
                        sortable: false,
                        value: '_id'
                    },
                    {
                        text: 'Location',
                        value: 'location'
                    },
                    {
                        text: 'Acc_x',
                        value: 'acc_x'
                    },
                    {
                        text: 'Acc_y',
                        value: 'acc_y'
                    },
                    {
                        text: 'Acc_z',
                        value: 'acc_z'
                    },
                    {
                        text: 'gyro_x',
                        value: 'gyro_x'
                    },
                    {
                        text: 'gyro_y',
                        value: 'gyro_y'
                    },
                    {
                        text: 'gyro_z',
                        value: 'gyro_z'
                    },
                    {
                        text: 'phi',
                        value: 'phi'
                    },
                    {
                        text: 'psi',
                        value: 'psi'
                    },
                    {
                        text: 'theta',
                        value: 'theta'
                    }
                ]
            }
        },
        computed: {
            time() {
                return this.$store.getters.time
            }
        },
        created() {
            var vm = this
            this.interval = setInterval(() => {
                Device.fetchDevicesLatest().then(res => {
                    vm.devices = res.data.devices
                })
            }, this.time)
        },
        destroyed() {
            clearInterval(this.interval)
        }
    }
</script>

