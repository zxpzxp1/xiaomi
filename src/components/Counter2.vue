<template>
    <div>
        <button @click="increment">+</button>
        <button v-on:click="decrement">-</button>
        <p><span>{{num}}</span></p>
    </div>
</template>
<style>
</style>
<script>
    export default{
        data(){
            return{
                  num:0
            }
        },
        props:["num"],
        methods:{
          increment(){
             this.num++;
          },
          decrement(){
              this.num--;
          }
        }
    }
</script>
