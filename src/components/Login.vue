<template>
  <div class="columns is-mobile ">
    <div class="column is-half is-offset-one-quarter ">
      <div style="margin-top:20%;padding:10px;" class="groove">
        <div class="tile" style="margin: 10px;">
          <p class="title" style="">SIGO - IndTexBr </p>
        </div>
        <div class="field">
          <div class="control">
            <input class="input is-primary is-rounded" type="email" v-model="email" placeholder="Email" v-on:blur="validaEmail()" >
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
            localStorage.setItem('expiresIn', res.data.expiresIn);
            this.$router.push('/');
          }
        }, err => {
          console.log(err);
          this.error = err.response.data.error
          // this.$router.push('/'); // comentar
        })
    },
    validaEmail() {
      if( this.email==""  || this.email.indexOf('@')==-1  || this.email.indexOf('.')==-1 ){
        this.email = '';
        alert( "Por favor, informe um E-MAIL válido!" );
        return false;
      }
    }
  }
}
</script>


<style>
    .groove {border-style: groove;}
    .center { text-align: center; }
    .danger { color: red; }
</style>