<template>
    <v-alert error @input="onClose" dismissible :value="true" transition="slide-y-reverse-transition">
        {{ text }}
    </v-alert>
</template>

<script>
    export default{
        props: ['text'],
        methods: {
            onClose() {
                this.$emit('dismissed')
            }
        }
    }
</script>