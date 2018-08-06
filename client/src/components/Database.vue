<template>
    <v-app>
        <v-container>
            <v-layout row wrap align-center justify-center>
                <v-flex xs12 class="text-xs-right">
                    <v-btn class="primary" @click="addDevice">Add Device</v-btn>
                </v-flex>
                <v-flex xs12>
                     <v-dialog v-model="dialog" max-width="500px">
                        <v-card>
                            <v-card-title>
                                <span class="headline">Edit Item</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container grid-list-md>
                                    <v-layout wrap>
                                        <v-flex xs12 sm6>
                                            <v-text-field v-model="editedItem.uid" disabled label="UID"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm6>
                                            <v-text-field v-model="editedItem.location" label="Location"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn flat color="green" @click="submitLocation(editedItem.uid)">Submit</v-btn>
                                <v-btn flat color="red" @click="cancelDialog">Cancel</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-data-table :headers="headers" :items="devices" hide-actions class="elevation-1">
                        <template slot="items" slot-scope="props">
                                <td class="text-xs-left">{{ props.item.uid }}</td>
                                <td class="text-xs-right">{{ props.item.location }}</td>
                                <td class="justify-center layout px-0">
                                <v-btn icon class="mx-0" @click.prevent="editItem(props.item)">
                                    <v-icon color="teal">edit</v-icon>
                                </v-btn>
                                <v-btn icon class="mx-0" @click.prevent="deleteItem(props.item)">
                                    <v-icon color="pink">delete</v-icon>
                                </v-btn>
                                </td>
                        </template>
                    </v-data-table>
                </v-flex>
            </v-layout>
        </v-container>
    </v-app>
</template>

<script>
    import Device from '../services/device'
    
    export default {
        data() {
            return {
                devices: [],
                headers: [{
                        text: 'UID',
                        align: 'left',
                        sortable: false,
                        value: 'uid'
                    },
                    {
                        text: 'Location',
                        value: 'location'
                    },
                    {
                        text: 'Actions',
                        value: 'action',
                        sortable: false
                    }
                ],
                editedIndex: -1,
                editedItem: {
                    uid: '',
                    location: ''
                }
            }
        },
        created() {
            var vm = this
            Device.fetchDatabase().then(res => {
                res.data.devices.map(device => {
                    vm.devices.push(device._id)
                })
            })
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
        },
        methods: {
            editItem(item) {
                this.editedIndex = this.devices.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.$store.commit('setDialog', true)
            },
            deleteItem(item) {
                console.log(item.uid)
                Device.removeDevice(item.uid).then(res => {
                    console.log(res)
                    location.reload()
                })
            },
            cancelDialog() {
                return this.$store.commit('setDialog', false)
            },
            submitLocation(uid) {
                console.log(uid, this.editedItem.location)
                Device.updateDeviceLocation(uid, this.editedItem.location).then(res => {
                    console.log(res)
                    location.reload()
                })
            },
            addDevice() {
                var newDevice = {
                    uid: Math.random().toString(36).substr(2, 5),
                    values: {
                        "phi": 0,
                        "psi": 0,
                        "gyro_z": 0,
                        "gyro_x": 0,
                        "temp": 0,
                        "gyro_y": 0,
                        "theta": 0,
                        "acc_z": 0,
                        "acc_y": 0,
                        "acc_x": 0,
                        "humidity": 0
                    }
                }
    
                Device.updateDevice(newDevice).then(res => {
                    console.log(res)
                    location.reload()
                }).catch(err => {
                    console.error(err)
                })
            }
        }
    }
</script>