<template>
  <div class="columns is-mobile ">
    <div class="column is-half is-offset-one-quarter ">
      <div style="margin-top:20%;padding:10px;" class="groove">
        <div class="tile" style="margin: 10px;">
          <p class="title" style="">SIGO - IndTexBr ( Crie sua conta ) </p>
        </div>
        <div class="field">
          <div class="control">
            <input class="input is-primary is-rounded " type="text" v-model="nome" placeholder="Nome" >
          </div>
        </div>
        <div class="field">
          <div class="control">
            <p class="control has-icons-left">
              <input class="input is-primary is-rounded" type="text" v-model="email" placeholder="Email" >
              <span class="icon is-small is-left">
                <i class="fas fa-envelope"></i>
              </span>
            </p>
          </div>
        </div>
        <div class="field">
          <div class="control ">
            <p class="control has-icons-left">
              <input class="input is-primary is-rounded" type="password" v-model="password" placeholder="Password"> 
              <span class="icon is-small is-left">
                <i class="fas fa-lock"></i>
              </span>
            </p>
          </div>
        </div>
        <div class="field center">
          <div class="control" >
            <button @click="signup" class="button is-success is-large center" >Sign up</button>
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
  name: 'Signup',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      error: ''
    }
  },
  methods: {
    signup() {
      let newUser = {
        name: this.name,
        email: this.email,
        password: this.password
      }
      axios.post('http://localhost:5000/signup', newUser)
        .then(res => {
          console.log(res);
          this.error = '';
          this.$router.push('/login');
        }, err => {
          console.log(err.response)
          this.error = err.response.data.error
          this.$router.push('/login'); // comentar
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
