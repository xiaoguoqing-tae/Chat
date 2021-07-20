<template>
    <div class="container">
        <sidebar></sidebar>
        <router-view></router-view>
    </div>
</template>

<script>
import sidebar from '../components/sidebar.vue'
export default {
    data() {
        return {

        };
    },
    components: {
        sidebar
    },
    created() {

    },
    mounted() {

    },
    methods: {

    }
};
</script>

<style scoped lang="scss">
.container{
    width: 1300px;
    height: 100vh;
    display: flex;
    background: #f8f5f5;
}
</style>
