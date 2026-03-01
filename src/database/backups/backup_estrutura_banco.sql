--
-- PostgreSQL database dump
--

\restrict Q89YiQnDX8nmk1ABk54FCb1aeRcXAR03WI1bPUIXH99IB3Z6XFRQH9L1gQjqQJk

-- Dumped from database version 17.8 (6108b59)
-- Dumped by pg_dump version 17.7

-- Started on 2026-03-01 16:22:17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE IF EXISTS neondb;
--
-- TOC entry 3524 (class 1262 OID 16391)
-- Name: neondb; Type: DATABASE; Schema: -; Owner: neondb_owner
--

CREATE DATABASE neondb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = builtin LOCALE = 'C.UTF-8' BUILTIN_LOCALE = 'C.UTF-8';


ALTER DATABASE neondb OWNER TO neondb_owner;

\unrestrict Q89YiQnDX8nmk1ABk54FCb1aeRcXAR03WI1bPUIXH99IB3Z6XFRQH9L1gQjqQJk
\connect neondb
\restrict Q89YiQnDX8nmk1ABk54FCb1aeRcXAR03WI1bPUIXH99IB3Z6XFRQH9L1gQjqQJk

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 242 (class 1259 OID 24706)
-- Name: agenda_servicos; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.agenda_servicos (
    agend_serv_id integer NOT NULL,
    agend_id integer NOT NULL,
    serv_id integer NOT NULL,
    agend_serv_situ_id integer NOT NULL
);


ALTER TABLE public.agenda_servicos OWNER TO neondb_owner;

--
-- TOC entry 241 (class 1259 OID 24705)
-- Name: agenda_servicos_agend_serv_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.agenda_servicos_agend_serv_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.agenda_servicos_agend_serv_id_seq OWNER TO neondb_owner;

--
-- TOC entry 3526 (class 0 OID 0)
-- Dependencies: 241
-- Name: agenda_servicos_agend_serv_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.agenda_servicos_agend_serv_id_seq OWNED BY public.agenda_servicos.agend_serv_id;


--
-- TOC entry 236 (class 1259 OID 24667)
-- Name: agenda_servicos_situacao; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.agenda_servicos_situacao (
    agend_serv_situ_id integer NOT NULL,
    agend_serv_situ_nome character varying(50) NOT NULL
);


ALTER TABLE public.agenda_servicos_situacao OWNER TO neondb_owner;

--
-- TOC entry 235 (class 1259 OID 24666)
-- Name: agenda_servicos_situacao_agend_serv_situ_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.agenda_servicos_situacao_agend_serv_situ_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.agenda_servicos_situacao_agend_serv_situ_id_seq OWNER TO neondb_owner;

--
-- TOC entry 3527 (class 0 OID 0)
-- Dependencies: 235
-- Name: agenda_servicos_situacao_agend_serv_situ_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.agenda_servicos_situacao_agend_serv_situ_id_seq OWNED BY public.agenda_servicos_situacao.agend_serv_situ_id;


--
-- TOC entry 234 (class 1259 OID 24654)
-- Name: agendamentos; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.agendamentos (
    agend_id integer NOT NULL,
    veic_usu_id integer NOT NULL,
    agend_data date NOT NULL,
    agend_horario time without time zone NOT NULL,
    agend_situacao integer NOT NULL,
    agend_observ character varying(200) NOT NULL,
    serv_id integer,
    agend_serv_situ_id integer DEFAULT 1,
    tracking_token character varying(100)
);


ALTER TABLE public.agendamentos OWNER TO neondb_owner;

--
-- TOC entry 233 (class 1259 OID 24653)
-- Name: agendamentos_agend_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.agendamentos_agend_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.agendamentos_agend_id_seq OWNER TO neondb_owner;

--
-- TOC entry 3528 (class 0 OID 0)
-- Dependencies: 233
-- Name: agendamentos_agend_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.agendamentos_agend_id_seq OWNED BY public.agendamentos.agend_id;


--
-- TOC entry 220 (class 1259 OID 24577)
-- Name: categorias; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.categorias (
    cat_id integer NOT NULL,
    cat_nome character varying(50) NOT NULL,
    cat_icone character varying(128),
    tps_id integer
);


