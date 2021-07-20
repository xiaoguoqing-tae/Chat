<template>
    <div class="seach">
        <div class="search-box">
            <input :style="{'width':width+'px'}" v-model="searchkey" placeholder="搜索" id="debounce" />
        </div>
        <div class="add">＋</div>
    </div>
</template>

<script>
import apis from "../api/api";
import {debounce} from "../utils/myfunction"
export default {
    props:['width'],
    data() {
        return {
            searchkey:""
        };
    },
    created() {

    },
    mounted() {
        let inputb = document.getElementById('debounce')
        let debounceAjax = debounce(this.search, 500)
        inputb.addEventListener('keyup', function (e) {
            debounceAjax(e.target.value)
        })
    },
    methods: {
        search(){
            const data = {
                data:this.searchkey
            }
            apis.search(data).then(res=>{
                console.log(res)
                this.$emit("searchlist",{data:res.result,value:this.searchkey})
            })
        }
    }
};
</script>

<style scoped lang="scss">
.seach{
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 60px;
    background: #ffffff;
    .search-box{
        height: 10px;
        display: flex;
        align-items: center;
        input{
            height: 100%;
            border-radius: 5px;
            border: 1px solid #dfd9d9;
            background:#dfd9d9;
            padding: 10px;
            outline: none;
        }
        input:focus{
            background: #ffffff;
        }
    }
    .add{
        width: 30px;
        height: 30px;
        background: #c7c4c4;
        line-height: 30px;
        font-size: 30px;
        border-radius: 5px;
    }
}
</style>
