<template>
    <div>
        <div id="processo" class="groove center lista" v-if="isConnect">

            <div class="notification is-danger is-light" v-if="hasNewProcesso">
                <button class="delete" v-on:click="hasNewProcesso = false;"></button>
                Novos alertas de processo. {{ msgNewProcesso }}
            </div>

            <nav class="breadcrumb" aria-label="breadcrumbs">
                <ul>
                    <li class="is-active" ><a href="#">Buscar</a></li>
                    <li><a href="#" v-on:click="processoAlterar = {}; isShowModalAlteracao = true;" >Novo</a></li>
                </ul>
            </nav>

            <div class="columns"> 
                <div class="column">  </div>
                <div class="column is-four-fifths">
                    <div class="field">
                        <input v-model="txtBusca" type="text" class="input is-primary" placeholder="Buscar pelo título da processo" aria-label="Nome da processo" aria-describedby="button-addon">
                    </div>
                </div>
                <div class="column">
                    <button class="button is-success" id="buscaBtn" @click="buscar"> Buscar</button>
                </div>
            </div>

            <div>
                <div class="tile center" style="margin: 10px;">
                    <p class="title" style=""> Processos Cadastrados </p>
                </div>
                <table class="table" style="width: 100%;">
                    <thead>
                        <tr>
                            <th style="width: 10%;" class="is-hidden-mobile"><abbr title="ID">Cód</abbr></th>
                            <th style="width: 30%;">Nome</th>
                            <th style="width: 20%;">Descrição</th>
                            <th style="width: 20%;" class="is-hidden-mobile">Prioridade</th>
                            <th style="width: 20%;">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="processo in filteredProcessos" :key="processo.id" :class="processo.status ? 'succ-back' : 'info-back' ">
                            <td class="is-hidden-mobile">{{processo.id}}</td>
                            <td>{{processo.nome}}</td>
                            <td>{{processo.descricao}}</td>
                            <td class="is-hidden-mobile">{{processo.prioridade}}</td>
                            <td>
                                <button class="button is-warning modal-button lista" v-on:click="alterarProcesso(processo); isShowModalAlteracao = true;">
                                    Alterar
                                </button>
                                <button class="button is-danger modal-button lista" v-on:click="idExclusao = processo.id; isShowModalExclusao = true;">
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
                        <p class="modal-card-title">Processo</p>
                        <button class="delete" aria-label="close" v-on:click="isShowModalAlteracao = false"></button>
                    </header>
                    <section class="modal-card-body">
                        <div class="field is-horizontal">
                            <div class="field-label is-processol">
                                <label class="label">Nome</label>
                            </div>
                            <div class="field-body">
                                <div class="field">
                                <p class="control">
                                    <input class="input is-primary" type="text" placeholder="Informe o nome" v-model="processoAlterar.nome">
                                </p>
                                </div>
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-label is-processol">
                                <label class="label">Descrição</label>
                            </div>
                            <div class="field-body">
                                <div style="width: 100%;">
                                    <textarea class="textarea is-primary" placeholder="Descreva um resumo do processo" v-model="processoAlterar.descricao"></textarea>
                                </div>
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-label is-processol">
                                <label class="label">Nível de Prioridade</label>
                            </div>
                            <div class="field-body">
                                <div class="field">
                                <p class="control">
                                    <input class="input is-primary" type="text" maxlength="1" placeholder="Informe a prioridade" v-on:keypress="isNumber($event)" v-model="processoAlterar.prioridade">
                                </p>
                                </div>
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-label is-processol">
                                <label class="label">Operador</label>
                            </div>
                            <div class="field-body">
                                <div style="width: 100%;">
                                    <div class="select is-primary" style="width: 100%;">
                                    <select v-model="processoAlterar.idoperador" style="width: 100%;">
                                        <option v-for="operador in listaOperador" :value="operador.id" :key="operador.id">
                                            {{ descricaoOperador(operador) }} 
                                        </option>
                                    </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-label is-processol">
                                <label class="label">Tipo processo</label>
                            </div>
                            <div class="field-body">
                                <div style="width: 100%;">
                                    <div class="select is-primary" style="width: 100%;">
                                    <select v-model="processoAlterar.idtipoprocesso" style="width: 100%;">
                                        <option v-for="tipo in listaTipoProcesso" :value="tipo.id" :key="tipo.id">
                                            {{ descricaoTipoProcesso(tipo) }} 
                                        </option>
                                    </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <label class="checkbox" style="margin-left:2%;">
                            <input type="checkbox" v-model="processoAlterar.status">
                                Processo concluido?
                            </label>
                        </div>

                    <!--    
                        <div class="field is-horizontal">
                            <div class="field-label is-processol">
                                <label class="label">Data</label>
                            </div>
                            <div class="field-body">
                                <datetime datetime type="datetime" v-model="processoAlterar.data_criacao"></datetime>
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
                        <button class="button" v-on:click="isShowModalExclusao = false;descartarAlteracoesProcesso" >Descartar</button>
                        <button class="button is-success" @click="getExcluir"  v-on:click="isShowModalExclusao = false">Salvar Alterações</button>
                    </footer>
                </div>
            </div>
        </div>
        <div id="processo" class="groove center lista" v-else>
            <h1> SEM CONEXÃO AO SEVIDOR </h1>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import urlAPI from '../../utilities/urlapi';
