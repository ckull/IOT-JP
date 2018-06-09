<template>
    <v-snackbar top multi-line v-model="error" v-if="error">
        {{ error.message }}
        <v-btn flat color="pink" @click.native="onClose">CLOSE</v-btn>
    </v-snackbar>
</template>

<script>
    export default {
        // props: ['text'],
        data() {
            return {
                snackbar: true
            }
        },
        computed: {
            error(){
                return this.$store.getters.error
            }
        },
        methods: {
            onClose() {
                this.$store.dispatch('clearError')
            }
        }
    }
</script>