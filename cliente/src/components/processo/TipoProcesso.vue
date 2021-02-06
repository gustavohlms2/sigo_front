<template>
    <div>
        <div id="tipoprocesso" class="groove center lista" v-if="isConnect">
            <nav class="breadcrumb" aria-label="breadcrumbs">
                <ul>
                    <li class="is-active" ><a href="#">Buscar</a></li>
                    <li><a href="#" v-on:click="tipoprocessoAlterar = {}; isShowModalAlteracao = true;" >Novo</a></li>
                </ul>
            </nav>

            <div class="columns"> 
                <div class="column">  </div>
                <div class="column is-four-fifths">
                    <div class="field">
                        <input v-model="txtBusca" type="text" class="input is-primary" placeholder="Buscar pelo nome do tipo de processo" aria-label="Nome da tipoprocesso" aria-describedby="button-addon">
                    </div>
                </div>
                <div class="column">
                    <button class="button is-success" id="buscaBtn" @click="buscar"> Buscar</button>
                </div>
            </div>

            <div>
                <div class="tile center" style="margin: 10px;">
                    <p class="title" style=""> Tipo de Processo cadastrados </p>
                </div>
                <table class="table" style="width: 100%;">
                    <thead>
                        <tr>
                            <th style="width: 10%;"><abbr title="ID">Cód</abbr></th>
                            <th style="width: 60%;">Nome</th>                            
                            <th style="width: 20%;">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="tipoprocesso in filteredTipoprocessos" :key="tipoprocesso.id">
                            <td>{{tipoprocesso.id}}</td>
                            <td>{{tipoprocesso.nome}}</td>
                            <td>
                                <button class="button is-warning modal-button lista" v-on:click="alterarTipoprocesso(tipoprocesso); isShowModalAlteracao = true;">
                                    Alterar
                                </button>
                                <button class="button is-danger modal-button lista" v-on:click="idExclusao = tipoprocesso.id; isShowModalExclusao = true;">
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>   
            </div>

            <div class="modal" id="modalAlterar" v-bind:class="{ 'is-active': isShowModalAlteracao }" >
                <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">Tipo de processo</p>
                        <button class="delete" aria-label="close" v-on:click="isShowModalAlteracao = false"></button>
                    </header>
                    <section class="modal-card-body">
                        <div class="field is-horizontal">
                            <div class="field-label is-tipoprocessol">
                                <label class="label">Nome</label>
                            </div>
                            <div class="field-body">
                                <div class="field">
                                <p class="control">
                                    <input class="input is-primary" type="text" placeholder="Informe o nome" v-model="tipoprocessoAlterar.nome">
                                </p>
                                </div>
                            </div>
                        </div>

                    <!--    
                        <div class="field is-horizontal">
                            <div class="field-label is-tipoprocessol">
                                <label class="label">Data</label>
                            </div>
                            <div class="field-body">
                                <datetime datetime type="datetime" v-model="tipoprocessoAlterar.data_criacao"></datetime>
                            </div>
                        </div>    
                    -->

                    <p v-if="this.errors.length">
                        <b>Por favor, corrija o(s) seguinte(s) erro(s):</b>
                        <ul>
                        <li v-for="error in errors" :key="error.id" class="danger">
                            {{ error }}
                        </li>
                        </ul>
                    </p>
                    </section>
                        <footer class="modal-card-foot">                    
                        <button class="button" v-on:click="isShowModalAlteracao = false" >Descartar</button>
                        <button class="button is-success" v-on:click.stop.prevent="validaFormulario();" >Salvar Alterações</button>
                    </footer>
                </div>
            </div>

            <div class="modal" id="modalExcluir" v-bind:class="{ 'is-active': isShowModalExclusao }" >
                <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">Deseja realmente excluir?</p>
                        <button class="delete" aria-label="close" v-on:click="isShowModalExclusao = false"></button>
                    </header>
                    <section class="modal-card-body">
                        Atenção! Essa exclusão não poderá ser revertida.
                    </section>
                        <footer class="modal-card-foot">
                        <button class="button" v-on:click="isShowModalExclusao = false" >Descartar</button>
                        <button class="button is-success" @click="getExcluir"  v-on:click="isShowModalExclusao = false">Salvar Alterações</button>
                    </footer>
                </div>
            </div>
        </div>
        <div id="tipoprocesso" class="groove center lista" v-else>
            <h1> SEM CONEXÃO AO SEVIDOR </h1>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import urlAPI from '../../utilities/urlapi';
//import { Datetime } from 'vue-datetime';

