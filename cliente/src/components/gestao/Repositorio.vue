<template>
    <div>
        <div id="repositorio" class="groove center lista" v-if="isConnect">

            <div class="notification is-danger is-light" v-if="hasNewNorma">
                <button class="delete" v-on:click="hasNewNorma = false;"></button>
                Novas normas foram adicionadas ao repositório principal.
            </div>

            <nav class="breadcrumb" aria-label="breadcrumbs">
                <ul>
                    <li class="is-active" ><a href="#">Buscar</a></li>
                    <li><a href="#" v-on:click="repositorioAlterar = {}; isShowModalAlteracao = true;" >Novo</a></li>
                </ul>
            </nav>

            <div class="columns"> 
                <div class="column">  </div>
                <div class="column is-four-fifths">
                    <div class="field">
                        <input v-model="txtBusca" type="text" class="input is-primary" placeholder="Buscar pelo nome da repositório" aria-label="Nome da repositório" aria-describedby="button-addon">
                    </div>
                </div>
                <div class="column">
                    <button class="button is-success" id="buscaBtn" @click="buscar"> Buscar</button>
                </div>
            </div>

            <div>
                <div class="tile center" style="margin: 10px;">
                    <p class="title" style=""> Repositórios Cadastrados </p>
                </div>
                <table class="table" style="width: 100%;">
                    <thead>
                        <tr>
                            <th style="width: 5%;"><abbr title="ID">Cód</abbr></th>
                            <th style="width: 30%;">Nome</th>
                            <th style="width: 20%;" class="is-hidden-mobile">Repositório</th>
                            <th style="width: 20%;" class="is-hidden-mobile">Url</th>
                            <th style="width: 25%;">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="repositorio in filteredRepositorios" :key="repositorio.id">
                            <td>{{repositorio.id}}</td>
                            <td>{{repositorio.nome}}</td>
                            <td class="is-hidden-mobile">{{repositorio.descricao}}</td>
                            <td class="is-hidden-mobile">{{repositorio.url}}</td>
                            <td>
                                <button class="button is-warning modal-button lista" v-on:click="alterarRepositorio(repositorio); isShowModalAlteracao = true;">
                                    Alterar
                                </button>
                                <button class="button is-danger modal-button lista" v-on:click="idExclusao = repositorio.id; isShowModalExclusao = true;">
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
                        <p class="modal-card-title">Repositório</p>
                        <button class="delete" aria-label="close" v-on:click="isShowModalAlteracao = false"></button>
                    </header>
                    <section class="modal-card-body">
                        <div class="field is-horizontal">
                            <div class="field-label is-repositoriol">
                                <label class="label">Nome</label>
                            </div>
                            <div class="field-body">
                                <div class="field">
                                <p class="control">
                                    <input class="input is-primary" type="text" placeholder="Informe o nome" v-model="repositorioAlterar.nome">
                                </p>
                                </div>
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-label is-repositoriol">
                                <label class="label">Descrição</label>
                            </div>
                            <div class="field-body">
                                <div style="width: 100%;">
                                    <textarea class="textarea is-primary" placeholder="Descreva um resumo da repositorio" v-model="repositorioAlterar.descricao"></textarea>
                                </div>
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-label is-repositoriol">
                                <label class="label">URL</label>
                            </div>
                            <div class="field-body">
                                <div class="field">
                                <p class="control">
                                    <input class="input is-primary" type="text" placeholder="Informe a url" v-model="repositorioAlterar.url" v-on:blur="isValidHttpUrl()">
                                </p>
                                </div>
                            </div>
                        </div>
                    
                    <!--    
                        <div class="field is-horizontal">
                            <div class="field-label is-repositoriol">
                                <label class="label">Data</label>
                            </div>
                            <div class="field-body">
                                <datetime datetime type="datetime" v-model="repositorioAlterar.data_criacao"></datetime>
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
        <div id="operador" class="groove center lista" v-else>
            <h1> SEM CONEXÃO AO SEVIDOR </h1>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import urlAPI from '../../utilities/urlapi';

