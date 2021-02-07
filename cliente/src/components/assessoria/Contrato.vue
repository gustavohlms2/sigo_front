<template>
    <div>
        <div id="contrato" class="groove center lista" v-if="isConnect">
            <nav class="breadcrumb" aria-label="breadcrumbs">
                <ul>
                    <li class="is-active" ><a href="#">Buscar</a></li>
                    <li><a href="#" v-on:click="contratoAlterar = {}; isShowModalAlteracao = true;" >Novo</a></li>
                </ul>
            </nav>

            <div class="columns"> 
                <div class="column">  </div>
                <div class="column is-four-fifths">
                    <div class="field">
                        <input v-model="txtBusca" type="text" class="input is-primary" placeholder="Buscar pelo nome da contrato" aria-label="Nome da contrato" aria-describedby="button-addon">
                    </div>
                </div>
                <div class="column">
                    <button class="button is-success" id="buscaBtn" @click="buscar"> Buscar</button>
                </div>
            </div>

            <div>
                <div class="tile center" style="margin: 10px;">
                    <p class="title" style=""> Contratos Cadastrados </p>
                </div>
                <table class="table" style="width: 100%;">
                    <thead>
                        <tr>
                            <th style="width: 10%;" class="is-hidden-mobile"><abbr title="ID">Cód</abbr></th>
                            <th style="width: 30%;">Nome</th>
                            <th style="width: 20%;">Empresa</th>
                            <th style="width: 20%;" class="is-hidden-mobile">Valor</th>
                            <th style="width: 20%;">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="contrato in filteredContratos" :key="contrato.id">
                            <td class="is-hidden-mobile">{{contrato.id}}</td>
                            <td>{{contrato.nome}}</td>
                            <td>{{contrato.empresa}}</td>
                            <td class="is-hidden-mobile">{{contrato.valor}}</td>
                            <td>
                                <button class="button is-warning modal-button lista" v-on:click="alterarContrato(contrato); isShowModalAlteracao = true;">
                                    Alterar
                                </button>
                                <button class="button is-danger modal-button lista" v-on:click="idExclusao = contrato.id; isShowModalExclusao = true;">
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
                        <p class="modal-card-title">Contrato</p>
                        <button class="delete" aria-label="close" v-on:click="isShowModalAlteracao = false"></button>
                    </header>
                    <section class="modal-card-body">

                        <div class="field is-horizontal">
                            <div class="field-label is-contratol">
                                <label class="label">Assessor</label>
                            </div>
                            <div class="field-body">
                                <div style="width: 100%;">
                                    <div class="select is-primary" style="width: 100%;">
                                    <select v-model="contratoAlterar.idAcessor" style="width: 100%;">
                                        <option v-for="assessor in listaAssessor" :value="assessor.id" :key="assessor.id">
                                            {{ descricaoAssessor(assessor) }} 
                                        </option>
                                    </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-label is-contratol">
                                <label class="label">Nome</label>
                            </div>
                            <div class="field-body">
                                <div class="field">
                                <p class="control">
                                    <input class="input is-primary" type="text" placeholder="Informe o nome" v-model="contratoAlterar.nome">
                                </p>
                                </div>
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-label is-contratol">
                                <label class="label">Empresa</label>
                            </div>
                            <div class="field-body">
                                <div class="field">
                                <p class="control">
                                    <input class="input is-primary" type="text" placeholder="Informe a empresa" v-model="contratoAlterar.empresa">
                                </p>
                                </div>
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-label is-contratol">
                                <label class="label">Descrição</label>
                            </div>
                            <div class="field-body">
                                <div style="width: 100%;">
                                    <textarea class="textarea is-primary" placeholder="Descreva um resumo da contrato" v-model="contratoAlterar.descricao"></textarea>
                                </div>
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-label is-contratol">
                                <label class="label">Valor</label>
                            </div>
                            <div class="field-body">
                                <div style="width: 100%;">
                                    <input class="input is-primary" type="number" placeholder="Informe o valor" v-model="contratoAlterar.valor">
                                </div>
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-label is-contratol">
                                <label class="label">URL</label>
                            </div>
                            <div class="field-body">
                                <div class="field">
                                <p class="control">
                                    <input class="input is-primary" type="text" placeholder="Informe a url" v-model="contratoAlterar.url" v-on:blur="isValidHttpUrl()">
                                </p>
                                </div>
                            </div>
                        </div>

                        
                    <!--    
                        <div class="field is-horizontal">
                            <div class="field-label is-contratol">
                                <label class="label">Data</label>
                            </div>
                            <div class="field-body">
                                <datetime datetime type="datetime" v-model="contratoAlterar.data_criacao"></datetime>
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