//import { Datetime } from 'vue-datetime';

export default {
    name: 'Processo',  
    components: {
  //      datetime: Datetime
    },  
    created: function(){       
        this.getProcesso();
        this.getOperador();
        this.getTipoProcesso();
        this.verificaFilaRabbit();
    },
    data(){
        return {
            processos: [],
            filteredProcessos: [],
            processoAlterar: {},
            listaOperador: [],
            listaTipoProcesso: [],
            txtBusca: '',
            idExclusao: '',
            isShowModalAlteracao: false,
            isShowModalExclusao: false,
            errors: [],
            isConnect: true,
            hasNewProcesso: false,
            msgNewProcesso: ''
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
            this.filteredProcessos = this.processos;
            if (this.txtBusca != '' && this.txtBusca != ' '){        
                this.filteredProcessos =  this.processos.filter(processo => processo.nome.includes(this.txtBusca) );
            }      
        },
        alterar: function(){

        },
        getOperador(){
            var vm = this;
            var url = urlAPI.OPERADOR;
            axios.get(url).then(function(r){
                vm.listaOperador = r.data.filter(operador => operador.indativo ); 
                vm.listaOperador[0]['composto'] = vm.listaOperador[0]['id'] + ' ' + vm.listaOperador[0]['nome'];
                vm.errors = [];
            }).catch(function (error) {
                vm.listaOperador = [];                    
                vm.errors = {'Erro': error.response };                  
            }).finally(function () {
                
            });
        },
        getTipoProcesso(){
            var vm = this;
            var url = urlAPI.TIPO_PROCESSO;
            axios.get(url).then(function(r){
                vm.listaTipoProcesso = r.data.filter(tipo => tipo.indativo ); 
                vm.errors = [];
            }).catch(function (error) {
                vm.listaTipoProcesso = [];                    
                vm.errors = {'Erro': error.response };                  
            }).finally(function () {
                
            });
        },
        getProcesso(){
            var vm = this;
            var url = urlAPI.PROCESSO;
            axios.get(url).then(function(r){
                vm.processos = r.data.filter(processo => processo.indativo ); 
                vm.filteredProcessos = vm.processos;
            }).catch(function (error) {
                vm.processos = [];
                vm.filteredProcessos = vm.processos;
                vm.isConnect = false;
                vm.errors = ( ( error != undefined  ) ? {'Erro': error.response } : {} )
            });
        },
        getExcluir: function(){
            var vm = this;
            var url = urlAPI.PROCESSO ; //+ this.idExclusao;
            var processoAlterar = this.filteredProcessos.filter(processo => processo.id == this.idExclusao )[0];
            
            //axios.delete(url).then(function(r){
            axios.delete(url, { data: processoAlterar }).then(function(r){
                console.log(r);
                vm.processos = vm.deleteVetor(vm.processos);
                vm.filteredProcessos = vm.processos;
                vm.errors = [];
            }).catch(function (error) {
                    vm.errors = {'Erro': error.response };
                    vm.processos = [];
                    
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
        alterarProcesso(f){
            this.processoAlterar = JSON.parse(JSON.stringify(f));
        },
        salvarAlterar(){
            var vm = this;
            var url = urlAPI.PROCESSO;
            var dateFormat = require('dateformat');
            this.processoAlterar.status = ( this.processoAlterar.status ? true : false )
            if (this.processoAlterar.id != '' && this.processoAlterar.id != undefined ){
                this.processoAlterar.dataAlteracao = dateFormat(new Date(), "yyyy-mm-dd hh:MM:ss");
                axios.put(url, this.processoAlterar).then(function(){                    
                    vm.getProcesso(); // buscar todas
                    vm.isShowModalAlteracao = false;
                    vm.errors = [];
                }).catch(function (error) {
                    vm.errors = {'Erro': error.response };
                }).finally(function () {
                    
                });
            }else{
                this.processoAlterar.dataCriacao = dateFormat(new Date(), "yyyy-mm-dd hh:MM:ss");
                this.processoAlterar.indativo = true;
                axios.post(url, this.processoAlterar).then(function(){
                    vm.getProcesso(); // buscar todas
                    vm.isShowModalAlteracao = false;
                    vm.errors = [];
                }).catch(function (error) {
                    vm.errors = {'Erro': error.response};
                }).finally(function () {
                    
                });
            }
        },
        descartarAlteracoesProcesso(){
            this.processoAlterar = {};            
        },
        validaFormulario(){
            if (this.processoAlterar.nome && this.processoAlterar.descricao 
                && this.processoAlterar.idoperador && this.processoAlterar.idtipoprocesso
                && this.processoAlterar.prioridade 
                ) {                
                this.salvarAlterar();
            }

            this.errors = [];

            if (!this.processoAlterar.nome) {
                this.errors.push('Informe o nome.');
            }
            if (!this.processoAlterar.descricao) {
                this.errors.push('Informe a descricao.');
            }
            if (!this.processoAlterar.idoperador) {
                this.errors.push('Informe a Operador.');
            }
            if (!this.processoAlterar.idtipoprocesso) {
                this.errors.push('Informe o Tipo de Processo.');
            }
            if (!this.processoAlterar.prioridade) {
                this.errors.push('Informe a prioridade.');
            }
          
        },
        verificaFilaRabbit() {
            axios.get('/api/acesso/rabbit_processo')
            .then(res => {
                this.hasNewProcesso = ( ( res.data.mostra == undefined ) ? false : res.data.mostra  ) ;
                this.msgNewProcesso = ( ( res.data.msg == undefined ) ? '' : res.data.msg  ) ;
            });
        },
        isNumber(e) {
            let char = String.fromCharCode(e.keyCode);
            if (/^[0-9]+$/.test(char)) return true;
            else e.preventDefault();
        },

        descricaoTipoProcesso: function(TipoProcessoA){
            return TipoProcessoA.id + ' - ' + TipoProcessoA.nome;
        },

        descricaoOperador: function(OperadorA){
            return OperadorA.id + ' - ' + OperadorA.nome;
        },
    },
    computed: {
        resultadoBusca: function(){
            if (this.txtBusca == '' || this.txtBusca == ' '){
                return this.processos;
            }else{
                return this.processos.filter(processo => processo.nome.includes(this.txtBusca) );
            }
        },

    }
}
</script>

<style>
    .groove {border-style: groove;}
    .center { text-align: center; }
    .lista { margin: 3%; padding: 3%;}
    .danger { color: red; }
    .info-back { background-color: #ffff80; }
    .succ-back { background-color: #bfff80; }
</style>