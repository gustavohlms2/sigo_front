<template>
    <div>
        <div id="acessor" class="groove center lista" v-if="isConnect">
            <nav class="breadcrumb" aria-label="breadcrumbs">
                <ul>
                    <li class="is-active" ><a href="#">Buscar</a></li>
                    <li><a href="#" v-on:click="acessorAlterar = {}; isShowModalAlteracao = true;" >Novo</a></li>
                </ul>
            </nav>

            <div class="columns"> 
                <div class="column">  </div>
                <div class="column is-four-fifths">
                    <div class="field">
                        <input v-model="txtBusca" type="text" class="input is-primary" placeholder="Buscar pelo título da acessor" aria-label="Nome da acessor" aria-describedby="button-addon">
                    </div>
                </div>
                <div class="column">
                    <button class="button is-success" id="buscaBtn" @click="buscar"> Buscar</button>
                </div>
            </div>

            <div>
                <div class="tile center" style="margin: 10px;">
                    <p class="title" style=""> Acessores Cadastrados </p>
                </div>
                <table class="table" style="width: 100%;">
                    <thead>
                        <tr>
                            <th style="width: 10%;"><abbr title="ID">Cód</abbr></th>
                            <th style="width: 30%;">Nome</th>
                            <th style="width: 20%;">Descrição</th>
                            <th style="width: 20%;" class="is-hidden-mobile">Telefone</th>
                            <th style="width: 20%;">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="acessor in filteredAcessores" :key="acessor.id">
                            <td>{{acessor.id}}</td>
                            <td>{{acessor.nome}}</td>
                            <td>{{acessor.descricao}}</td>
                            <td class="is-hidden-mobile">{{acessor.telefone}}</td>
                            <td>
                                <button class="button is-warning modal-button lista" v-on:click="alterarAcessor(acessor); isShowModalAlteracao = true;">
                                    Alterar
                                </button>
                                <button class="button is-danger modal-button lista" v-on:click="idExclusao = acessor.id; isShowModalExclusao = true;">
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
                        <p class="modal-card-title">Acessor</p>
                        <button class="delete" aria-label="close" v-on:click="isShowModalAlteracao = false"></button>
                    </header>
                    <section class="modal-card-body">
                        <div class="field is-horizontal">
                            <div class="field-label is-acessorl">
                                <label class="label">Nome</label>
                            </div>
                            <div class="field-body">
                                <div class="field">
                                <p class="control">
                                    <input class="input is-primary" type="text" placeholder="Informe o título" v-model="acessorAlterar.nome">
                                </p>
                                </div>
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-label is-acessorl">
                                <label class="label">Descriçao</label>
                            </div>
                            <div class="field-body">
                                <div style="width: 100%;">
                                    <textarea class="textarea is-primary" placeholder="Descreva um resumo da acessor" v-model="acessorAlterar.descricao"></textarea>
                                </div>
                            </div>
                        </div>

                        <div class="field is-horizontal" v-if="!this.acessorAlterar.cnpj">
                            <div class="field-label is-acessorl">
                                <label class="label">CPF</label>
                            </div>
                            <div class="field-body">
                                <div class="field">
                                <p class="control">
                                    <input class="input is-primary" type="number" placeholder="Informe o cpf" v-model="acessorAlterar.cpf">
                                </p>
                                </div>
                            </div>
                        </div>

                        <div class="field is-horizontal" v-if="!this.acessorAlterar.cpf">
                            <div class="field-label is-acessorl">
                                <label class="label">CNPJ</label>
                            </div>
                            <div class="field-body">
                                <div class="field">
                                <p class="control">
                                    <input class="input is-primary" type="number" placeholder="Informe o cnpj" v-model="acessorAlterar.cnpj">
                                </p>
                                </div>
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-label is-acessorl">
                                <label class="label">Telefone</label>
                            </div>
                            <div class="field-body">
                                <div class="field">
                                <p class="control">
                                    <input class="input is-primary" type="number" placeholder="Informe o telefone" v-model="acessorAlterar.telefone">
                                </p>
                                </div>
                            </div>
                        </div>
                  
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
    name: 'Acessor',  
    components: {
  //      datetime: Datetime
    },  
    created: function(){     
        this.getAcessor();
    },
    data(){
        return {
            acessores: [],
            filteredAcessores: [],
            acessorAlterar: {},
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
            this.filteredAcessores = this.acessores;
            if (this.txtBusca != '' && this.txtBusca != ' '){        
                this.filteredAcessores =  this.acessores.filter(acessor => acessor.nome.includes(this.txtBusca) );
            }      
        },
        alterar: function(){

        },       
        getAcessor(){
            var vm = this;
            axios.get(urlAPI.ACESSOR).then(function(r){
                vm.acessores = r.data.filter(acessor => acessor.indativo ); 
                vm.filteredAcessores = vm.acessores;
            }).catch(function (error) {
                vm.acessores = [];
                vm.filteredAcessores = vm.acessores;
                vm.isConnect = ( ( error != undefined  ) ? ( error.message == 'Network Error' ? false : true ) : true );
                vm.errors = ( ( error != undefined  ) ? {'Erro': error.response } : {} )
            });
        },
        getExcluir: function(){
            var vm = this;
            var url = urlAPI.ACESSOR + this.idExclusao;
            var dateFormat = require('dateformat');

            var acessorAlterar = this.filteredAcessores.filter(acessor => acessor.id == this.idExclusao )[0];
                acessorAlterar.dataAlteracao = dateFormat(new Date(), "yyyy-mm-dd hh:MM:ss");
                acessorAlterar.indativo = false;
            //axios.delete(url).then(function(r){
            axios.put(url, acessorAlterar).then(function(r){
                console.log(r);
                vm.acessores = vm.deleteVetor(vm.acessores);
                vm.filteredAcessores = vm.acessores;
                vm.errors = [];
            }).catch(function (error) {
                    vm.errors = {'Erro': error.response };
                    vm.acessores = [];
                    
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
        alterarAcessor(f){
            this.acessorAlterar = JSON.parse(JSON.stringify(f));
        },
        salvarAlterar(){
            var vm = this;
            var url = urlAPI.ACESSOR;
            var dateFormat = require('dateformat');
            if (this.acessorAlterar.id != '' && this.acessorAlterar.id != undefined ){
                url = url + this.acessorAlterar.id;
                this.acessorAlterar.dataAlteracao = dateFormat(new Date(), "yyyy-mm-dd hh:MM:ss");
                axios.put(url, this.acessorAlterar).then(function(){                    
                    vm.getAcessor(); // buscar todas
                    vm.isShowModalAlteracao = false;
                    vm.errors = [];
                }).catch(function (error) {
                    vm.errors = {'Erro': error.response };
                }).finally(function () {
                    
                });
            }else{
                this.acessorAlterar.dataCriacao = dateFormat(new Date(), "yyyy-mm-dd hh:MM:ss");
                this.acessorAlterar.indativo = true;
                axios.post(url, this.acessorAlterar).then(function(){
                    vm.getAcessor(); // buscar todas
                    vm.isShowModalAlteracao = false;
                    vm.errors = [];
                }).catch(function (error) {
                    vm.errors = {'Erro': error.response};
                }).finally(function () {
                    
                });
            }
        },
        descartarAlteracoesAcessor(){
            this.acessorAlterar = {};
        },
        validaFormulario(){
            if (this.acessorAlterar.nome && this.acessorAlterar.descricao && this.acessorAlterar.telefone &&  ( this.acessorAlterar.cpf || this.acessorAlterar.cnpj ) ) {                
                this.salvarAlterar();
            }

            this.errors = [];

            if (!this.acessorAlterar.nome) {
                this.errors.push('Informe o nome.');
            }
            if (!this.acessorAlterar.descricao) {
                this.errors.push('Informe a descricao.');
            }
            if (!this.acessorAlterar.descricao) {
                this.errors.push('Informe a url.');
            }
            if ( ( this.acessorAlterar.cpf || this.acessorAlterar.cnpj )  ) {
                this.errors.push('Informe o cpf ou o cnpj.');
            }

        }
    },
    computed: {
        resultadoBusca: function(){
            if (this.txtBusca == '' || this.txtBusca == ' '){
                return this.acessores;
            }else{
                return this.acessores.filter(acessor => acessor.nome.includes(this.txtBusca) );
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