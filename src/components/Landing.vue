<template>
  <div>
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="https://bulma.io">
          <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28">
        </a>

        <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" class="navbar-menu">
        <div class="navbar-start">
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              Gestão
            </a>
            <div class="navbar-dropdown">
              <a class="navbar-item" @click="selecionaComp('G1')">
                Repositório
              </a>
              <a class="navbar-item" @click="selecionaComp('G2')">
                Norma
              </a>
            </div>
          </div>
          
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              Acessoria
            </a>

            <div class="navbar-dropdown">
              <a class="navbar-item" @click="selecionaComp('A1')">
                Acessor
              </a>
              <a class="navbar-item" @click="selecionaComp('A2')">
                Contrato
              </a>
            </div>
          </div>
          
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              Processo
            </a>

            <div class="navbar-dropdown">
              <a class="navbar-item" @click="selecionaComp('P1')">
                Operador
              </a>
              <a class="navbar-item" @click="selecionaComp('P2')">
                Processo
              </a>
              <a class="navbar-item" @click="selecionaComp('P3')" >
                Tipo de processo
              </a>            
            </div>
          </div>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <a class="button  is-small is-primary">
                <strong> Ana {{ name }} - {{ email }} ana@gmail.com </strong>
              </a>
              <button @click="logout" class="button is-small is-light"> Sair </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

      <Norma />
    <div v-if="this.opcaoComponente == 'G1'">
      <Norma />
    </div>
  </div>
</template>
<script>

import axios from 'axios';
import Norma from '../components/gestao/Norma';

export default {
  name: 'Landing',
  data() {
    return {
      name: '',
      email: '',
      opcaoComponente: ''
    }
  },
  components:{
    Norma
  },
  created() {
    //user is not authorized
    //if (localStorage.getItem('token') === null) {
    //  this.$router.push('/login');
    //}
  },
  mounted() {
    axios.get('http://localhost:5000/user', { headers: { token: localStorage.getItem('token')}})
      .then(res => {
        this.name = res.data.user.name;
        this.email = res.data.user.email;
      })
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push('/login');
    },
    selecionaComp: function(compEscolhido){
      this.opcaoComponente = compEscolhido;
    }
  }
}
</script>

<style>
    .groove {border-style: groove;}
    .center { text-align: center; }
    .right  { text-align: right;}
    .danger { color: red; }
</style>