ALTER TABLE public.categorias OWNER TO neondb_owner;

--
-- TOC entry 219 (class 1259 OID 24576)
-- Name: categorias_cat_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.categorias_cat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categorias_cat_id_seq OWNER TO neondb_owner;

--
-- TOC entry 3529 (class 0 OID 0)
-- Dependencies: 219
-- Name: categorias_cat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.categorias_cat_id_seq OWNED BY public.categorias.cat_id;


--
-- TOC entry 238 (class 1259 OID 24686)
-- Name: categorias_servicos; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.categorias_servicos (
    cat_serv_id integer NOT NULL,
    cat_serv_nome character varying(60) NOT NULL,
    cat_serv_situacao boolean DEFAULT true
);


ALTER TABLE public.categorias_servicos OWNER TO neondb_owner;

--
-- TOC entry 237 (class 1259 OID 24685)
-- Name: categorias_servicos_cat_serv_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.categorias_servicos_cat_serv_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categorias_servicos_cat_serv_id_seq OWNER TO neondb_owner;

--
-- TOC entry 3530 (class 0 OID 0)
-- Dependencies: 237
-- Name: categorias_servicos_cat_serv_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.categorias_servicos_cat_serv_id_seq OWNED BY public.categorias_servicos.cat_serv_id;


--
-- TOC entry 222 (class 1259 OID 24584)
-- Name: disponibilidade; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.disponibilidade (
    disp_id integer NOT NULL,
    disp_dia character(3) NOT NULL,
    disp_periodo smallint NOT NULL,
    disp_hr_ini time without time zone NOT NULL,
    disp_hr_fin time without time zone NOT NULL,
    disp_situacao boolean DEFAULT true
);


ALTER TABLE public.disponibilidade OWNER TO neondb_owner;

--
-- TOC entry 221 (class 1259 OID 24583)
-- Name: disponibilidade_disp_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.disponibilidade_disp_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.disponibilidade_disp_id_seq OWNER TO neondb_owner;

--
-- TOC entry 3531 (class 0 OID 0)
-- Dependencies: 221
-- Name: disponibilidade_disp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.disponibilidade_disp_id_seq OWNED BY public.disponibilidade.disp_id;


--
-- TOC entry 224 (class 1259 OID 24592)
-- Name: indisponibilidade; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.indisponibilidade (
    indisp_id integer NOT NULL,
    indisp_data date NOT NULL,
    indisp_situacao boolean DEFAULT true
);


ALTER TABLE public.indisponibilidade OWNER TO neondb_owner;

--
-- TOC entry 223 (class 1259 OID 24591)
-- Name: indisponibilidade_indisp_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.indisponibilidade_indisp_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.indisponibilidade_indisp_id_seq OWNER TO neondb_owner;

--
-- TOC entry 3532 (class 0 OID 0)
-- Dependencies: 223
-- Name: indisponibilidade_indisp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.indisponibilidade_indisp_id_seq OWNED BY public.indisponibilidade.indisp_id;


--
-- TOC entry 226 (class 1259 OID 24600)
-- Name: marcas; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.marcas (
    mar_id integer NOT NULL,
    mar_nome character varying(50) NOT NULL,
    mar_cod integer NOT NULL,
    mar_icone character varying(128),
    cat_id integer
);


ALTER TABLE public.marcas OWNER TO neondb_owner;

--
-- TOC entry 225 (class 1259 OID 24599)
-- Name: marcas_mar_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.marcas_mar_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.marcas_mar_id_seq OWNER TO neondb_owner;

--
-- TOC entry 3533 (class 0 OID 0)
-- Dependencies: 225
-- Name: marcas_mar_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.marcas_mar_id_seq OWNED BY public.marcas.mar_id;


--
-- TOC entry 228 (class 1259 OID 24612)
-- Name: modelos; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.modelos (
    mod_id integer NOT NULL,
    mod_nome character varying(60) NOT NULL,
    mod_cod integer NOT NULL,
    mar_cod integer NOT NULL,
    mar_id integer
);


ALTER TABLE public.modelos OWNER TO neondb_owner;

