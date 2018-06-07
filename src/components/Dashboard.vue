<template>
    <v-app>
        <v-container text-xs-center grid-list-xl>
            <v-layout row wrap>
                <v-flex xs12 ms6 md4>
                    <v-card hover>
                        <v-container fluid>
                            <v-layout row>
                                <v-flex xs7>
                                    <div>
                                        <div class="headline">Device Active</div>
                                    </div>
                                </v-flex>
                                <v-flex xs5>
                                    <v-progress-circular :size="100" :width="15" :rotate="360" :value="50" color="teal">
                                        50
                                    </v-progress-circular>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card>
                </v-flex>
                <v-flex xs12 sm6 md4>
                    <v-card hover>
                        <v-container fluid>
                            <v-layout row>
                                <v-flex xs7>
                                    <div>
                                        <div class="headline">Humidity</div>
                                    </div>
                                </v-flex>
                                <v-flex xs5>
                                    <v-progress-circular :size="100" :width="15" :rotate="360" :value="30" color="teal">
                                        30
                                    </v-progress-circular>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card>
                </v-flex>
                <v-flex xs12 sm6 md4>
                    <v-card hover>
                        <v-container fluid>
                            <v-layout row>
                                <v-flex xs7>
                                    <div>
                                        <div class="headline">Temperature</div>
                                    </div>
                                </v-flex>
                                <v-flex xs5>
                                    <v-progress-circular :size="100" :width="15" :rotate="360" :value="30" color="teal">
                                        30
                                    </v-progress-circular>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card>
                </v-flex>
            </v-layout>
            <v-layout row wrap>
                <v-flex>
                    <v-card>
                        <v-card-text>
                            <p class="text-xs-center">Successfully</p>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" @click.native.prevent="logOut">Sign Out</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </v-app>
</template>

<script>
    export default {
        data() {
            return {
                value: 30,
                oldValue: 0
            }
        },
        computed: {
            user() {
                return this.$store.getters.user
            }
        },
        methods: {
            logOut() {
                var vm = this;
                this.$store.dispatch('signOut').then(() => {
                    // SignOut
                }).catch(err => {
                    console.error(err)
                })
            }
        },
        update() {
            if (this.user === null) {
                this.$router.push({
                    name: 'Authentication'
                })
                // alert('Require Authentication')
            }
        }
    }
</script>

<style scoped>

</style>