export default {
    name: 'Tipoprocesso',  
    components: {
  //      datetime: Datetime
    },  
    created: function(){       
        this.getTipoprocesso();
    },
    data(){
        return {
            tipoprocessos: [],
            filteredTipoprocessos: [],
            tipoprocessoAlterar: {},
            listaRepositorio: [],
            txtBusca: '',
            idExclusao: '',
            isShowModalAlteracao: false,
            isShowModalExclusao: false,
            errors: [],
            isConnect: true
        }
    },
    filters: {
        upper: function(value){
            var newName = value[0].toUpperCase() + value.slice(1);
            return newName; 
        }
    },
    methods: {
        buscar: function(){
            this.filteredTipoprocessos = this.tipoprocessos;
            if (this.txtBusca != '' && this.txtBusca != ' '){        
                this.filteredTipoprocessos =  this.tipoprocessos.filter(tipoprocesso => tipoprocesso.nome.includes(this.txtBusca) );
            }      
        },
        alterar: function(){

        },       
        getTipoprocesso(){
            var vm = this;
            var url = urlAPI.TIPO_PROCESSO;
            axios.get(url).then(function(r){
                vm.tipoprocessos = r.data.filter(tipoprocesso => tipoprocesso.indativo ); 
                vm.filteredTipoprocessos = vm.tipoprocessos;
            }).catch(function (error) {
                vm.tipoprocessos = [];
                vm.filteredTipoprocessos = vm.tipoprocessos;
                vm.isConnect = false;
                vm.errors = ( ( error != undefined  ) ? {'Erro': error.response } : {} )
            });
        },
        getExcluir: function(){
            var vm = this;
            var url = urlAPI.TIPO_PROCESSO; // + this.idExclusao;

            var tipoprocessoAlterar = this.filteredTipoprocessos.filter(tipoprocesso => tipoprocesso.id == this.idExclusao )[0];
            axios.delete(url, {data:  tipoprocessoAlterar }).then(function(r){
                console.log(r);
                vm.tipoprocessos = vm.deleteVetor(vm.tipoprocessos);
                vm.filteredTipoprocessos = vm.tipoprocessos;
                vm.errors = [];
            }).catch(function (error) {
                    vm.errors = {'Erro': error.response };
                    vm.tipoprocessos = [];
                    
            });
        },
        deleteVetor(arr){
            var vm = this;
            arr = arr.filter(function(obj) {
                return obj.id !== vm.idExclusao;
            });
            return arr;
        },
        alterarTipoprocesso(f){
            this.tipoprocessoAlterar = JSON.parse(JSON.stringify(f));
        },
        salvarAlterar(){
            var vm = this;
            var url = urlAPI.TIPO_PROCESSO;
            var dateFormat = require('dateformat');
            if (this.tipoprocessoAlterar.id != '' && this.tipoprocessoAlterar.id != undefined ){
                this.tipoprocessoAlterar.dataAlteracao = dateFormat(new Date(), "yyyy-mm-dd hh:MM:ss");
                axios.put(url, this.tipoprocessoAlterar).then(function(){                    
                    vm.getTipoprocesso(); // buscar todas
                    vm.isShowModalAlteracao = false;
                    vm.errors = [];
                }).catch(function (error) {
                    vm.errors = {'Erro': error.response };
                }).finally(function () {
                    
                });
            }else{
                this.tipoprocessoAlterar.dataCriacao = dateFormat(new Date(), "yyyy-mm-dd hh:MM:ss");
                this.tipoprocessoAlterar.indativo = true;
                axios.post(url, this.tipoprocessoAlterar).then(function(){
                    vm.getTipoprocesso(); // buscar todas
                    vm.isShowModalAlteracao = false;
                    vm.errors = [];
                }).catch(function (error) {
                    vm.errors = {'Erro': error.response};
                }).finally(function () {
                    
                });
            }
        },
        descartarAlteracoesTipoprocesso(){
            this.tipoprocessoAlterar = {};
        },
        validaFormulario(){
            if (this.tipoprocessoAlterar.nome ) {                
                this.salvarAlterar();
            }

            this.errors = [];

            if (!this.tipoprocessoAlterar.nome) {
                this.errors.push('Informe o nome.');
            }

        }
    },
    computed: {
        resultadoBusca: function(){
            if (this.txtBusca == '' || this.txtBusca == ' '){
                return this.tipoprocessos;
            }else{
                return this.tipoprocessos.filter(tipoprocesso => tipoprocesso.nome.includes(this.txtBusca) );
            }
        }
    }
}
</script>

<style>
    .groove {border-style: groove;}
    .center { text-align: center; }
    .lista { margin: 3%; padding: 3%;}
    .danger { color: red; }
</style>