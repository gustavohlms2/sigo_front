<template>
  <div>
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" >
          <div style="font-size:30px;">
            <span class="icon-text has-text-success">
              <i class="fab fa-periscope" width="112" height="28"></i>  
              <strong>SIGO</strong>        
            </span>
          </div>
        </a>

        <a role="button" v-bind:class="classOpcoesMenu" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample" @click="showOpcao">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" v-bind:class="classOpcoesMenu" class="navbar-menu">
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
              Assessoria
            </a>

            <div class="navbar-dropdown">
              <a class="navbar-item" @click="selecionaComp('A1')">
                Assessor
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
                <strong> {{ name }} - {{ email }} </strong>
              </a>
              <button @click="logout" class="button is-small is-light" ref="btn_deslogar" id="btn_deslogar"> Sair </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div v-if="this.opcaoComponente == 'G1'">
      <Repositorio />
    </div>
    <div v-else-if="this.opcaoComponente == 'G2'">
      <Norma />
    </div>

    <div v-else-if="this.opcaoComponente == 'A1'">
      <Assessor />
    </div>
    <div v-else-if="this.opcaoComponente == 'A2'">
      <Contrato />
    </div>

    <div v-else-if="this.opcaoComponente == 'P1'">
      <Operador />
    </div>
    <div v-else-if="this.opcaoComponente == 'P2'">
      <Processo />
    </div>
    <div v-else-if="this.opcaoComponente == 'P3'">
      <TipoProcesso />
    </div>
  </div>
</template>
<script>

import axios from 'axios';
import Norma from '../components/gestao/Norma';
import Repositorio from '../components/gestao/Repositorio';
import Assessor from '../components/assessoria/Assessor';
import Contrato from '../components/assessoria/Contrato';
import Operador from '../components/processo/Operador';
import Processo from '../components/processo/Processo';
import TipoProcesso from '../components/processo/TipoProcesso';

export default {
  name: 'Landing',
  data() {
    return {
      name: '',
      email: '',
      opcaoComponente: '',
      counterInterval: '',
      classOpcoesMenu: ''
    }
  },
  components:{
    Norma,
    Repositorio,
    Assessor,
    Contrato,
    Operador,
    Processo,
    TipoProcesso
  },
  created() {
    //user is not authorized
    this.loginValid();
  },
  mounted() {
    axios.get('/api/acesso/user', { headers: { token: localStorage.getItem('token')}})
      .then(res => {
        this.name = res.data.user.name;
        this.email = res.data.user.email;
      });
  },
  beforeDestroy: function(){
    clearInterval( this.counterInterval )
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push('/login');
    },
    selecionaComp: function(compEscolhido){
      this.showOpcao();
      this.opcaoComponente = compEscolhido;
    },
    isMobile() {
        if( screen.width <= 760 ) {
            return true;
        }
        else {
            return false;
        }
    },
    showOpcao() {
      this.opcaoComponente = '';
      if( this.classOpcoesMenu ){
        this.classOpcoesMenu = '';
      }else{
        this.classOpcoesMenu = 'is-active';
      }
    },
    loginValid() {
      if ( this.loginIsValid() ) {
        this.logout();
      }
      this.counterInterval = setInterval(function(){ 
        if ( this.loginIsValid() ) {
          this.$refs.btn_deslogar.click();
        }
      }.bind(this), 300000);
    },
    loginIsValid(){
      return (localStorage.getItem('token') === null || ( new Date() > new Date(localStorage.getItem('expiresIn')) ) )
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
