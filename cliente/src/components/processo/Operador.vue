<template>
    <div>
        <div id="operador" class="groove center lista" v-if="isConnect">
            <nav class="breadcrumb" aria-label="breadcrumbs">
                <ul>
                    <li class="is-active" ><a href="#">Buscar</a></li>
                    <li><a href="#" v-on:click="operadorAlterar = {}; isShowModalAlteracao = true;" >Novo</a></li>
                </ul>
            </nav>

            <div class="columns"> 
                <div class="column">  </div>
                <div class="column is-four-fifths">
                    <div class="field">
                        <input v-model="txtBusca" type="text" class="input is-primary" placeholder="Buscar pelo título da operador" aria-label="Nome da operador" aria-describedby="button-addon">
                    </div>
                </div>
                <div class="column">
                    <button class="button is-success" id="buscaBtn" @click="buscar"> Buscar</button>
                </div>
            </div>

            <div>
                <div class="tile center" style="margin: 10px;">
                    <p class="title" style=""> Operadores Cadastrados </p>
                </div>
                <table class="table" style="width: 100%;">
                    <thead>
                        <tr>
                            <th style="width: 10%;" class="is-hidden-mobile"><abbr title="ID">Cód</abbr></th>
                            <th style="width: 25%;">Nome</th>
                            <th style="width: 25%;">Cargo</th>
                            <th style="width: 20%;" class="is-hidden-mobile">Telefone</th>
                            <th style="width: 20%;">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="operador in filteredOperadors" :key="operador.id">
                            <td class="is-hidden-mobile">{{operador.id}}</td>
                            <td>{{operador.nome}}</td>
                            <td>{{operador.cargo}}</td>
                            <td class="is-hidden-mobile">{{operador.telefone}}</td>
                            <td>
                                <button class="button is-warning modal-button lista" v-on:click="alterarOperador(operador); isShowModalAlteracao = true;">
                                    Alterar
                                </button>
                                <button class="button is-danger modal-button lista" v-on:click="idExclusao = operador.id; isShowModalExclusao = true;">
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
                        <p class="modal-card-title">Operador</p>
                        <button class="delete" aria-label="close" v-on:click="isShowModalAlteracao = false"></button>
                    </header>
                    <section class="modal-card-body">
                        <div class="field is-horizontal">
                            <div class="field-label is-operadorl">
                                <label class="label">Nome</label>
                            </div>
                            <div class="field-body">
                                <div class="field">
                                <p class="control">
                                    <input class="input is-primary" type="text" placeholder="Informe o nome" v-model="operadorAlterar.nome">
                                </p>
                                </div>
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-label is-operadorl">
                                <label class="label">Cargo</label>
                            </div>
                            <div class="field-body">
                                <div class="field">
                                <p class="control">
                                    <input class="input is-primary" type="text" placeholder="Informe o cargo" v-model="operadorAlterar.cargo">
                                </p>
                                </div>
                            </div>                            
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-label is-operadorl">
                                <label class="label">Email</label>
                            </div>
                            <div class="field-body">
                                <div class="field">
                                <p class="control">
                                    <input class="input is-primary" v-on:blur="validaEmail()" type="email" placeholder="Informe o email" v-model="operadorAlterar.email">
                                </p>
                                </div>
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-label is-operadorl">
                                <label class="label">Telefone</label>
                            </div>
                            <div class="field-body">
                                <div class="field">
                                <p class="control">
                                    <input class="input is-primary" type="text" placeholder="Informe o telefone" v-model="operadorAlterar.telefone" v-on:blur="validaTelefone()" minlength="8" maxlength="14" v-on:keypress="isNumber($event)" >
                                </p>
                                </div>
                            </div>
                        </div>
                        
                    <!--    
                        <div class="field is-horizontal">
                            <div class="field-label is-operadorl">
                                <label class="label">Data</label>
                            </div>
                            <div class="field-body">
                                <datetime datetime type="datetime" v-model="operadorAlterar.data_criacao"></datetime>
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
//import { Datetime } from 'vue-datetime';

