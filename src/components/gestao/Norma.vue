<template>
    <div id="norma" class="groove center lista">
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
                        <th style="width: 10%;"><abbr title="ID">Cód</abbr></th>
                        <th style="width: 30%;">Título</th>
                        <th style="width: 20%;">Url</th>
                        <th style="width: 20%;">Repositório</th>
                        <th style="width: 20%;">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="norma in filteredNormas" :key="norma.id">
                        <td>{{norma.id}}</td>
                        <td>{{norma.titulo}}</td>
                        <td>{{norma.url}}</td>
                        <td>{{norma.idrepositorio}}</td>
                        <td>
                            <button class="button is-warning modal-button lista" v-on:click="alterarNorma(norma); isShowModalAlteracao = true;">
                                Alterar
                            </button>
                            <button class="button is-danger modal-button lista" v-on:click="idExclusao == norma.id; isShowModalExclusao = true;">
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
                            <label class="label">Título</label>
                        </div>
                        <div class="field-body">
                            <div class="field">
                            <p class="control">
                                <input class="input" type="text" placeholder="Informe o título" v-model="normaAlterar.titulo">
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
                                <textarea class="textarea is-primary" placeholder="Primary textarea" v-model="normaAlterar.descricao"></textarea>
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
                                <input class="input is-primary" type="text" placeholder="Informe a url" v-model="normaAlterar.url">
                            </p>
                            </div>
                        </div>
                    </div>
                    <div class="field is-horizontal">
                        <div class="field-label is-normal">
                            <label class="label">Repositório</label>
                        </div>
                        <div class="field-body">
                            <div style="width: 100%;">
                                <div class="select is-primary" style="width: 100%;">
                                <select v-model="normaAlterar.idrepositorio" style="width: 100%;">
                                    <option v-for="repositorio in listaRepositorio" :value="repositorio" :key="repositorio.id">
                                        {{ repositorio.nome }} 
                                    </option>
                                </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="field is-horizontal">
                        <div class="field-label is-normal">
                            <label class="label">Data</label>
                        </div>
                        <div class="field-body">
                            <datetime datetime type="datetime" v-model="normaAlterar.data_criacao"></datetime>
                        </div>
                    </div>    

                </section>
                    <footer class="modal-card-foot">                    
                    <button class="button" v-on:click="isShowModalAlteracao = false" >Descartar</button>
                    <button class="button is-success" @click="alterar"  v-on:click="isShowModalAlteracao = false">Salvar Alterações</button>
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
</template>

<script>
import axios from 'axios';
import { Datetime } from 'vue-datetime';

export default {
    name: 'Norma',  
    components: {
        datetime: Datetime
    },  
    created: function(){
        this.normas = [
            {'id': 1, 'url': 'www.google.com', 'titulo': 'Melhor buscador', 'idrepositorio': 'Web', 'descricao': 'buscador de conteudo', 'data_criacao': '2020-02-02 01:05:00' },
            {'id': 2, 'url': 'www.uol.com', 'titulo': 'Pior buscador', 'idrepositorio': 'Web', 'descricao': 'buscador de conteudo', 'data_criacao': '2020-02-03 01:05:00' }
        ];
        this.filteredNormas = this.normas;
        this.listaRepositorio = [{'id': '1', 'nome': 'Julia'}];
        /*axios.get(this.url).then(res => {
            this.pokemon.type = res.data.types[0].type.name;
            this.pokemon.front = res.data.sprites.front_default;
            this.pokemon.back  = res.data.sprites.back_default;
            this.pokemon.order = res.data.id;
            this.currentImg = this.pokemon.front;
        })*/
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
            erros: ''
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
            //var host = '';
            //var url = 'http://' + host + ':8089/api/cliente/buscarnome/';
            /* if(this.txtBusca!=''){
                axios.get(url).then(function(r){
                    vm.listaRepositorio =[];
                    vm.listaRepositorio = r.data.data;
                    vm.erros = [];
                }).catch(function (error) {
                    vm.erros = error.response.data.errors;
                    vm.listaRepositorio = [];
                    console.log(error.response.data.errors);
                }).finally(function () {
                    
                });
            }else{
                vm.listaRepositorio=[];
            }*/
            vm.listaRepositorio = [{'id': '1', 'nome': 'Julia'}];
        },
        getListar(){
            var vm = this;
            var host = '';
            var url = 'http://' + host + ':8089/api/cliente/buscarnome/';
            if(this.txtBusca!=''){
                axios.get(url).then(function(r){
                    vm.clientes =[];
                    vm.clientes = r.data.data;
                    vm.erros = [];
                }).catch(function (error) {
                    vm.erros = error.response.data.errors;
                    vm.clientes = [];
                    console.log(error.response.data.errors);
                }).finally(function () {
                    
                });
            }else{
                vm.clientes=[];
            }
        },
        getExcluir: function(idExclusao){
            var vm = this;
            var host = '';
            var url = 'http://' + host + ':8089/api/fornecedor/remover/' + idExclusao;
            axios.delete(url).then(function(r){
                console.log(r);
                vm.normas = vm.deleteVetor(vm.normas);
                vm.filteredNormas = this.normas;
                vm.erros = [];
            }).catch(function (error) {
                    vm.erros = error.response.data.errors;
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
            this.normaAlterar = f;
        },
        salvarAlterar(){
            var vm = this;
            var host = '';
            var url = 'http://' + host + ':8089/api/fornecedor/atualizar/' + this.normaAlterar.id;
            axios.put(url, this.normaAlterar).then(function(r){
                console.log(r);
                vm.erros = [];
            }).catch(function (error) {
                    vm.erros = error.response.data.errors;
                    vm.normas = []; // buscar todas
            }).finally(function () {
                
            });
        },
        descartarAlteracoesNorma(){
            this.normaAlterar = {};
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
</style>