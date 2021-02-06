<template>
    <div>
        <div id="assessor" class="groove center lista" v-if="isConnect">
            <nav class="breadcrumb" aria-label="breadcrumbs">
                <ul>
                    <li class="is-active" ><a href="#">Buscar</a></li>
                    <li><a href="#" v-on:click="assessorAlterar = {}; isShowModalAlteracao = true;" >Novo</a></li>
                </ul>
            </nav>

            <div class="columns"> 
                <div class="column">  </div>
                <div class="column is-four-fifths">
                    <div class="field">
                        <input v-model="txtBusca" type="text" class="input is-primary" placeholder="Buscar pelo título da assessor" aria-label="Nome da assessor" aria-describedby="button-addon">
                    </div>
                </div>
                <div class="column">
                    <button class="button is-success" id="buscaBtn" @click="buscar"> Buscar</button>
                </div>
            </div>

            <div>
                <div class="tile center" style="margin: 10px;">
                    <p class="title" style=""> Assessores Cadastrados </p>
                </div>
                <table class="table" style="width: 100%;">
                    <thead>
                        <tr>
                            <th style="width: 10%;" class="is-hidden-mobile"><abbr title="ID">Cód</abbr></th>
                            <th style="width: 30%;">Nome</th>
                            <th style="width: 20%;">Descrição</th>
                            <th style="width: 20%;" class="is-hidden-mobile">Telefone</th>
                            <th style="width: 20%;">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="assessor in filteredAssessores" :key="assessor.id">
                            <td class="is-hidden-mobile">{{assessor.id}}</td>
                            <td>{{assessor.nome}}</td>
                            <td>{{assessor.descricao}}</td>
                            <td class="is-hidden-mobile">{{assessor.telefone}}</td>
                            <td>
                                <button class="button is-warning modal-button lista" v-on:click="alterarAssessor(assessor); isShowModalAlteracao = true;">
                                    Alterar
                                </button>
                                <button class="button is-danger modal-button lista" v-on:click="idExclusao = assessor.id; isShowModalExclusao = true;">
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
                        <p class="modal-card-title">Assessor</p>
                        <button class="delete" aria-label="close" v-on:click="isShowModalAlteracao = false"></button>
                    </header>
                    <section class="modal-card-body">
                        <div class="field is-horizontal">
                            <div class="field-label is-assessorl">
                                <label class="label">Nome</label>
                            </div>
                            <div class="field-body">
                                <div class="field">
                                <p class="control">
                                    <input class="input is-primary" type="text" placeholder="Informe o título" v-model="assessorAlterar.nome">
                                </p>
                                </div>
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-label is-assessorl">
                                <label class="label">Descrição</label>
                            </div>
                            <div class="field-body">
                                <div style="width: 100%;">
                                    <textarea class="textarea is-primary" placeholder="Descreva um resumo da assessor" v-model="assessorAlterar.descricao"></textarea>
                                </div>
                            </div>
                        </div>

                        <div class="field is-horizontal" v-if="!this.assessorAlterar.cnpj">
                            <div class="field-label is-assessorl">
                                <label class="label">CPF</label>
                            </div>
                            <div class="field-body">
                                <div class="field">
                                <p class="control">
                                    <input class="input is-primary" type="text" placeholder="Informe o CPF" v-model="assessorAlterar.cpf" length="11" v-on:blur="validaCpf()" v-on:keypress="isNumber($event)" >
                                </p>
                                </div>
                            </div>
                        </div>

                        <div class="field is-horizontal" v-if="!this.assessorAlterar.cpf">
                            <div class="field-label is-assessorl">
                                <label class="label">CNPJ</label>
                            </div>
                            <div class="field-body">
                                <div class="field">
                                <p class="control">
                                    <input class="input is-primary" type="text" placeholder="Informe o CNPJ" v-model="assessorAlterar.cnpj" v-on:blur="validaCnpj()" length="14" v-on:keypress="isNumber($event)" >
                                </p>
                                </div>
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-label is-assessorl">
                                <label class="label">Telefone</label>
                            </div>
                            <div class="field-body">
                                <div class="field">
                                <p class="control">
                                    <input class="input is-primary" type="text" placeholder="Informe o telefone" v-model="assessorAlterar.telefone" v-on:blur="validaTelefone()" minlength="8" maxlength="14" v-on:keypress="isNumber($event)" >
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
    name: 'Assessor',  
    components: {
  //      datetime: Datetime
    },  
    created: function(){     
        this.getAssessor();
    },
    data(){
        return {
            assessores: [],
            filteredAssessores: [],
            assessorAlterar: {},
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
            this.filteredAssessores = this.assessores;
            if (this.txtBusca != '' && this.txtBusca != ' '){        
                this.filteredAssessores =  this.assessores.filter(assessor => assessor.nome.includes(this.txtBusca) );
            }      
        },
        alterar: function(){
   
        },       
        getAssessor(){
            var vm = this;
            axios.get(urlAPI.ASSESSOR)
            .then(res => {
                vm.assessores = r.data.filter(assessor => assessor.indativo ); 
                vm.filteredAssessores = vm.assessores;
            }).catch(function (error) {
                vm.assessores = [];
                vm.filteredAssessores = vm.assessores;
                vm.isConnect = false;
                vm.errors = ( ( error != undefined  ) ? {'Erro': error.response } : {} )
            });
        },
        getExcluir: function(){
            var vm = this;
            var url = urlAPI.AssessoR ; // + this.idExclusao;
            var assessorAlterar = this.filteredAssessores.filter(assessor => assessor.id == this.idExclusao )[0];
            //axios.delete(url).then(function(r){
            axios.delete(url, { data:  assessorAlterar } ).then(function(r){
                console.log(r);
                vm.assessores = vm.deleteVetor(vm.assessores);
                vm.filteredAssessores = vm.assessores;
                vm.errors = [];
            }).catch(function (error) {
                    vm.errors = {'Erro': error.response };
                    vm.assessores = [];
                    
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
        alterarAssessor(f){
            this.assessorAlterar = JSON.parse(JSON.stringify(f));
        },
        salvarAlterar(){
            var vm = this;
            var url = urlAPI.AssessoR;
            var dateFormat = require('dateformat');
            if (this.assessorAlterar.id != '' && this.assessorAlterar.id != undefined ){
                //url = url ; + this.assessorAlterar.id;
                this.assessorAlterar.dataAlteracao = dateFormat(new Date(), "yyyy-mm-dd hh:MM:ss");
                axios.put(url, this.assessorAlterar ).then(function(){                    
                    vm.getAssessor(); // buscar todas
                    vm.isShowModalAlteracao = false;
                    vm.errors = [];
                }).catch(function (error) {
                    vm.errors = {'Erro': error.response };
                }).finally(function () {
                    
                });
            }else{
                this.assessorAlterar.dataCriacao = dateFormat(new Date(), "yyyy-mm-dd hh:MM:ss");
                this.assessorAlterar.indativo = true;
                axios.post(url, this.assessorAlterar).then(function(){
                    vm.getAssessor(); // buscar todas
                    vm.isShowModalAlteracao = false;
                    vm.errors = [];
                }).catch(function (error) {
                    vm.errors = {'Erro': error.response};
                }).finally(function () {
                    
                });
            }
        },
        descartarAlteracoesAssessor(){
            this.assessorAlterar = {};
        },
        validaFormulario(){
            if (this.assessorAlterar.nome && this.assessorAlterar.descricao && this.assessorAlterar.telefone &&  ( this.assessorAlterar.cpf || this.assessorAlterar.cnpj ) ) {                
                this.salvarAlterar();
                return true;
            }

            this.errors = [];

            if (!this.assessorAlterar.nome) {
                this.errors.push('Informe o nome.');
            }
            if (!this.assessorAlterar.descricao) {
                this.errors.push('Informe a descrição.');
            }
            if (!this.assessorAlterar.telefone) {
                this.errors.push('Informe o telefone.');
            }
            if ( ( this.assessorAlterar.cpf && this.assessorAlterar.cnpj )  ) {
                this.errors.push('Informe o cpf ou o cnpj.');
            }
            return false;
        },
        isNumber(e) {
            let char = String.fromCharCode(e.keyCode);
            if (/^[0-9]+$/.test(char)) return true;
            else e.preventDefault();
        },
        validaTelefone() {
            if( this.assessorAlterar.telefone && this.assessorAlterar.telefone.length < 8 && this.assessorAlterar.telefone.length > 17 ){
                this.assessorAlterar.telefone = '';
                alert( "Por favor, informe um telefone válido!" );
                return false;
            }  
            return true;
        },
        validaCnpj() {
            if( this.assessorAlterar.cnpj && this.assessorAlterar.cnpj.length != 14  ){
                this.assessorAlterar.cnpj = '';
                alert( "Por favor, informe um cnpj válido!" );
                return false;
            }  
            return true;
        },
        validaCpf() {
            if( this.assessorAlterar.cpf && this.assessorAlterar.cpf.length != 11  ){
                this.assessorAlterar.cpf = '';
                alert( "Por favor, informe um cpf válido!" );
                return false;
            }  
            return true;
        },
    },
    computed: {
        resultadoBusca: function(){
            if (this.txtBusca == '' || this.txtBusca == ' '){
                return this.assessores;
            }else{
                return this.assessores.filter(assessor => assessor.nome.includes(this.txtBusca) );
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