--
-- TOC entry 227 (class 1259 OID 24611)
-- Name: modelos_mod_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.modelos_mod_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.modelos_mod_id_seq OWNER TO neondb_owner;

--
-- TOC entry 3534 (class 0 OID 0)
-- Dependencies: 227
-- Name: modelos_mod_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.modelos_mod_id_seq OWNED BY public.modelos.mod_id;


--
-- TOC entry 248 (class 1259 OID 106506)
-- Name: permissoes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.permissoes (
    per_id integer NOT NULL,
    per_chave character varying(100) NOT NULL,
    per_descricao character varying(255)
);


ALTER TABLE public.permissoes OWNER TO neondb_owner;

--
-- TOC entry 247 (class 1259 OID 106505)
-- Name: permissoes_per_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.permissoes_per_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permissoes_per_id_seq OWNER TO neondb_owner;

--
-- TOC entry 3535 (class 0 OID 0)
-- Dependencies: 247
-- Name: permissoes_per_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.permissoes_per_id_seq OWNED BY public.permissoes.per_id;


--
-- TOC entry 240 (class 1259 OID 24693)
-- Name: servicos; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.servicos (
    serv_id integer NOT NULL,
    cat_serv_id integer,
    serv_nome character varying(60) NOT NULL,
    serv_descricao character varying(200) NOT NULL,
    serv_situacao boolean DEFAULT true
);


ALTER TABLE public.servicos OWNER TO neondb_owner;

--
-- TOC entry 239 (class 1259 OID 24692)
-- Name: servicos_serv_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.servicos_serv_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.servicos_serv_id_seq OWNER TO neondb_owner;

--
-- TOC entry 3536 (class 0 OID 0)
-- Dependencies: 239
-- Name: servicos_serv_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.servicos_serv_id_seq OWNED BY public.servicos.serv_id;


--
-- TOC entry 246 (class 1259 OID 73737)
-- Name: servicos_tipo_veiculo; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.servicos_tipo_veiculo (
    stv_id integer NOT NULL,
    serv_id integer NOT NULL,
    tps_id integer NOT NULL,
    stv_preco numeric(7,2) NOT NULL,
    stv_duracao time without time zone,
    stv_situacao boolean DEFAULT true
);


ALTER TABLE public.servicos_tipo_veiculo OWNER TO neondb_owner;

--
-- TOC entry 245 (class 1259 OID 73736)
-- Name: servicos_tipo_veiculo_stv_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.servicos_tipo_veiculo_stv_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.servicos_tipo_veiculo_stv_id_seq OWNER TO neondb_owner;

--
-- TOC entry 3537 (class 0 OID 0)
-- Dependencies: 245
-- Name: servicos_tipo_veiculo_stv_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.servicos_tipo_veiculo_stv_id_seq OWNED BY public.servicos_tipo_veiculo.stv_id;


--
-- TOC entry 244 (class 1259 OID 73729)
-- Name: tipo_veiculo_servico; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.tipo_veiculo_servico (
    tps_id integer NOT NULL,
    tps_nome character varying(30) NOT NULL,
    tps_situacao boolean DEFAULT true
);


ALTER TABLE public.tipo_veiculo_servico OWNER TO neondb_owner;

--
-- TOC entry 243 (class 1259 OID 73728)
-- Name: tipo_veiculo_servico_tps_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.tipo_veiculo_servico_tps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipo_veiculo_servico_tps_id_seq OWNER TO neondb_owner;

--
-- TOC entry 3538 (class 0 OID 0)
-- Dependencies: 243
-- Name: tipo_veiculo_servico_tps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.tipo_veiculo_servico_tps_id_seq OWNED BY public.tipo_veiculo_servico.tps_id;


--
-- TOC entry 250 (class 1259 OID 114703)
-- Name: usuario_permissoes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.usuario_permissoes (
    usu_per_id integer NOT NULL,
    usu_id integer NOT NULL,
    per_id integer NOT NULL
);


ALTER TABLE public.usuario_permissoes OWNER TO neondb_owner;