export default {
    name: 'Operador',  
    components: {
  //      datetime: Datetime
    },  
    created: function(){       
        this.getOperador();        
    },
    data(){
        return {
            operadors: [],
            filteredOperadors: [],
            operadorAlterar: {},
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
            this.filteredOperadors = this.operadors;
            if (this.txtBusca != '' && this.txtBusca != ' '){        
                this.filteredOperadors =  this.operadors.filter(operador => operador.nome.includes(this.txtBusca) );
            }      
        },
        alterar: function(){

        },        
        getOperador(){
            var vm = this;
            var url = urlAPI.OPERADOR;
            axios.get(url).then(function(r){
                vm.operadors = r.data.filter(operador => operador.indativo ); 
                vm.filteredOperadors = vm.operadors;
            }).catch(function (error) {
                vm.operadors = [];
                vm.filteredOperadors = vm.operadors;
                vm.isConnect = false;
                vm.errors = ( ( error != undefined  ) ? {'Erro': error.response } : {} )
            });
        },
        getExcluir: function(){
            var vm = this;
            var url = urlAPI.OPERADOR;// + this.idExclusao;
            var operadorAlterar = this.filteredOperadors.filter(operador => operador.id == this.idExclusao )[0];
            //axios.delete(url).then(function(r){
            axios.delete(url, { data: operadorAlterar }).then(function(r){
                console.log(r);
                vm.operadors = vm.deleteVetor(vm.operadors);
                vm.filteredOperadors = vm.operadors;
                vm.errors = [];
            }).catch(function (error) {
                    vm.errors = {'Erro': error.response };
                    vm.operadors = [];
                    
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
        alterarOperador(f){
            this.operadorAlterar = JSON.parse(JSON.stringify(f));
        },
        salvarAlterar(){
            var vm = this;
            var url = urlAPI.OPERADOR;
            var dateFormat = require('dateformat');
            if (this.operadorAlterar.id != '' && this.operadorAlterar.id != undefined ){
                this.operadorAlterar.dataAlteracao = dateFormat(new Date(), "yyyy-mm-dd hh:MM:ss");
                axios.put(url, this.operadorAlterar).then(function(){                    
                    vm.getOperador(); // buscar todas
                    vm.isShowModalAlteracao = false;
                    vm.errors = [];
                }).catch(function (error) {
                    vm.errors = {'Erro': error.response };
                }).finally(function () {
                    
                });
            }else{
                this.operadorAlterar.dataCriacao = dateFormat(new Date(), "yyyy-mm-dd hh:MM:ss");
                this.operadorAlterar.indativo = true;
                axios.post(url, this.operadorAlterar).then(function(){
                    vm.getOperador(); // buscar todas
                    vm.isShowModalAlteracao = false;
                    vm.errors = [];
                }).catch(function (error) {
                    vm.errors = {'Erro': error.response};
                }).finally(function () {
                    
                });
            }
        },
        descartarAlteracoesOperador(){
            this.operadorAlterar = {};
        },
        validaFormulario(){
            if (this.operadorAlterar.nome && this.operadorAlterar.email && this.operadorAlterar.cargo && this.operadorAlterar.telefone) {                
                this.salvarAlterar();
            }

            this.errors = [];

            if (!this.operadorAlterar.nome) {
                this.errors.push('Informe o nome.');
            }
            if (!this.operadorAlterar.email) {
                this.errors.push('Informe o email.');
            }
            if (!this.operadorAlterar.cargo) {
                this.errors.push('Informe a cargo.');
            }
            if (!this.operadorAlterar.telefone) {
                this.errors.push('Informe o telefone.');
            }

        },
        isNumber(e) {
            let char = String.fromCharCode(e.keyCode);
            if (/^[0-9]+$/.test(char)) return true;
            else e.preventDefault();
        },
        validaEmail() {
            if( this.operadorAlterar.email==""  || this.operadorAlterar.email.indexOf('@')==-1  || this.operadorAlterar.email.indexOf('.')==-1 ){
                this.operadorAlterar.email = '';
                alert( "Por favor, informe um E-MAIL válido!" );
                return false;
            }
            return true
        },
        validaTelefone() {
            if( this.operadorAlterar.telefone.length < 8  ){
                this.operadorAlterar.telefone = '';
                alert( "Por favor, informe um telefone válido!" );
                return false;
            }  
            return true;
        }

    },
    computed: {
        resultadoBusca: function(){
            if (this.txtBusca == '' || this.txtBusca == ' '){
                return this.operadors;
            }else{
                return this.operadors.filter(operador => operador.nome.includes(this.txtBusca) );
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