export default {
    name: 'Contrato',  
    components: {
  //      datetime: Datetime
    },  
    created: function(){       
        this.getContrato();
        this.getAssessor();        
    },
    data(){
        return {
            contratos: [],
            filteredContratos: [],
            contratoAlterar: {},
            listaAssessor: [],
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
            this.filteredContratos = this.contratos;
            if (this.txtBusca != '' && this.txtBusca != ' '){        
                this.filteredContratos =  this.contratos.filter(contrato => contrato.nome.includes(this.txtBusca) );
            }      
        },
        alterar: function(){

        },
        getAssessor(){
            var vm = this;
            var url = urlAPI.ASSESSOR;
            axios.get(url).then(function(r){
                vm.listaAssessor = r.data.filter(assessor => assessor.indativo );
                vm.errors = [];
            }).catch(function (error) {
                vm.listaAssessor = [];                    
                vm.errors = {'Erro': error.response };                
            }).finally(function () {
                
            });
        },
        getContrato(){
            var vm = this;
            var url = urlAPI.CONTRATO;
            axios.get(url).then(function(r){
                vm.contratos = r.data.filter(contrato => contrato.indativo ); 
                vm.filteredContratos = vm.contratos;
            }).catch(function (error) {
                vm.contratos = [];
                vm.filteredContratos = vm.contratos;
                vm.isConnect = false;
                vm.errors = ( ( error != undefined  ) ? {'Erro': error.response } : {} )
            });
        },
        getExcluir: function(){
            var vm = this;
            var url = urlAPI.CONTRATO ; // + this.idExclusao;

            var contratoAlterar = this.filteredContratos.filter(contrato => contrato.id == this.idExclusao )[0];
            //axios.delete(url).then(function(r){
            axios.delete(url, { data: contratoAlterar }).then(function(r){
                console.log(r);
                vm.contratos = vm.deleteVetor(vm.contratos);
                vm.filteredContratos = vm.contratos;
                vm.errors = [];
            }).catch(function (error) {
                    vm.errors = {'Erro': error.response };
                    vm.contratos = [];
                    
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
        alterarContrato(f){
            this.contratoAlterar = JSON.parse(JSON.stringify(f));
        },
        salvarAlterar(){
            var vm = this;
            var url = urlAPI.CONTRATO;
            var dateFormat = require('dateformat');
            if (this.contratoAlterar.id != '' && this.contratoAlterar.id != undefined ){
                this.contratoAlterar.dataAlteracao = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
                axios.put(url, this.contratoAlterar).then(function(){                    
                    vm.getContrato(); // buscar todas
                    vm.isShowModalAlteracao = false;
                    vm.errors = [];
                }).catch(function (error) {
                    vm.errors = {'Erro': error.response };
                }).finally(function () {
                    
                });
            }else{
                this.contratoAlterar.dataCriacao = dateFormat(new Date(), "yyyy-mm-dd hh:MM:ss");
                this.contratoAlterar.indativo = true;
                axios.post(url, this.contratoAlterar).then(function(){
                    vm.getContrato(); // buscar todas
                    vm.isShowModalAlteracao = false;
                    vm.errors = [];
                }).catch(function (error) {
                    vm.errors = {'Erro': error.response};
                }).finally(function () {
                    
                });
            }
        },
        descartarAlteracoesContrato(){
            this.contratoAlterar = {};
        },
        validaFormulario(){
            if (this.contratoAlterar.nome && this.contratoAlterar.empresa && this.contratoAlterar.descricao && this.contratoAlterar.url && this.contratoAlterar.valor && this.contratoAlterar.idAcessor ) {                
                this.salvarAlterar();
            }

            this.errors = [];

            if (!this.contratoAlterar.nome) {
                this.errors.push('Informe o nome.');
            }
            if (!this.contratoAlterar.empresa) {
                this.errors.push('Informe a empresa.');
            }
            if (!this.contratoAlterar.descricao) {
                this.errors.push('Informe a descricao.');
            }
            if (!this.contratoAlterar.url) {
                this.errors.push('Informe a url.');
            }
            if (!this.contratoAlterar.valor) {
                this.errors.push('Informe o valor.');
            }
            if (!this.contratoAlterar.idAcessor) {
                this.errors.push('Informe o assessor.');
            }

        },
        isValidHttpUrl() {
            var url = '';
            if (this.contratoAlterar.url){
                try {
                    url = new URL(this.contratoAlterar.url);
                } catch (_) {
                    alert( "Por favor, informe uma URL válida!" );
                    this.contratoAlterar.url = '';
                    return false;  
                }

                return url.protocol === "http:" || url.protocol === "https:";
            }else{
                return false;
            }
        },
        
        descricaoAssessor: function(AssessorA){
            return AssessorA.id + ' - ' + AssessorA.nome;
        },
    },
    computed: {
        resultadoBusca: function(){
            if (this.txtBusca == '' || this.txtBusca == ' '){
                return this.contratos;
            }else{
                return this.contratos.filter(contrato => contrato.nome.includes(this.txtBusca) );
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