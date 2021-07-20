<template>
    <div class="emoji">
        <div class="item" v-for="(item,index) in emoji" :key="index" @click="sendemoji(item)">
            {{item}}
        </div>
    </div>
</template>

<script>
import emoji from "../lib/emoji.js"
export default {
    data() {
        return {
            emoji:[]
        };
    },
    created() {
        this.emoji = emoji
    },
    mounted() {

    },
    methods: {
        sendemoji(msg){
            this.$emit("sendemoji",msg)
        }
    }
};
</script>

<style scoped lang="scss">
    .emoji{
        width: 550px;
        height: 260px;
        background:#ffffff;
        border: 1px solid #c5c3c3;
        position: absolute;
        bottom: 150px;
        left: -100px;
        display: flex;
        flex-wrap: wrap;
        .item{
            width: 32px;
            height: 32px;
            line-height: 32px;
            margin-top: 5px;
            margin-left: 2px;
        }
        .item:hover{
            background: #d4d4d4;
        }
    }
</style>