--
-- TOC entry 249 (class 1259 OID 114702)
-- Name: usuario_permissoes_usu_per_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.usuario_permissoes ALTER COLUMN usu_per_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.usuario_permissoes_usu_per_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 218 (class 1259 OID 16488)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.usuarios (
    usu_id integer NOT NULL,
    usu_nome character varying(60) NOT NULL,
    usu_cpf character(14) NOT NULL,
    usu_data_nasc date NOT NULL,
    usu_sexo smallint NOT NULL,
    usu_telefone character varying(20) NOT NULL,
    usu_email character varying(80) NOT NULL,
    usu_observ character varying(120),
    usu_acesso boolean NOT NULL,
    usu_senha character varying(256) NOT NULL,
    usu_situacao boolean DEFAULT true,
    usu_token_reset text,
    usu_expiracao_token timestamp with time zone
);


ALTER TABLE public.usuarios OWNER TO neondb_owner;

--
-- TOC entry 217 (class 1259 OID 16487)
-- Name: usuarios_usu_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.usuarios_usu_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_usu_id_seq OWNER TO neondb_owner;

--
-- TOC entry 3539 (class 0 OID 0)
-- Dependencies: 217
-- Name: usuarios_usu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.usuarios_usu_id_seq OWNED BY public.usuarios.usu_id;


--
-- TOC entry 232 (class 1259 OID 24637)
-- Name: veiculo_usuario; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.veiculo_usuario (
    veic_usu_id integer NOT NULL,
    veic_id integer NOT NULL,
    usu_id integer NOT NULL,
    ehproprietario boolean NOT NULL,
    data_inicial date NOT NULL,
    data_final date
);


ALTER TABLE public.veiculo_usuario OWNER TO neondb_owner;

--
-- TOC entry 231 (class 1259 OID 24636)
-- Name: veiculo_usuario_veic_usu_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.veiculo_usuario_veic_usu_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.veiculo_usuario_veic_usu_id_seq OWNER TO neondb_owner;

--
-- TOC entry 3540 (class 0 OID 0)
-- Dependencies: 231
-- Name: veiculo_usuario_veic_usu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.veiculo_usuario_veic_usu_id_seq OWNED BY public.veiculo_usuario.veic_usu_id;


--
-- TOC entry 230 (class 1259 OID 24624)
-- Name: veiculos; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.veiculos (
    veic_id integer NOT NULL,
    mod_id integer NOT NULL,
    veic_placa character varying(10) NOT NULL,
    veic_ano character varying(4) NOT NULL,
    veic_cor character varying(15) NOT NULL,
    veic_combustivel character varying(20) NOT NULL,
    veic_observ character varying(200) NOT NULL,
    veic_situacao boolean DEFAULT true
);


ALTER TABLE public.veiculos OWNER TO neondb_owner;

--
-- TOC entry 229 (class 1259 OID 24623)
-- Name: veiculos_veic_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.veiculos_veic_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.veiculos_veic_id_seq OWNER TO neondb_owner;

--
-- TOC entry 3541 (class 0 OID 0)
-- Dependencies: 229
-- Name: veiculos_veic_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.veiculos_veic_id_seq OWNED BY public.veiculos.veic_id;


--
-- TOC entry 3309 (class 2604 OID 24709)
-- Name: agenda_servicos agend_serv_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.agenda_servicos ALTER COLUMN agend_serv_id SET DEFAULT nextval('public.agenda_servicos_agend_serv_id_seq'::regclass);


--
-- TOC entry 3304 (class 2604 OID 24670)
-- Name: agenda_servicos_situacao agend_serv_situ_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.agenda_servicos_situacao ALTER COLUMN agend_serv_situ_id SET DEFAULT nextval('public.agenda_servicos_situacao_agend_serv_situ_id_seq'::regclass);


--
-- TOC entry 3302 (class 2604 OID 24657)
-- Name: agendamentos agend_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.agendamentos ALTER COLUMN agend_id SET DEFAULT nextval('public.agendamentos_agend_id_seq'::regclass);


--
-- TOC entry 3292 (class 2604 OID 24580)
-- Name: categorias cat_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.categorias ALTER COLUMN cat_id SET DEFAULT nextval('public.categorias_cat_id_seq'::regclass);


--
-- TOC entry 3305 (class 2604 OID 24689)
-- Name: categorias_servicos cat_serv_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.categorias_servicos ALTER COLUMN cat_serv_id SET DEFAULT nextval('public.categorias_servicos_cat_serv_id_seq'::regclass);