export default {
    name: 'Repositorio',  
    components: {
  //      datetime: Datetime
    },  
    created: function(){       
        this.getRepositorio();
        this.verificaFilaRabbit();
    },
    data(){
        return {
            repositorios: [],
            filteredRepositorios: [],
            repositorioAlterar: {},
            txtBusca: '',
            idExclusao: '',
            isShowModalAlteracao: false,
            isShowModalExclusao: false,
            errors: [],
            isConnect: true,
            hasNewNorma: false
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
            this.filteredRepositorios = this.repositorios;
            if (this.txtBusca != '' && this.txtBusca != ' '){        
                this.filteredRepositorios =  this.repositorios.filter(repositorio => repositorio.nome.includes(this.txtBusca) );
            }      
        },
        alterar: function(){

        },
        getRepositorio(){
            var vm = this;
            var url = urlAPI.REPOSITORIO;
            axios.get(url).then(function(r){
                vm.repositorios = r.data.filter(repositorio => repositorio.indativo ); 
                vm.filteredRepositorios = vm.repositorios;
            }).catch(function (error) {
                vm.repositorios = [];
                vm.filteredRepositorios = vm.repositorios;
                vm.isConnect = false;
                vm.errors = ( ( error != undefined  ) ? {'Erro': error.response } : {} )
            });
        },
        getExcluir: function(){
            var vm = this;
            var url = urlAPI.REPOSITORIO; // + this.idExclusao;
            var repositorioAlterar = this.filteredRepositorios.filter(repositorio => repositorio.id == this.idExclusao )[0];
            //axios.delete(url).then(function(r){
            axios.delete(url, { data: repositorioAlterar }).then(function(r){
                console.log(r);
                vm.repositorios = vm.deleteVetor(vm.repositorios);
                vm.filteredRepositorios = vm.repositorios;
                vm.errors = [];
            }).catch(function (error) {
                    vm.errors = {'Erro': error.response };
                    vm.repositorios = [];
                    
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
        alterarRepositorio(f){
            this.repositorioAlterar = JSON.parse(JSON.stringify(f));
        },
        salvarAlterar(){
            var vm = this;
            var url = urlAPI.REPOSITORIO;
            var dateFormat = require('dateformat');
            if (this.repositorioAlterar.id != '' && this.repositorioAlterar.id != undefined ){
                //url = url + this.repositorioAlterar.id;
                this.repositorioAlterar.dataAlteracao = dateFormat(new Date(), "yyyy-mm-dd hh:MM:ss");
                axios.put(url, this.repositorioAlterar).then(function(){                    
                    vm.getRepositorio(); // buscar todas
                    vm.isShowModalAlteracao = false;
                    vm.errors = [];
                }).catch(function (error) {
                    vm.errors = {'Erro': error.response };
                }).finally(function () {
                    
                });
            }else{
                this.repositorioAlterar.dataCriacao = dateFormat(new Date(), "yyyy-mm-dd hh:MM:ss");
                this.repositorioAlterar.indativo = true;
                axios.post(url, this.repositorioAlterar).then(function(){
                    vm.getRepositorio(); // buscar todas
                    vm.isShowModalAlteracao = false;
                    vm.errors = [];
                }).catch(function (error) {
                    vm.errors = {'Erro': error.response};
                }).finally(function () {
                    
                });
            }
        },
        descartarAlteracoesRepositorio(){
            this.repositorioAlterar = {};
        },
        validaFormulario(){
            if (this.repositorioAlterar.nome && this.repositorioAlterar.descricao && this.repositorioAlterar.url ) {                
                this.salvarAlterar();
            }

            this.errors = [];

            if (!this.repositorioAlterar.nome) {
                this.errors.push('Informe o nome.');
            }
            if (!this.repositorioAlterar.descricao) {
                this.errors.push('Informe a descricao.');
            }
            if (!this.repositorioAlterar.url) {
                this.errors.push('Informe a url.');
            }

        },
        isValidHttpUrl() {
            var url = '';
            if (this.repositorioAlterar.url){
                try {
                    url = new URL(this.repositorioAlterar.url);
                } catch (_) {
                    alert( "Por favor, informe uma URL válida!" );
                    this.repositorioAlterar.url = '';
                    return false;  
                }

                return url.protocol === "http:" || url.protocol === "https:";
            }else{
                return false;
            }
        } ,
        verificaFilaRabbit() {
            axios.get('/api/acesso/rabbit_norma')
            .then(res => {
                this.hasNewNorma = res.data.mostra;
            });
        }
    },
    computed: {
        resultadoBusca: function(){
            if (this.txtBusca == '' || this.txtBusca == ' '){
                return this.repositorios;
            }else{
                return this.repositorios.filter(repositorio => repositorio.nome.includes(this.txtBusca) );
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