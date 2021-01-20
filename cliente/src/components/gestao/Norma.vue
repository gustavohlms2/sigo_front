<template>
    <div>
        <div id="norma" class="groove center lista" v-if="isConnect">
            <nav class="breadcrumb" aria-label="breadcrumbs">
                <ul>
                    <li class="is-active" ><a href="#">Buscar</a></li>
                    <li><a href="#" v-on:click="normaAlterar = {}; isShowModalAlteracao = true;" >Novo</a></li>
                </ul>
            </nav>

            <div class="columns"> 
                <div class="column">  </div>
                <div class="column is-four-fifths">
                    <div class="field">
                        <input v-model="txtBusca" type="text" class="input is-primary" placeholder="Buscar pelo título da norma" aria-label="Nome da norma" aria-describedby="button-addon">
                    </div>
                </div>
                <div class="column">
                    <button class="button is-success" id="buscaBtn" @click="buscar"> Buscar</button>
                </div>
            </div>

            <div>
                <div class="tile center" style="margin: 10px;">
                    <p class="title" style=""> Normas Cadastradas </p>
                </div>
                <table class="table" style="width: 100%;">
                    <thead>
                        <tr>
                            <th style="width: 5%;"><abbr title="ID">Cód</abbr></th>
                            <th style="width: 30%;">Título</th>
                            <th style="width: 20%;" class="is-hidden-mobile">Repositório</th>
                            <th style="width: 20%;">Url</th>
                            <th style="width: 25%;">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="norma in filteredNormas" :key="norma.id">
                            <td>{{norma.id}}</td>
                            <td>{{norma.titulo}}</td>
                            <td class="is-hidden-mobile">{{norma.idRepositorio}}</td>
                            <td>{{norma.url}}</td>
                            <td>
                                <button class="button is-warning modal-button lista" v-on:click="alterarNorma(norma); isShowModalAlteracao = true;">
                                    Alterar
                                </button>
                                <button class="button is-danger modal-button lista" v-on:click="idExclusao = norma.id; isShowModalExclusao = true;">
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
                        <p class="modal-card-title">Norma</p>
                        <button class="delete" aria-label="close" v-on:click="isShowModalAlteracao = false"></button>
                    </header>
                    <section class="modal-card-body">

                        <div class="field is-horizontal">
                            <div class="field-label is-normal">
                                <label class="label">Repositório</label>
                            </div>
                            <div class="field-body">
                                <div style="width: 100%;">
                                    <div class="select is-primary" style="width: 100%;">
                                    <select v-model="normaAlterar.idRepositorio" style="width: 100%;">
                                        <option v-for="repositorio in listaRepositorio" :value="repositorio.id" :key="repositorio.id">
                                            {{ repositorio.nome }} 
                                        </option>
                                    </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-label is-normal">
                                <label class="label">Título</label>
                            </div>
                            <div class="field-body">
                                <div class="field">
                                <p class="control">
                                    <input class="input is-primary" type="text" placeholder="Informe o título" v-model="normaAlterar.titulo">
                                </p>
                                </div>
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-label is-normal">
                                <label class="label">Descrição</label>
                            </div>
                            <div class="field-body">
                                <div style="width: 100%;">
                                    <textarea class="textarea is-primary" placeholder="Descreva um resumo da norma" v-model="normaAlterar.descricao"></textarea>
                                </div>
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-label is-normal">
                                <label class="label">URL</label>
                            </div>
                            <div class="field-body">
                                <div class="field">
                                <p class="control">
                                    <input class="input is-primary" type="text" placeholder="Informe a url" v-model="normaAlterar.url" v-on:blur="isValidHttpUrl()">
                                </p>
                                </div>
                            </div>
                        </div>
                        
                    <!--    
                        <div class="field is-horizontal">
                            <div class="field-label is-normal">
                                <label class="label">Data</label>
                            </div>
                            <div class="field-body">
                                <datetime datetime type="datetime" v-model="normaAlterar.data_criacao"></datetime>
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
        <div id="norma" class="groove center lista" v-else>
            <h1> SEM CONEXÃO AO SEVIDOR </h1>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import urlAPI from '../../utilities/urlapi';
//import { Datetime } from 'vue-datetime';