--
-- TOC entry 3293 (class 2604 OID 24587)
-- Name: disponibilidade disp_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.disponibilidade ALTER COLUMN disp_id SET DEFAULT nextval('public.disponibilidade_disp_id_seq'::regclass);


--
-- TOC entry 3295 (class 2604 OID 24595)
-- Name: indisponibilidade indisp_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.indisponibilidade ALTER COLUMN indisp_id SET DEFAULT nextval('public.indisponibilidade_indisp_id_seq'::regclass);


--
-- TOC entry 3297 (class 2604 OID 24603)
-- Name: marcas mar_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.marcas ALTER COLUMN mar_id SET DEFAULT nextval('public.marcas_mar_id_seq'::regclass);


--
-- TOC entry 3298 (class 2604 OID 24615)
-- Name: modelos mod_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.modelos ALTER COLUMN mod_id SET DEFAULT nextval('public.modelos_mod_id_seq'::regclass);


--
-- TOC entry 3314 (class 2604 OID 106509)
-- Name: permissoes per_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.permissoes ALTER COLUMN per_id SET DEFAULT nextval('public.permissoes_per_id_seq'::regclass);


--
-- TOC entry 3307 (class 2604 OID 24696)
-- Name: servicos serv_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.servicos ALTER COLUMN serv_id SET DEFAULT nextval('public.servicos_serv_id_seq'::regclass);


--
-- TOC entry 3312 (class 2604 OID 73740)
-- Name: servicos_tipo_veiculo stv_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.servicos_tipo_veiculo ALTER COLUMN stv_id SET DEFAULT nextval('public.servicos_tipo_veiculo_stv_id_seq'::regclass);


--
-- TOC entry 3310 (class 2604 OID 73732)
-- Name: tipo_veiculo_servico tps_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tipo_veiculo_servico ALTER COLUMN tps_id SET DEFAULT nextval('public.tipo_veiculo_servico_tps_id_seq'::regclass);


--
-- TOC entry 3290 (class 2604 OID 16491)
-- Name: usuarios usu_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN usu_id SET DEFAULT nextval('public.usuarios_usu_id_seq'::regclass);


--
-- TOC entry 3301 (class 2604 OID 24640)
-- Name: veiculo_usuario veic_usu_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.veiculo_usuario ALTER COLUMN veic_usu_id SET DEFAULT nextval('public.veiculo_usuario_veic_usu_id_seq'::regclass);


--
-- TOC entry 3299 (class 2604 OID 24627)
-- Name: veiculos veic_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.veiculos ALTER COLUMN veic_id SET DEFAULT nextval('public.veiculos_veic_id_seq'::regclass);


--
-- TOC entry 3347 (class 2606 OID 24711)
-- Name: agenda_servicos agenda_servicos_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.agenda_servicos
    ADD CONSTRAINT agenda_servicos_pkey PRIMARY KEY (agend_serv_id);


--
-- TOC entry 3341 (class 2606 OID 24672)
-- Name: agenda_servicos_situacao agenda_servicos_situacao_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.agenda_servicos_situacao
    ADD CONSTRAINT agenda_servicos_situacao_pkey PRIMARY KEY (agend_serv_situ_id);


--
-- TOC entry 3336 (class 2606 OID 24660)
-- Name: agendamentos agendamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.agendamentos
    ADD CONSTRAINT agendamentos_pkey PRIMARY KEY (agend_id);


--
-- TOC entry 3338 (class 2606 OID 57345)
-- Name: agendamentos agendamentos_tracking_token_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.agendamentos
    ADD CONSTRAINT agendamentos_tracking_token_key UNIQUE (tracking_token);


--
-- TOC entry 3322 (class 2606 OID 24582)
-- Name: categorias categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (cat_id);


--
-- TOC entry 3343 (class 2606 OID 24691)
-- Name: categorias_servicos categorias_servicos_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.categorias_servicos
    ADD CONSTRAINT categorias_servicos_pkey PRIMARY KEY (cat_serv_id);


