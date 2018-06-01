<template>
    <v-snackbar top multi-line v-model="snackbar">
        {{ text }}
        <v-btn flat color="pink" @click.native="snackbar = false">CLOSE</v-btn>
    </v-snackbar>
</template>

<script>
    export default {
        props: ['text'],
        data() {
            return {
                snackbar: true
            }
        },
        methods: {
            onClose() {
                this.$emit('dismissed')
            }
        },
        watch: {
            snackbar(value) {
                this.onClose()
            }
        }
    }
</script>