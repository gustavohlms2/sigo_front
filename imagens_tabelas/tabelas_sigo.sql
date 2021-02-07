drop table if exists repositorio;
create table repositorio (
	id serial not null,
	nome varchar(200)  not null,
	descricao text  not null,
	url text  not null,
	versao varchar(50),
	data_criacao TIMESTAMP  not null,
	data_alteracao TIMESTAMP,
	indativo boolean default true not null,
    CONSTRAINT pk_repositorio PRIMARY KEY (id)
);

drop table if exists norma;
create table norma (
	id serial not null,
	idrepositorio int not null,
	titulo varchar(200)  not null,
	descricao text  not null,
	url text  not null,
	data_criacao TIMESTAMP  not null,
	data_alteracao TIMESTAMP,
	indativo boolean default true not null,
	CONSTRAINT pk_norma PRIMARY KEY (id),
	CONSTRAINT fk_norma_repositorio FOREIGN KEY (idrepositorio)
        REFERENCES public.repositorio (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION
);

drop table if exists acessor;
create table acessor (
	id serial not null,
	nome varchar(200)  not null,
	descricao text not null,
	cpf text  ,
	cnpj text ,
	telefone text,
	data_criacao TIMESTAMP  not null,
	data_alteracao TIMESTAMP,
	indativo boolean default true not null,
	CONSTRAINT pk_acessor PRIMARY KEY (id)
);

drop table if exists contrato;
create table contrato(
	id serial not null,
	idacessor int not null,
	nome varchar(200)  not null,
	empresa text not null,
	descricao text not null,
	url text  not null,
	valor FLOAT not null,
	data_criacao TIMESTAMP  not null,
	data_alteracao TIMESTAMP,
	indativo boolean default true not null,
	CONSTRAINT pk_contrato PRIMARY KEY (id),
	CONSTRAINT fk_contrato_acessor FOREIGN KEY (idacessor)
        REFERENCES public.acessor (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION
);

drop table if exists operador;
create table operador (
	id serial not null,
	nome varchar(200)  not null,
	email varchar(200)  not null,
	telefone varchar(14) not null,
	cargo text not null,
	data_criacao TIMESTAMP  not null,
	data_alteracao TIMESTAMP,
	indativo boolean default true not null,
	CONSTRAINT pk_operador PRIMARY KEY (id)
);

drop table if exists tipo_processo;
create table tipo_processo (
	id serial not null,
	nome varchar(200)  not null,
	data_criacao TIMESTAMP  not null,
	data_alteracao TIMESTAMP,
	indativo boolean default true not null,
	CONSTRAINT pk_tipo_processo PRIMARY KEY (id)
);

drop table if exists processo;
create table processo (
	id serial not null,
	nome varchar(200)  not null,
	descricao text not null,
	idoperador int not null,
	idtipo_processo int not null,
	prioridade int not null,
	status boolean default false not null,
	data_criacao TIMESTAMP  not null,
	data_alteracao TIMESTAMP,
	indativo boolean default true not null,
	CONSTRAINT pk_processo PRIMARY KEY (id),
	CONSTRAINT fk_processo_operador FOREIGN KEY (idoperador)
        REFERENCES public.operador (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
	CONSTRAINT fk_processo_tipo_processo FOREIGN KEY (idtipo_processo)
        REFERENCES public.tipo_processo (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION
);