--
-- TOC entry 3324 (class 2606 OID 24590)
-- Name: disponibilidade disponibilidade_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.disponibilidade
    ADD CONSTRAINT disponibilidade_pkey PRIMARY KEY (disp_id);


--
-- TOC entry 3326 (class 2606 OID 24598)
-- Name: indisponibilidade indisponibilidade_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.indisponibilidade
    ADD CONSTRAINT indisponibilidade_pkey PRIMARY KEY (indisp_id);


--
-- TOC entry 3328 (class 2606 OID 24605)
-- Name: marcas marcas_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.marcas
    ADD CONSTRAINT marcas_pkey PRIMARY KEY (mar_id);


--
-- TOC entry 3330 (class 2606 OID 24617)
-- Name: modelos modelos_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.modelos
    ADD CONSTRAINT modelos_pkey PRIMARY KEY (mod_id);


--
-- TOC entry 3355 (class 2606 OID 106513)
-- Name: permissoes permissoes_per_chave_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.permissoes
    ADD CONSTRAINT permissoes_per_chave_key UNIQUE (per_chave);


--
-- TOC entry 3357 (class 2606 OID 106511)
-- Name: permissoes permissoes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.permissoes
    ADD CONSTRAINT permissoes_pkey PRIMARY KEY (per_id);


--
-- TOC entry 3345 (class 2606 OID 24699)
-- Name: servicos servicos_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.servicos
    ADD CONSTRAINT servicos_pkey PRIMARY KEY (serv_id);


--
-- TOC entry 3351 (class 2606 OID 73743)
-- Name: servicos_tipo_veiculo servicos_tipo_veiculo_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.servicos_tipo_veiculo
    ADD CONSTRAINT servicos_tipo_veiculo_pkey PRIMARY KEY (stv_id);


--
-- TOC entry 3349 (class 2606 OID 73735)
-- Name: tipo_veiculo_servico tipo_veiculo_servico_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tipo_veiculo_servico
    ADD CONSTRAINT tipo_veiculo_servico_pkey PRIMARY KEY (tps_id);


--
-- TOC entry 3353 (class 2606 OID 73745)
-- Name: servicos_tipo_veiculo uk_servico_tipo_veiculo; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.servicos_tipo_veiculo
    ADD CONSTRAINT uk_servico_tipo_veiculo UNIQUE (serv_id, tps_id);


--
-- TOC entry 3316 (class 2606 OID 16499)
-- Name: usuarios uk_usuarios_cpf; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT uk_usuarios_cpf UNIQUE (usu_cpf);


--
-- TOC entry 3318 (class 2606 OID 16497)
-- Name: usuarios uk_usuarios_email; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT uk_usuarios_email UNIQUE (usu_email);


--
-- TOC entry 3359 (class 2606 OID 114707)
-- Name: usuario_permissoes usuario_permissoes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuario_permissoes
    ADD CONSTRAINT usuario_permissoes_pkey PRIMARY KEY (usu_id, per_id);


--
-- TOC entry 3320 (class 2606 OID 16495)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (usu_id);


--
-- TOC entry 3334 (class 2606 OID 24642)
-- Name: veiculo_usuario veiculo_usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.veiculo_usuario
    ADD CONSTRAINT veiculo_usuario_pkey PRIMARY KEY (veic_usu_id);


--
-- TOC entry 3332 (class 2606 OID 24630)
-- Name: veiculos veiculos_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.veiculos
    ADD CONSTRAINT veiculos_pkey PRIMARY KEY (veic_id);


--
-- TOC entry 3339 (class 1259 OID 57346)
-- Name: idx_tracking_token; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_tracking_token ON public.agendamentos USING btree (tracking_token);


--
-- TOC entry 3366 (class 2606 OID 49327)
-- Name: agendamentos agendamentos_fk1; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.agendamentos
    ADD CONSTRAINT agendamentos_fk1 FOREIGN KEY (veic_usu_id) REFERENCES public.veiculo_usuario(veic_usu_id);


--
-- TOC entry 3368 (class 2606 OID 49357)
-- Name: agenda_servicos fk_agenda_servicos_agendamentos; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.agenda_servicos
    ADD CONSTRAINT fk_agenda_servicos_agendamentos FOREIGN KEY (agend_id) REFERENCES public.agendamentos(agend_id);


