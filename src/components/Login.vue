<template>
  <div class="columns is-mobile ">
    <div class="column is-half is-offset-one-quarter ">
      <div style="margin-top:20%;padding:10px;" class="groove">
        <div class="tile" style="margin: 10px;">
          <p class="title" style="">SIGO - IndTexBr </p>
        </div>
        <div class="field">
          <div class="control">
            <input class="input is-primary is-rounded" type="text" v-model="email" placeholder="Email" >
          </div>
        </div>
        <div class="field">
          <div class="control ">
            <input class="input is-primary is-rounded" type="password" v-model="password" placeholder="Password"> 
          </div>
        </div>
        <div class="field center">
          <div class="control" >
            <button @click="login" class="button is-success is-large center" >Sign in</button>
          </div>
        </div>
        <div class="center danger">
          {{ error }}
        </div>
      </div>      
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',

      error: '',
    }
  },
  methods: {
    login() {
      let user = {
        email: this.email,
        password: this.password
      }
      axios.post('http://localhost:5000/login', user)
        .then(res => {
          //if successfull
          if (res.status === 200) {
            localStorage.setItem('token', res.data.token);
            this.$router.push('/');
          }
        }, err => {
          console.log(err.response);
          this.error = err.response.data.error
          this.$router.push('/'); // comentar
        })
    }
  }
}
</script>


<style>
    .groove {border-style: groove;}
    .center { text-align: center; }
    .danger { color: red; }
</style>