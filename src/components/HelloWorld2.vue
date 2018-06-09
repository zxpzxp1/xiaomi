<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <Counter num="10"></Counter>
    <p>partnet:{{num}}</p>
  </div>
</template>

<script>
import Counter from './Counter2.vue'
export default {
  name: 'HelloWorld2',
  data () {
    return {
      msg: 'Welcome to Your HelloWorld2 App',
      num: 20
    }
  },methods:{
       increment(){
          this.num++;
        },
        decrement(){
          this.num--;
        }
  },
  components:{Counter}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