--
-- TOC entry 3369 (class 2606 OID 49362)
-- Name: agenda_servicos fk_agenda_servicos_servicos; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.agenda_servicos
    ADD CONSTRAINT fk_agenda_servicos_servicos FOREIGN KEY (serv_id) REFERENCES public.servicos(serv_id);


--
-- TOC entry 3367 (class 2606 OID 49347)
-- Name: servicos fk_cat_serv_id; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.servicos
    ADD CONSTRAINT fk_cat_serv_id FOREIGN KEY (cat_serv_id) REFERENCES public.categorias_servicos(cat_serv_id);


--
-- TOC entry 3360 (class 2606 OID 90123)
-- Name: categorias fk_categorias_tps_id; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT fk_categorias_tps_id FOREIGN KEY (tps_id) REFERENCES public.tipo_veiculo_servico(tps_id);


--
-- TOC entry 3372 (class 2606 OID 114713)
-- Name: usuario_permissoes fk_permissao; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuario_permissoes
    ADD CONSTRAINT fk_permissao FOREIGN KEY (per_id) REFERENCES public.permissoes(per_id) ON DELETE CASCADE;


--
-- TOC entry 3370 (class 2606 OID 73746)
-- Name: servicos_tipo_veiculo fk_stv_servico; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.servicos_tipo_veiculo
    ADD CONSTRAINT fk_stv_servico FOREIGN KEY (serv_id) REFERENCES public.servicos(serv_id);


--
-- TOC entry 3371 (class 2606 OID 73751)
-- Name: servicos_tipo_veiculo fk_stv_tipo_veiculo; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.servicos_tipo_veiculo
    ADD CONSTRAINT fk_stv_tipo_veiculo FOREIGN KEY (tps_id) REFERENCES public.tipo_veiculo_servico(tps_id);


--
-- TOC entry 3373 (class 2606 OID 114708)
-- Name: usuario_permissoes fk_usuario; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuario_permissoes
    ADD CONSTRAINT fk_usuario FOREIGN KEY (usu_id) REFERENCES public.usuarios(usu_id) ON DELETE CASCADE;


--
-- TOC entry 3361 (class 2606 OID 49352)
-- Name: marcas marcas_fk3; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.marcas
    ADD CONSTRAINT marcas_fk3 FOREIGN KEY (cat_id) REFERENCES public.categorias(cat_id);


--
-- TOC entry 3362 (class 2606 OID 49342)
-- Name: modelos modelos_fk2; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.modelos
    ADD CONSTRAINT modelos_fk2 FOREIGN KEY (mar_id) REFERENCES public.marcas(mar_id);


--
-- TOC entry 3364 (class 2606 OID 49332)
-- Name: veiculo_usuario veiculo_usuario_fk1; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.veiculo_usuario
    ADD CONSTRAINT veiculo_usuario_fk1 FOREIGN KEY (veic_id) REFERENCES public.veiculos(veic_id);


--
-- TOC entry 3365 (class 2606 OID 49337)
-- Name: veiculo_usuario veiculo_usuario_fk2; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.veiculo_usuario
    ADD CONSTRAINT veiculo_usuario_fk2 FOREIGN KEY (usu_id) REFERENCES public.usuarios(usu_id);


--
-- TOC entry 3363 (class 2606 OID 49322)
-- Name: veiculos veiculos_fk1; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.veiculos
    ADD CONSTRAINT veiculos_fk1 FOREIGN KEY (mod_id) REFERENCES public.modelos(mod_id);


--
-- TOC entry 3525 (class 0 OID 0)
-- Dependencies: 3524
-- Name: DATABASE neondb; Type: ACL; Schema: -; Owner: neondb_owner
--

GRANT ALL ON DATABASE neondb TO neon_superuser;


--
-- TOC entry 2125 (class 826 OID 16394)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- TOC entry 2124 (class 826 OID 16393)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


-- Completed on 2026-03-01 16:22:33

--
-- PostgreSQL database dump complete
--

\unrestrict Q89YiQnDX8nmk1ABk54FCb1aeRcXAR03WI1bPUIXH99IB3Z6XFRQH9L1gQjqQJk