export default {
    name: 'Norma',  
    components: {
  //      datetime: Datetime
    },  
    created: function(){      
        this.getNorma();
        this.getRepositorio();
    },
    data(){
        return {
            normas: [],
            filteredNormas: [],
            normaAlterar: {},
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
            this.filteredNormas = this.normas;
            if (this.txtBusca != '' && this.txtBusca != ' '){        
                this.filteredNormas =  this.normas.filter(norma => norma.titulo.includes(this.txtBusca) );
            }      
        },
        alterar: function(){

        },
        getRepositorio(){
            var vm = this;
            axios.get(urlAPI.REPOSITORIO).then(function(r){
                vm.listaRepositorio = r.data.filter(repositorio => repositorio.indativo ); 
                vm.errors = [];
            }).catch(function (error) {
                vm.listaRepositorio = [];                    
                vm.errors = {'Erro': error.response };                  
            }).finally(function () {
                
            });
        },
        getNorma(){
            var vm = this;
            axios.get(urlAPI.NORMA).then(function(r){
                vm.normas = r.data.filter(norma => norma.indativo ); 
                vm.filteredNormas = vm.normas;
            }).catch(function (error) {
                vm.normas = [];
                vm.filteredNormas = vm.normas;
                vm.isConnect = ( ( error != undefined  ) ? ( error.message == 'Network Error' ? false : true ) : true );
                vm.errors = ( ( error != undefined  ) ? {'Erro': error.response } : {} )
            });
        },
        getExcluir: function(){
            var vm = this;
            var url = urlAPI.NORMA;// + this.idExclusao;
            var normaAlterar = this.filteredNormas.filter(norma => norma.id == this.idExclusao )[0];
            //axios.delete(url).then(function(r){
            axios.delete(url, { data: normaAlterar }).then(function(r){
                console.log(r);
                vm.normas = vm.deleteVetor(vm.normas);
                vm.filteredNormas = vm.normas;
                vm.errors = [];
            }).catch(function (error) {
                    vm.errors = {'Erro': error.response };
                    vm.normas = [];
                    
            }).finally(function () {
                
            });
        },
        deleteVetor(arr){
            var vm = this;
            arr = arr.filter(function(obj) {
                return obj.id !== vm.idExclusao;
            });
            return arr;
        },
        alterarNorma(f){
            this.normaAlterar = JSON.parse(JSON.stringify(f));
        },
        salvarAlterar(){
            var vm = this;
            var url = urlAPI.NORMA;
            var dateFormat = require('dateformat');
            if (this.normaAlterar.id != '' && this.normaAlterar.id != undefined ){
                this.normaAlterar.dataAlteracao = dateFormat(new Date(), "yyyy-mm-dd hh:MM:ss");
                axios.put(url, this.normaAlterar).then(function(){                    
                    vm.getNorma(); // buscar todas
                    vm.isShowModalAlteracao = false;
                    vm.errors = [];
                }).catch(function (error) {
                    vm.errors = {'Erro': error.response };
                }).finally(function () {
                    
                });
            }else{
                this.normaAlterar.dataCriacao = dateFormat(new Date(), "yyyy-mm-dd hh:MM:ss");
                this.normaAlterar.indativo = true;
                axios.post(url, this.normaAlterar).then(function(){
                    vm.getNorma(); // buscar todas
                    vm.isShowModalAlteracao = false;
                    vm.errors = [];
                }).catch(function (error) {
                    vm.errors = {'Erro': error.response};
                }).finally(function () {
                    
                });
            }
        },
        descartarAlteracoesNorma(){
            this.normaAlterar = {};
        },
        validaFormulario(){
            if (this.normaAlterar.titulo && this.normaAlterar.descricao && this.normaAlterar.url && this.normaAlterar.idRepositorio) {                
                this.salvarAlterar();
            }

            this.errors = [];

            if (!this.normaAlterar.titulo) {
                this.errors.push('Informe o titulo.');
            }
            if (!this.normaAlterar.descricao) {
                this.errors.push('Informe a descricao.');
            }
            if (!this.normaAlterar.url) {
                this.errors.push('Informe a url.');
            }
            if (!this.normaAlterar.idRepositorio) {
                this.errors.push('Informe o repositório.');
            }
        },
        isValidHttpUrl() {
            var url = '';
            if (this.normaAlterar.url){
                try {
                    url = new URL(this.normaAlterar.url);
                } catch (_) {
                    alert( "Por favor, informe uma URL válida!" );
                    this.normaAlterar.url = '';
                    return false;  
                }

                return url.protocol === "http:" || url.protocol === "https:";
            }else{
                return false;
            }
        }
    },
    computed: {
        resultadoBusca: function(){
            if (this.txtBusca == '' || this.txtBusca == ' '){
                return this.normas;
            }else{
                return this.normas.filter(norma => norma.titulo.includes(this.txtBusca) );
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