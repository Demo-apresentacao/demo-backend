--
-- PostgreSQL database dump
--

\restrict 1XJYNJeXO4zTvaTTovd6RgGmmwOcoDkjbLr3SHSpVFp3JJAMTMqcAhK2krb46lP

-- Dumped from database version 17.8 (6108b59)
-- Dumped by pg_dump version 17.7

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
-- Name: agenda_servicos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.agenda_servicos (
    agend_serv_id integer NOT NULL,
    agend_id integer NOT NULL,
    serv_id integer NOT NULL,
    agend_serv_situ_id integer NOT NULL
);


--
-- Name: agenda_servicos_agend_serv_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.agenda_servicos_agend_serv_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: agenda_servicos_agend_serv_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.agenda_servicos_agend_serv_id_seq OWNED BY public.agenda_servicos.agend_serv_id;


--
-- Name: agenda_servicos_situacao; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.agenda_servicos_situacao (
    agend_serv_situ_id integer NOT NULL,
    agend_serv_situ_nome character varying(50) NOT NULL
);


--
-- Name: agenda_servicos_situacao_agend_serv_situ_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.agenda_servicos_situacao_agend_serv_situ_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: agenda_servicos_situacao_agend_serv_situ_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.agenda_servicos_situacao_agend_serv_situ_id_seq OWNED BY public.agenda_servicos_situacao.agend_serv_situ_id;


--
-- Name: agendamentos; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: agendamentos_agend_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.agendamentos_agend_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: agendamentos_agend_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.agendamentos_agend_id_seq OWNED BY public.agendamentos.agend_id;


--
-- Name: categorias; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categorias (
    cat_id integer NOT NULL,
    cat_nome character varying(50) NOT NULL,
    cat_icone character varying(128),
    tps_id integer
);


--
-- Name: categorias_cat_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categorias_cat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categorias_cat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categorias_cat_id_seq OWNED BY public.categorias.cat_id;


--
-- Name: categorias_servicos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categorias_servicos (
    cat_serv_id integer NOT NULL,
    cat_serv_nome character varying(60) NOT NULL,
    cat_serv_situacao boolean DEFAULT true
);


--
-- Name: categorias_servicos_cat_serv_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categorias_servicos_cat_serv_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categorias_servicos_cat_serv_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categorias_servicos_cat_serv_id_seq OWNED BY public.categorias_servicos.cat_serv_id;


--
-- Name: disponibilidade; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.disponibilidade (
    disp_id integer NOT NULL,
    disp_dia character(3) NOT NULL,
    disp_periodo smallint NOT NULL,
    disp_hr_ini time without time zone NOT NULL,
    disp_hr_fin time without time zone NOT NULL,
    disp_situacao boolean DEFAULT true
);


--
-- Name: disponibilidade_disp_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.disponibilidade_disp_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: disponibilidade_disp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.disponibilidade_disp_id_seq OWNED BY public.disponibilidade.disp_id;


--
-- Name: indisponibilidade; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.indisponibilidade (
    indisp_id integer NOT NULL,
    indisp_data date NOT NULL,
    indisp_situacao boolean DEFAULT true
);


--
-- Name: indisponibilidade_indisp_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.indisponibilidade_indisp_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: indisponibilidade_indisp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.indisponibilidade_indisp_id_seq OWNED BY public.indisponibilidade.indisp_id;


--
-- Name: marcas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.marcas (
    mar_id integer NOT NULL,
    mar_nome character varying(50) NOT NULL,
    mar_cod integer NOT NULL,
    mar_icone character varying(128),
    cat_id integer
);


--
-- Name: marcas_mar_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.marcas_mar_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: marcas_mar_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.marcas_mar_id_seq OWNED BY public.marcas.mar_id;


--
-- Name: modelos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.modelos (
    mod_id integer NOT NULL,
    mod_nome character varying(60) NOT NULL,
    mod_cod integer NOT NULL,
    mar_cod integer NOT NULL,
    mar_id integer
);


--
-- Name: modelos_mod_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.modelos_mod_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: modelos_mod_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.modelos_mod_id_seq OWNED BY public.modelos.mod_id;


--
-- Name: servicos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.servicos (
    serv_id integer NOT NULL,
    cat_serv_id integer,
    serv_nome character varying(60) NOT NULL,
    serv_descricao character varying(200) NOT NULL,
    serv_situacao boolean DEFAULT true
);


--
-- Name: servicos_serv_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.servicos_serv_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: servicos_serv_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.servicos_serv_id_seq OWNED BY public.servicos.serv_id;


--
-- Name: servicos_tipo_veiculo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.servicos_tipo_veiculo (
    stv_id integer NOT NULL,
    serv_id integer NOT NULL,
    tps_id integer NOT NULL,
    stv_preco numeric(7,2) NOT NULL,
    stv_duracao time without time zone,
    stv_situacao boolean DEFAULT true
);


--
-- Name: servicos_tipo_veiculo_stv_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.servicos_tipo_veiculo_stv_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: servicos_tipo_veiculo_stv_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.servicos_tipo_veiculo_stv_id_seq OWNED BY public.servicos_tipo_veiculo.stv_id;


--
-- Name: tipo_veiculo_servico; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tipo_veiculo_servico (
    tps_id integer NOT NULL,
    tps_nome character varying(30) NOT NULL,
    tps_situacao boolean DEFAULT true
);


--
-- Name: tipo_veiculo_servico_tps_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tipo_veiculo_servico_tps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tipo_veiculo_servico_tps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tipo_veiculo_servico_tps_id_seq OWNED BY public.tipo_veiculo_servico.tps_id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: usuarios_usu_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.usuarios_usu_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: usuarios_usu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.usuarios_usu_id_seq OWNED BY public.usuarios.usu_id;


--
-- Name: veiculo_usuario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.veiculo_usuario (
    veic_usu_id integer NOT NULL,
    veic_id integer NOT NULL,
    usu_id integer NOT NULL,
    ehproprietario boolean NOT NULL,
    data_inicial date NOT NULL,
    data_final date
);


--
-- Name: veiculo_usuario_veic_usu_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.veiculo_usuario_veic_usu_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: veiculo_usuario_veic_usu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.veiculo_usuario_veic_usu_id_seq OWNED BY public.veiculo_usuario.veic_usu_id;


--
-- Name: veiculos; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: veiculos_veic_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.veiculos_veic_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: veiculos_veic_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.veiculos_veic_id_seq OWNED BY public.veiculos.veic_id;


--
-- Name: agenda_servicos agend_serv_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agenda_servicos ALTER COLUMN agend_serv_id SET DEFAULT nextval('public.agenda_servicos_agend_serv_id_seq'::regclass);


--
-- Name: agenda_servicos_situacao agend_serv_situ_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agenda_servicos_situacao ALTER COLUMN agend_serv_situ_id SET DEFAULT nextval('public.agenda_servicos_situacao_agend_serv_situ_id_seq'::regclass);


--
-- Name: agendamentos agend_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agendamentos ALTER COLUMN agend_id SET DEFAULT nextval('public.agendamentos_agend_id_seq'::regclass);


--
-- Name: categorias cat_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categorias ALTER COLUMN cat_id SET DEFAULT nextval('public.categorias_cat_id_seq'::regclass);


--
-- Name: categorias_servicos cat_serv_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categorias_servicos ALTER COLUMN cat_serv_id SET DEFAULT nextval('public.categorias_servicos_cat_serv_id_seq'::regclass);


--
-- Name: disponibilidade disp_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.disponibilidade ALTER COLUMN disp_id SET DEFAULT nextval('public.disponibilidade_disp_id_seq'::regclass);


--
-- Name: indisponibilidade indisp_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.indisponibilidade ALTER COLUMN indisp_id SET DEFAULT nextval('public.indisponibilidade_indisp_id_seq'::regclass);


--
-- Name: marcas mar_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marcas ALTER COLUMN mar_id SET DEFAULT nextval('public.marcas_mar_id_seq'::regclass);


--
-- Name: modelos mod_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.modelos ALTER COLUMN mod_id SET DEFAULT nextval('public.modelos_mod_id_seq'::regclass);


--
-- Name: servicos serv_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.servicos ALTER COLUMN serv_id SET DEFAULT nextval('public.servicos_serv_id_seq'::regclass);


--
-- Name: servicos_tipo_veiculo stv_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.servicos_tipo_veiculo ALTER COLUMN stv_id SET DEFAULT nextval('public.servicos_tipo_veiculo_stv_id_seq'::regclass);


--
-- Name: tipo_veiculo_servico tps_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_veiculo_servico ALTER COLUMN tps_id SET DEFAULT nextval('public.tipo_veiculo_servico_tps_id_seq'::regclass);


--
-- Name: usuarios usu_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN usu_id SET DEFAULT nextval('public.usuarios_usu_id_seq'::regclass);


--
-- Name: veiculo_usuario veic_usu_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.veiculo_usuario ALTER COLUMN veic_usu_id SET DEFAULT nextval('public.veiculo_usuario_veic_usu_id_seq'::regclass);


--
-- Name: veiculos veic_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.veiculos ALTER COLUMN veic_id SET DEFAULT nextval('public.veiculos_veic_id_seq'::regclass);


--
-- Data for Name: agenda_servicos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.agenda_servicos (agend_serv_id, agend_id, serv_id, agend_serv_situ_id) FROM stdin;
73	24	52	1
\.


--
-- Data for Name: agenda_servicos_situacao; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.agenda_servicos_situacao (agend_serv_situ_id, agend_serv_situ_nome) FROM stdin;
1	Pendente
2	Em Andamento
3	Concluído
4	Cancelado
\.


--
-- Data for Name: agendamentos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.agendamentos (agend_id, veic_usu_id, agend_data, agend_horario, agend_situacao, agend_observ, serv_id, agend_serv_situ_id, tracking_token) FROM stdin;
10	9	2025-12-31	15:00:00	0		\N	1	\N
11	2	2026-01-01	14:00:00	3		\N	1	\N
14	10	2026-01-06	15:00:00	3		\N	1	f29f11a4-e4e0-4ea7-ae6b-cc8118164b35
13	15	2026-01-05	10:00:00	3		\N	1	26afea0b-b73e-49a7-ab38-ec0cfa23792c
12	11	2026-01-04	14:00:00	3		\N	1	teste-123
15	12	2026-01-09	15:00:00	3		\N	1	8ad98f39-eab8-4d4d-847c-5bd5e24013d8
17	20	2026-01-10	15:00:00	2		\N	1	5846c51b-9606-4165-9f08-fa32f1534158
16	5	2026-01-09	09:00:00	3		\N	1	114359c3-507c-4f18-a50d-bbbd6cd274b0
18	21	2026-01-10	08:00:00	3		\N	1	c26366b1-ac98-4e17-8ba9-9f51862d85a6
21	10	2026-01-11	17:00:00	1		\N	1	6c541ecb-a9ee-4a39-ba98-cfd988aa13fd
22	12	2026-01-12	09:00:00	2		\N	1	339d7d21-9169-480a-ab14-69ab1ef4d27f
23	21	2026-01-13	07:00:00	2		\N	1	b5cc599c-a9b7-4d52-a3fc-797c741d09d1
20	21	2026-01-11	15:00:00	3	Cuidado com o parabrisa	\N	1	738e8d03-f63d-49ce-9564-af5ec83d352a
19	21	2026-01-10	10:00:00	3		\N	1	893e301a-9cea-4e4d-8e17-58ef3964c3dc
24	21	2026-01-24	08:00:00	3		\N	1	b63a8b76-9a6a-41ae-8645-91753af036b3
\.


--
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categorias (cat_id, cat_nome, cat_icone, tps_id) FROM stdin;
3	Moto	\N	3
4	Caminhonete	\N	4
1	Caminhao	\N	1
2	Carro	\N	2
\.


--
-- Data for Name: categorias_servicos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categorias_servicos (cat_serv_id, cat_serv_nome, cat_serv_situacao) FROM stdin;
1	Lavagem e Higienizacao	t
2	Polimento e Protecao da Pintura	t
6	Remocao de Odores	t
9	Reparos Esteticos	t
10	Servicos Adicionais	t
8	Customizacao	f
7	Correcao de Pintura	f
4	Cuidados com Rodas e Pneus	f
3	Cuidados com Vidros e Farois	f
5	Detalhamento Interno (tailing)	f
15	Categoria Teste	t
\.


--
-- Data for Name: disponibilidade; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.disponibilidade (disp_id, disp_dia, disp_periodo, disp_hr_ini, disp_hr_fin, disp_situacao) FROM stdin;
1	SEG	1	08:00:00	12:00:00	t
2	SEG	2	13:00:00	17:00:00	t
3	TER	1	08:00:00	12:00:00	t
4	TER	2	13:00:00	17:00:00	t
5	QUA	1	08:00:00	12:00:00	t
6	QUA	2	13:00:00	17:00:00	t
7	QUI	1	08:00:00	12:00:00	t
8	QUI	2	13:00:00	17:00:00	t
9	SEX	1	08:00:00	12:00:00	t
10	SEX	2	13:00:00	17:00:00	t
11	SAB	1	08:00:00	12:00:00	t
\.


--
-- Data for Name: indisponibilidade; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.indisponibilidade (indisp_id, indisp_data, indisp_situacao) FROM stdin;
1	2024-01-01	t
2	2024-04-21	t
3	2024-05-01	t
4	2024-09-07	t
5	2024-10-12	t
6	2024-11-02	t
7	2024-11-15	t
8	2024-12-25	t
\.


--
-- Data for Name: marcas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.marcas (mar_id, mar_nome, mar_cod, mar_icone, cat_id) FROM stdin;
1	CHEVROLET	1	\N	1
2	VOLKSWAGEN	2	\N	1
3	FIAT	3	\N	1
4	MERCEDES-BENZ	4	\N	1
5	CHANA	6	\N	1
6	FORD	13	\N	1
7	HYUNDAI	14	\N	1
8	KIA	16	\N	1
9	TOYOTA	23	\N	1
10	RENAULT	24	\N	1
11	AGRALE	27	\N	1
12	VOLVO	53	\N	1
13	ISUZU	84	\N	1
14	IVECO	85	\N	1
15	UTILITARIOS AGRICOLAS	131	\N	1
16	TRAILER	164	\N	1
17	RANDON	167	\N	1
18	SCANIA	242	\N	1
19	OUTROS	261	\N	1
20	ONIBUS	263	\N	1
21	UTILITARIOS PESADOS	266	\N	1
22	MOTOR-HOME	270	\N	1
23	MAN	274	\N	1
24	NAVISTAR	275	\N	1
25	SINOTRUK	277	\N	1
26	SCHIFFER	284	\N	1
27	GUERRA	285	\N	1
28	MICHIGAN	292	\N	1
29	CHEVROLET	1	\N	2
30	VOLKSWAGEN	2	\N	2
31	FIAT	3	\N	2
32	MERCEDES-BENZ	4	\N	2
33	CITROEN	5	\N	2
34	CHANA	6	\N	2
35	HONDA	7	\N	2
36	SUBARU	8	\N	2
37	FERRARI	10	\N	2
38	BUGATTI	11	\N	2
39	LAMBORGHINI	12	\N	2
40	FORD	13	\N	2
41	HYUNDAI	14	\N	2
42	JAC	15	\N	2
43	KIA	16	\N	2
44	GURGEL	17	\N	2
45	DODGE	18	\N	2
46	CHRYSLER	19	\N	2
47	BENTLEY	20	\N	2
48	SSANGYONG	21	\N	2
49	PEUGEOT	22	\N	2
50	TOYOTA	23	\N	2
51	RENAULT	24	\N	2
52	ACURA	25	\N	2
53	ADAMO	26	\N	2
54	AGRALE	27	\N	2
55	ALFA ROMEO	28	\N	2
56	AMERICAR	29	\N	2
57	ASTON MARTIN	31	\N	2
58	AUDI	32	\N	2
59	BEACH	34	\N	2
60	BIANCO	35	\N	2
61	BMW	36	\N	2
62	BORGWARD	37	\N	2
63	BRILLIANCE	38	\N	2
64	BUICK	41	\N	2
65	CBT	42	\N	2
66	NISSAN	43	\N	2
67	CHAMONIX	44	\N	2
68	CHEDA	46	\N	2
69	CHERY	47	\N	2
70	CORD	48	\N	2
71	COYOTE	49	\N	2
72	CROSS LANDER	50	\N	2
73	DAEWOO	51	\N	2
74	DAIHATSU	52	\N	2
75	VOLVO	53	\N	2
76	DE SOTO	54	\N	2
77	DETOMAZO	55	\N	2
78	DELOREAN	56	\N	2
79	DKW-VEMAG	57	\N	2
80	SUZUKI	59	\N	2
81	EAGLE	60	\N	2
82	EFFA	61	\N	2
83	ENGESA	63	\N	2
84	ENVEMO	64	\N	2
85	FARUS (	65	\N	2
86	FERCAR	66	\N	2
87	FNM	68	\N	2
88	PONTIAC	69	\N	2
89	PORSCHE	70	\N	2
90	GEO	72	\N	2
91	GRANCAR	74	\N	2
92	GREAT WALL	75	\N	2
93	HAFEI	76	\N	2
94	HOFSTETTER	78	\N	2
95	HUDSON	79	\N	2
96	HUMMER	80	\N	2
97	INFINITI	82	\N	2
98	INTERNATIONAL	83	\N	2
99	JAGUAR	86	\N	2
100	JEEP	87	\N	2
101	JINBEI	88	\N	2
102	JPX	89	\N	2
103	KAISER	90	\N	2
104	KOENIGSEGG	91	\N	2
105	LAUTOMOBILE	92	\N	2
106	LAUTOCRAFT	93	\N	2
107	LADA	94	\N	2
108	LANCIA	95	\N	2
109	LAND ROVER	96	\N	2
110	LEXUS (	97	\N	2
111	LIFAN	98	\N	2
112	LINCOLN	99	\N	2
113	LOBINI	100	\N	2
114	LOTUS (	101	\N	2
115	MAHINDRA	102	\N	2
116	MASERATI	104	\N	2
117	MATRA	106	\N	2
118	MAYBACH	107	\N	2
119	MAZDA	108	\N	2
120	MENON	109	\N	2
121	MERCURY	110	\N	2
122	MITSUBISHI	111	\N	2
123	MG	112	\N	2
124	MINI	113	\N	2
125	MIURA	114	\N	2
126	MORRIS (	115	\N	2
127	MP LAFER	116	\N	2
128	MPLM	117	\N	2
129	NEWTRACK	118	\N	2
130	NISSIN	119	\N	2
131	OLDSMOBILE	120	\N	2
132	PAG	121	\N	2
133	PAGANI	122	\N	2
134	PLYMOUTH	123	\N	2
135	PUMA	124	\N	2
136	RENO	125	\N	2
137	REVA-I	126	\N	2
138	ROLLS-ROYCE	127	\N	2
139	ROMI	129	\N	2
140	SEAT	130	\N	2
141	UTILITARIOS AGRICOLAS (	131	\N	2
142	SHINERAY	132	\N	2
143	SAAB	137	\N	2
144	SHORT	139	\N	2
145	SIMCA	141	\N	2
146	SMART	142	\N	2
147	SPYKER	143	\N	2
148	STANDARD	144	\N	2
149	STUDEBAKER	145	\N	2
150	TAC	146	\N	2
151	TANGER	147	\N	2
152	TRIUMPH	148	\N	2
153	TROLLER	149	\N	2
154	UNIMOG	150	\N	2
155	WIESMANN	154	\N	2
156	CADILLAC	155	\N	2
157	AM GEN	156	\N	2
158	BUGGY	157	\N	2
159	WILLYS OVERLAND	158	\N	2
160	KASEA	161	\N	2
161	SATURN	162	\N	2
162	SWELL MINI	163	\N	2
163	SKODA	175	\N	2
164	KARMANN GHIA	239	\N	2
165	KART	254	\N	2
166	HANOMAG	258	\N	2
167	OUTROS (	261	\N	2
168	HILLMAN	265	\N	2
169	HRG	288	\N	2
170	GAIOLA	295	\N	2
171	TATA	338	\N	2
172	DITALLY	341	\N	2
173	RELY	345	\N	2
174	MCLAREN	346	\N	2
175	GEELY	534	\N	2
176	HONDA	7	\N	3
177	AGRALE	27	\N	3
178	BMW	36	\N	3
179	SUZUKI	59	\N	3
180	LIFAN	98	\N	3
181	MAHINDRA	102	\N	3
182	SHINERAY	132	\N	3
183	KASINSKI	133	\N	3
184	YAMAHA	135	\N	3
185	GARINNI	136	\N	3
186	SUNDOWN	140	\N	3
187	KAWASAKI	170	\N	3
188	POLARIS (	171	\N	3
189	ADLY	176	\N	3
190	AMAZONAS (	177	\N	3
191	APRILIA	178	\N	3
192	ATALA	179	\N	3
193	BAJAJ	180	\N	3
194	BENELLI	181	\N	3
195	BETA	182	\N	3
196	BIMOTA	183	\N	3
197	BRANDY	184	\N	3
198	BRAVA	185	\N	3
199	BRP	186	\N	3
200	BUELL	187	\N	3
201	BUENO	188	\N	3
202	CAGIVA	190	\N	3
203	MOBILETE	191	\N	3
204	DAELIM	192	\N	3
205	DAFRA	193	\N	3
206	DAYANG	194	\N	3
207	DAYUN	195	\N	3
208	DERBI	196	\N	3
209	DUCATI	197	\N	3
210	EMME	198	\N	3
211	FYM	200	\N	3
212	GAS GAS (	201	\N	3
213	GREEN	202	\N	3
214	HAOBAO	203	\N	3
215	HARLEY-DAVIDSON	204	\N	3
216	HARTFORD	205	\N	3
217	HERO	206	\N	3
218	HUSABERG	207	\N	3
219	HUSQVARNA	208	\N	3
220	IROS (	209	\N	3
221	JIAPENG VOLCANO	210	\N	3
222	JOHNNYPAG	211	\N	3
223	JONNY	212	\N	3
224	KAHENA	213	\N	3
225	KIMCO	214	\N	3
226	LAQUILA	215	\N	3
227	LANDUM	216	\N	3
228	LAVRALE	217	\N	3
229	LERIVO	218	\N	3
230	LON-V	219	\N	3
231	TRICICLO	220	\N	3
232	MALAGUTI	221	\N	3
233	MIZA	222	\N	3
234	MOTO GUZZI	223	\N	3
235	MRX	224	\N	3
236	MV AUGUSTA	225	\N	3
237	MVK	226	\N	3
238	ORCA	227	\N	3
239	PEGASSI	228	\N	3
240	PIAGGIO	229	\N	3
241	REGAL RAPTOR	230	\N	3
242	SANYANG	231	\N	3
243	SIAMOTO	232	\N	3
244	TARGOS (	233	\N	3
245	TRAXX	234	\N	3
246	VENTO	235	\N	3
247	WUYANG	236	\N	3
248	GARRA	245	\N	3
249	X MOTOS (	246	\N	3
250	TRICKER	248	\N	3
251	LAMBRETA	253	\N	3
252	OUTROS (	261	\N	3
253	SCOOTER	269	\N	3
254	ZONGSHEN	281	\N	3
255	BIRELLI	282	\N	3
256	WALK MACHINE	294	\N	3
257	FBM	297	\N	3
258	ARIEL	299	\N	3
259	DUCAR	340	\N	3
260	DITALLY	341	\N	3
261	MARVA	342	\N	3
262	WOLVER	343	\N	3
263	KTM	344	\N	3
264	LEOPARD	347	\N	3
265	JAWA	348	\N	3
266	BULL	349	\N	3
267	CAN-AM	358	\N	3
268	ACELLERA	359	\N	3
269	VICTORY	483	\N	3
270	INDIAN	484	\N	3
271	BRAVAX	532	\N	3
272	GARELLI	533	\N	3
273	CHEVROLET	1	\N	4
274	VOLKSWAGEN	2	\N	4
275	FIAT	3	\N	4
276	MERCEDES-BENZ	4	\N	4
277	CITROEN	5	\N	4
278	CHANA	6	\N	4
279	HONDA	7	\N	4
280	SUBARU	8	\N	4
281	FERRARI	10	\N	4
282	BUGATTI	11	\N	4
283	LAMBORGHINI	12	\N	4
284	FORD	13	\N	4
285	HYUNDAI	14	\N	4
286	JAC	15	\N	4
287	KIA	16	\N	4
288	GURGEL	17	\N	4
289	DODGE	18	\N	4
290	CHRYSLER	19	\N	4
291	BENTLEY	20	\N	4
292	SSANGYONG	21	\N	4
293	PEUGEOT	22	\N	4
294	TOYOTA	23	\N	4
295	RENAULT	24	\N	4
296	ACURA	25	\N	4
297	ADAMO	26	\N	4
298	AGRALE	27	\N	4
299	ALFA ROMEO	28	\N	4
300	AMERICAR	29	\N	4
301	ASTON MARTIN	31	\N	4
302	AUDI	32	\N	4
303	BEACH	34	\N	4
304	BIANCO	35	\N	4
305	BMW	36	\N	4
306	BORGWARD	37	\N	4
307	BRILLIANCE	38	\N	4
308	BUICK	41	\N	4
309	CBT	42	\N	4
310	NISSAN	43	\N	4
311	CHAMONIX	44	\N	4
312	CHEDA	46	\N	4
313	CHERY	47	\N	4
314	CORD	48	\N	4
315	COYOTE	49	\N	4
316	CROSS LANDER	50	\N	4
317	DAEWOO	51	\N	4
318	DAIHATSU	52	\N	4
319	VOLVO	53	\N	4
320	DE SOTO	54	\N	4
321	DETOMAZO	55	\N	4
322	DELOREAN	56	\N	4
323	DKW-VEMAG	57	\N	4
324	SUZUKI	59	\N	4
325	EAGLE	60	\N	4
326	EFFA	61	\N	4
327	ENGESA	63	\N	4
328	ENVEMO	64	\N	4
329	FARUS (	65	\N	4
330	FERCAR	66	\N	4
331	FNM	68	\N	4
332	PONTIAC	69	\N	4
333	PORSCHE	70	\N	4
334	GEO	72	\N	4
335	GRANCAR	74	\N	4
336	GREAT WALL	75	\N	4
337	HAFEI	76	\N	4
338	HOFSTETTER	78	\N	4
339	HUDSON	79	\N	4
340	HUMMER	80	\N	4
341	INFINITI	82	\N	4
342	INTERNATIONAL	83	\N	4
343	JAGUAR	86	\N	4
344	JEEP	87	\N	4
345	JINBEI	88	\N	4
346	JPX	89	\N	4
347	KAISER	90	\N	4
348	KOENIGSEGG	91	\N	4
349	LAUTOMOBILE	92	\N	4
350	LAUTOCRAFT	93	\N	4
351	LADA	94	\N	4
352	LANCIA	95	\N	4
353	LAND ROVER	96	\N	4
354	LEXUS (	97	\N	4
355	LIFAN	98	\N	4
356	LINCOLN	99	\N	4
357	LOBINI	100	\N	4
358	LOTUS (	101	\N	4
359	MAHINDRA	102	\N	4
360	MASERATI	104	\N	4
361	MATRA	106	\N	4
362	MAYBACH	107	\N	4
363	MAZDA	108	\N	4
364	MENON	109	\N	4
365	MERCURY	110	\N	4
366	MITSUBISHI	111	\N	4
367	MG	112	\N	4
368	MINI	113	\N	4
369	MIURA	114	\N	4
370	MORRIS (	115	\N	4
371	MP LAFER	116	\N	4
372	MPLM	117	\N	4
373	NEWTRACK	118	\N	4
374	NISSIN	119	\N	4
375	OLDSMOBILE	120	\N	4
376	PAG	121	\N	4
377	PAGANI	122	\N	4
378	PLYMOUTH	123	\N	4
379	PUMA	124	\N	4
380	RENO	125	\N	4
381	REVA-I	126	\N	4
382	ROLLS-ROYCE	127	\N	4
383	ROMI	129	\N	4
384	SEAT	130	\N	4
385	UTILITARIOS AGRICOLAS (	131	\N	4
386	SHINERAY	132	\N	4
387	SAAB	137	\N	4
388	SHORT	139	\N	4
389	SIMCA	141	\N	4
390	SMART	142	\N	4
391	SPYKER	143	\N	4
392	STANDARD	144	\N	4
393	STUDEBAKER	145	\N	4
394	TAC	146	\N	4
395	TANGER	147	\N	4
396	TRIUMPH	148	\N	4
397	TROLLER	149	\N	4
398	UNIMOG	150	\N	4
399	WIESMANN	154	\N	4
400	CADILLAC	155	\N	4
401	AM GEN	156	\N	4
402	BUGGY	157	\N	4
403	WILLYS OVERLAND	158	\N	4
404	KASEA	161	\N	4
405	SATURN	162	\N	4
406	SWELL MINI	163	\N	4
407	SKODA	175	\N	4
408	KARMANN GHIA	239	\N	4
409	KART	254	\N	4
410	HANOMAG	258	\N	4
411	OUTROS (	261	\N	4
412	HILLMAN	265	\N	4
413	HRG	288	\N	4
414	GAIOLA	295	\N	4
415	TATA	338	\N	4
416	DITALLY	341	\N	4
417	RELY	345	\N	4
418	MCLAREN	346	\N	4
419	GEELY	534	\N	4
\.


--
-- Data for Name: modelos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.modelos (mod_id, mod_nome, mod_cod, mar_cod, mar_id) FROM stdin;
1	HR	320	14	7
2	1113	734	4	4
3	1214	735	4	4
4	1318	736	4	4
5	1519	738	4	4
6	1614	739	4	4
7	1620	740	4	4
8	7000D	746	27	11
9	709	748	4	4
10	710	749	4	4
11	912	750	4	4
12	2000	753	4	4
13	TRAILER	1452	164	16
14	F-12000	1453	13	6
15	MASCARELLO	1461	2	2
16	GRANMICRO	1462	2	2
17	ONIBUS	1482	263	20
18	GUINDASTE	1483	266	21
19	EMPILHADEIRA	1511	266	21
20	112	1519	242	18
21	10000	1521	27	11
22	13000	1522	27	11
23	14000	1523	27	11
24	1600	1524	27	11
25	1800	1525	27	11
26	4500	1526	27	11
27	5000	1527	27	11
28	6000	1528	27	11
29	7000	1529	27	11
30	7500	1530	27	11
31	8000	1531	27	11
32	8500	1532	27	11
33	8700	1533	27	11
34	9200	1534	27	11
35	D-12000	1536	1	1
36	D-13000	1537	1	1
37	D-14000	1538	1	1
38	19000	1539	1	1
39	21000	1540	1	1
40	22000	1541	1	1
41	D-6000	1542	1	1
42	C-60	1543	1	1
43	D-40	1544	1	1
44	D-60	1545	1	1
45	D-70	1546	1	1
46	JBC	1549	61	82
47	N601	1550	61	82
48	N900	1551	61	82
49	190	1552	3	3
50	CARGO	1626	13	6
51	F-11000	1627	13	6
52	F-13000	1629	13	6
53	F-14000	1630	13	6
54	F-16000	1631	13	6
55	F-19000	1632	13	6
56	F-2000	1633	13	6
57	F-21000	1634	13	6
58	F-22000	1635	13	6
59	F-350	1636	13	6
60	F-4	1637	13	6
61	F-4000	1638	13	6
62	F-7000	1639	13	6
63	F-MAXX	1640	13	6
64	12-170	1641	1	1
65	14-190	1642	1	1
66	15-190	1643	1	1
67	16-220	1644	1	1
68	3500	1645	1	1
69	mai/90	1646	1	1
70	6-100	1647	1	1
71	6-150	1648	1	1
72	7-110	1649	1	1
73	HD78	1650	14	7
74	CITYCLASS	1651	85	14
75	CURSOR	1652	85	14
76	DAILY	1653	85	14
77	EUROCARGO	1661	85	14
78	EUROTECH	1664	85	14
79	EUROTRAKKER	1665	85	14
80	POWERSTAR	1666	85	14
81	STRALIS	1667	85	14
82	TECTOR	1670	85	14
83	TRAKKER	1671	85	14
84	VERTIS	1672	85	14
85	TGX	1673	274	23
86	1114	1679	4	4
87	1215	1681	4	4
88	1218	1682	4	4
89	1414	1684	4	4
90	1420	1686	4	4
91	1714	1687	4	4
92	1720	1689	4	4
93	1721	1690	4	4
94	1723	1691	4	4
95	1938	1693	4	4
96	1944-S	1694	4	4
97	2038	1695	4	4
98	2418	1696	4	4
99	2423	1697	4	4
100	2638	1699	4	4
101	2726	1700	4	4
102	608	1701	4	4
103	708	1702	4	4
104	712	1705	4	4
105	914	1707	4	4
106	ACCELO	1709	4	4
107	ACTROS	1710	4	4
108	ATEGO	1711	4	4
109	ATILIS	1712	4	4
110	ATRON	1713	4	4
111	AXOR	1714	4	4
112	L-1117	1717	4	4
113	L-1118	1718	4	4
114	L-1313	1721	4	4
115	L-1314	1722	4	4
116	L-1317	1724	4	4
117	L-1319	1726	4	4
118	L-1514	1730	4	4
119	L-1517	1732	4	4
120	1520	1735	4	4
121	L-2014	1744	4	4
122	L-2017	1745	4	4
123	L-2213	1746	4	4
124	L-2214	1747	4	4
125	L-2215	1748	4	4
126	L-2216	1749	4	4
127	L-2217	1750	4	4
128	L-2220	1752	4	4
129	L-2225	1753	4	4
130	L-2314	1754	4	4
131	L-2318	1755	4	4
132	L-2325	1756	4	4
133	2635	1757	4	4
134	LS-1632	1771	4	4
135	LS-1941	1780	4	4
136	DURASTAR	1783	275	24
137	INTERNATIONAL	1784	275	24
138	7900	1792	124	135
139	9000	1793	124	135
140	914	1794	124	135
141	R-112	1795	137	143
142	R-142	1796	137	143
143	T-112	1797	137	143
144	T-142	1798	137	143
145	380	1800	242	18
146	400	1801	242	18
147	420	1802	242	18
148	440	1803	242	18
149	470	1804	242	18
150	480	1805	242	18
151	111	1806	242	18
152	141	1807	242	18
153	114	1808	242	18
154	230	1810	242	18
155	P-250	1811	242	18
156	P-270	1812	242	18
157	P-310	1813	242	18
158	P-340	1814	242	18
159	93	1817	242	18
160	94	1818	242	18
161	143	1822	242	18
162	164	1823	242	18
163	R-500	1830	242	18
164	R-560	1831	242	18
165	R-580	1832	242	18
166	R-620	1833	242	18
167	HOWO	1839	277	25
168	11-130	1840	2	2
169	11-140	1841	2	2
170	12-170	1842	2	2
171	12-180	1843	2	2
172	13-130	1844	2	2
173	13-150	1845	2	2
174	13-170	1846	2	2
175	14-140	1849	2	2
176	14-150	1850	2	2
177	14-170	1851	2	2
178	14-180	1852	2	2
179	14-200	1853	2	2
180	14-210	1854	2	2
181	14-220	1855	2	2
182	15-170	1856	2	2
183	16-170	1859	2	2
184	16-200	1860	2	2
185	16-210	1861	2	2
186	16-220	1862	2	2
187	16-300	1863	2	2
188	17-180	1864	2	2
189	17-210	1866	2	2
190	17-220	1867	2	2
191	17-280	1869	2	2
192	17-300	1870	2	2
193	17-310	1871	2	2
194	17-330	1873	2	2
195	18-310	1874	2	2
196	19-330	1876	2	2
197	19-390	1878	2	2
198	22-140	1879	2	2
199	22-160	1880	2	2
200	22-210	1881	2	2
201	23-210	1882	2	2
202	23-220	1883	2	2
203	23-250	1884	2	2
204	23-310	1885	2	2
205	24-220	1886	2	2
206	24-280	1888	2	2
207	24-330	1890	2	2
208	25-390	1893	2	2
209	26-220	1894	2	2
210	26-280	1896	2	2
211	26-300	1897	2	2
212	26-310	1898	2	2
213	26-390	1900	2	2
214	31-280	1902	2	2
215	31-310	1903	2	2
216	31-330	1905	2	2
217	31-390	1907	2	2
218	35-300	1908	2	2
219	40-300	1909	2	2
220	jun/80	1912	2	2
221	jun/90	1913	2	2
222	7-100	1914	2	2
223	7-110	1915	2	2
224	jul/90	1916	2	2
225	8-100	1917	2	2
226	8-120	1918	2	2
227	8-140	1919	2	2
228	L-80	1924	2	2
229	FH SERIES	1925	53	12
230	FH GLOBETROTTER SERIES	1926	53	12
231	FM SERIES	1938	53	12
232	FMX SERIES	1944	53	12
233	N SERIES	1951	53	12
234	NH SERIES	1953	53	12
235	NL SERIES	1954	53	12
236	VM SERIES	1956	53	12
237	11-160	1994	2	2
238	12-140	1995	2	2
239	17-230	1996	2	2
240	24-230	1997	2	2
241	28-440	1998	2	2
242	29-440	1999	2	2
243	31-440	2000	2	2
244	33-440	2001	2	2
245	16-180	2002	2	2
246	17-240	2003	2	2
247	17-260	2004	2	2
248	18-320	2005	2	2
249	18-330	2006	2	2
250	15-210	2007	2	2
251	1516	2016	4	4
252	1935	2018	4	4
253	2555	2019	4	4
254	0-400	2020	4	4
255	BI-TREM	2021	284	26
256	BITREM	2022	285	27
257	1513	2023	4	4
258	D-1200	2024	1	1
259	F-3500	2025	13	6
260	F-600	2026	13	6
261	2219	2027	4	4
262	1313	2028	4	4
263	35-10	2029	85	14
264	MARTA-ROCHA	2033	1	1
265	1929	2038	4	4
266	124	2042	242	18
267	1618	2051	4	4
268	1934	2052	4	4
269	1924	2053	4	4
270	1634	2054	4	4
271	F-400	2060	13	6
272	MOTOR-HOME	2062	270	22
273	PA CARREGADEIRA	2064	292	28
274	MICRO-ONIBUS	2085	263	20
275	113	2225	242	18
276	1525	2255	4	4
277	2621	2256	4	4
278	210	2297	3	3
279	110	2354	242	18
280	LK-140	2355	242	18
281	L-80	2357	242	18
282	B-110	2358	242	18
283	BR-115	2359	242	18
284	B-111	2362	242	18
285	BR-116	2363	242	18
286	81	2364	242	18
287	82	2365	242	18
288	92	2366	242	18
289	142	2367	242	18
290	144	2370	242	18
291	L-71	2372	242	18
292	L-75	2373	242	18
293	L-76	2374	242	18
294	P-330	2375	242	18
295	F-750	2465	13	6
296	1625	2466	4	4
297	2013	2478	4	4
298	312	2483	4	4
299	80S	2488	85	14
300	F-6	2490	13	6
301	490	2497	242	18
302	180	2504	68	87
303	1622	2506	4	4
304	1524	2507	4	4
305	1630	2512	4	4
306	1932	2513	4	4
307	1316	2531	4	4
308	133	2535	242	18
309	MATRA	2538	1	1
310	1111	2539	4	4
311	COE	2549	1	1
312	COE	2550	13	6
313	130	2551	3	3
314	F-8	2552	13	6
315	CONSTELLATION	2577	2	2
316	DELIVERY	2578	2	2
317	WORKER	2579	2	2
318	321	2601	4	4
319	1317	2602	4	4
320	180	2603	3	3
321	ESCAVADEIRA	2712	266	21
322	MUNCK	2713	266	21
323	GUINCHO	2714	266	21
324	CARREGADEIRA	2715	266	21
325	MOTONIVELADORA	2723	266	21
326	2213	2724	4	4
327	TANQUE	2889	266	21
328	POLIGUINDASTE	2892	266	21
329	1621	2893	4	4
330	F-8000	2894	13	6
331	24250	2897	274	23
332	1632	2898	4	4
333	PERFURATRIZ	2900	266	21
334	180	2919	4	4
335	1517	2920	4	4
336	C-65	2929	1	1
337	D-11000	2930	1	1
338	D-65	2964	1	1
339	FL SERIES	2971	53	12
340	INTEGRA	1	25	52
341	LEGEND	2	25	52
342	NSX	3	25	52
343	MARRUA	4	27	54
344	145	5	28	55
345	147	6	28	55
346	155	7	28	55
347	156	8	28	55
348	164	9	28	55
349	166	10	28	55
350	2300	11	28	55
351	SPIDER	12	28	55
352	HUMMER	13	156	157
353	AM-825	14	16	43
354	HI-TOPIC	15	16	43
355	ROCSTA	16	16	43
356	TOPIC	17	16	43
357	TOWNER	18	16	43
358	100	19	32	58
359	80	20	32	58
360	A1	21	32	58
361	A3	22	32	58
362	A4 SEDAN	23	32	58
363	A5 COUPE	24	32	58
364	A6 SEDAN	25	32	58
365	A7	26	32	58
366	A8	27	32	58
367	Q3	30	32	58
368	Q5	31	32	58
369	Q7	32	32	58
370	R8	33	32	58
371	RS3	34	32	58
372	RS4	35	32	58
373	RS5	36	32	58
374	RS6	37	32	58
375	S3	38	32	58
376	S4 SEDAN	39	32	58
377	S6 SEDAN	40	32	58
378	S8	41	32	58
379	TT	42	32	58
380	TTS	43	32	58
381	BUGGY	86	157	158
382	DEVILLE	87	155	156
383	ELDORADO	88	155	156
384	SEVILLE	89	155	156
385	JAVALI	90	42	65
386	MINI STAR FAMILY	92	6	34
387	MINI STAR UTILITY	93	6	34
388	CIELO	95	47	69
389	FACE	96	47	69
390	QQ	97	47	69
391	S-18	98	47	69
392	TIGGO	99	47	69
393	300C	100	19	46
394	CARAVAN	101	19	46
395	CIRRUS	102	19	46
396	GRAN CARAVAN	103	19	46
397	LE BARON	104	19	46
398	NEON	105	19	46
399	PT CRUISER	106	19	46
400	SEBRING	107	19	46
401	STRATUS	108	19	46
402	TOWN E COUNTRY	109	19	46
403	VISION	110	19	46
404	AIRCROSS	111	5	33
405	AX	112	5	33
406	BERLINGO	113	5	33
407	BX	114	5	33
408	C3	115	5	33
409	C4	116	5	33
410	C5	117	5	33
411	C6	118	5	33
412	C8	119	5	33
413	DS3	120	5	33
414	EVASION	121	5	33
415	JUMPER	122	5	33
416	XANTIA	123	5	33
417	XM	124	5	33
418	XSARA	125	5	33
419	ZX	126	5	33
420	CL-244	127	50	72
421	CL-330	128	50	72
422	ESPERO	129	51	73
423	LANOS	130	51	73
424	LEGANZA	131	51	73
425	NUBIRA	132	51	73
426	PRINCE	133	51	73
427	RACER	134	51	73
428	SUPER SALON	135	51	73
429	TICO	136	51	73
430	APPLAUSE	137	52	74
431	CHARADE	138	52	74
432	CUORE	139	52	74
433	FEROZA	140	52	74
434	GRAN MOVE	141	52	74
435	MOVE VAN	142	52	74
436	TERIOS	143	52	74
437	AVENGER	144	18	45
438	DAKOTA	145	18	45
439	JOURNEY	146	18	45
440	RAM	147	18	45
441	STEALTH	148	18	45
442	M-100	151	61	82
443	PLUTUS	152	61	82
444	START	153	61	82
445	ULC	155	61	82
446	ENGESA	158	63	83
447	CAMPER	159	64	84
448	MASTER	160	64	84
449	348	161	10	37
450	355	162	10	37
451	360	163	10	37
452	456	164	10	37
453	550	165	10	37
454	575M	166	10	37
455	612	167	10	37
456	CALIFORNIA	168	10	37
457	F430	169	10	37
458	F599	170	10	37
459	147	171	3	31
460	500	174	3	31
461	BRAVA	175	3	31
462	BRAVO	176	3	31
463	COUPE	178	3	31
464	DOBLO	179	3	31
465	DUCATO CARGO	180	3	31
466	DUNA	181	3	31
467	ELBA	182	3	31
468	FIORINO	183	3	31
469	FREEMONT	184	3	31
470	GRAND SIENA	185	3	31
471	IDEA	186	3	31
472	LINEA	187	3	31
473	MAREA	188	3	31
474	OGGI	189	3	31
475	PALIO	190	3	31
476	PANORAMA	191	3	31
477	PREMIO	192	3	31
478	PUNTO	193	3	31
479	SIENA	194	3	31
480	STILO	195	3	31
481	STRADA	196	3	31
482	TEMPRA	197	3	31
483	TIPO	198	3	31
484	UNO	199	3	31
485	AEROSTAR	201	13	40
486	ASPIRE	202	13	40
487	BELINA	203	13	40
488	CLUB WAGON	204	13	40
489	CONTOUR	205	13	40
490	CORCEL II	206	13	40
491	COURIER	207	13	40
492	CROWN VICTORIA	208	13	40
493	DEL REY	209	13	40
494	ECOSPORT	210	13	40
495	EDGE	211	13	40
496	ESCORT	212	13	40
497	EXPEDITION	213	13	40
498	EXPLORER	214	13	40
499	F-100	215	13	40
500	F-1000	216	13	40
501	F-150	217	13	40
502	F-250	218	13	40
503	FIESTA	219	13	40
504	FOCUS	220	13	40
505	FURGLAINE	221	13	40
506	FUSION	222	13	40
507	IBIZA	223	13	40
508	KA	224	13	40
509	MONDEO	225	13	40
510	MUSTANG	226	13	40
511	PAMPA	227	13	40
512	PROBE	228	13	40
513	RANGER	229	13	40
514	VERSAILLES ROYALE	230	13	40
515	TAURUS	231	13	40
516	THUNDERBIRD	232	13	40
517	TRANSIT	233	13	40
518	VERONA	234	13	40
519	VERSAILLES	235	13	40
520	WINDSTAR	236	13	40
521	A-10	238	1	29
522	A-20	239	1	29
523	AGILE	240	1	29
524	ASTRA	241	1	29
525	BLAZER	242	1	29
526	BONANZA	243	1	29
527	C-10	245	1	29
528	C-20	246	1	29
529	CALIBRA	247	1	29
530	CAMARO	248	1	29
531	CAPRICE	249	1	29
532	CAPTIVA	250	1	29
533	CARAVAN	251	1	29
534	CAVALIER	252	1	29
535	CELTA	253	1	29
536	CHEVY	255	1	29
537	CHEYNNE	256	1	29
538	COBALT	258	1	29
539	CORSA	259	1	29
540	CORVETTE	262	1	29
541	CRUZE	263	1	29
542	D-10	264	1	29
543	D-20	265	1	29
544	IPANEMA	266	1	29
545	KADETT	267	1	29
546	LUMINA	268	1	29
547	MALIBU	269	1	29
548	MERIVA	271	1	29
549	MONTANA	272	1	29
550	OMEGA	274	1	29
551	OPALA	275	1	29
552	PRISMA	276	1	29
553	S10	277	1	29
554	SILVERADO	280	1	29
555	SONIC	281	1	29
556	SONOMA	282	1	29
557	SPACEVAN	283	1	29
558	SS10	284	1	29
559	SUBURBAN	285	1	29
560	SYCLONE	287	1	29
561	TIGRA	288	1	29
562	TRACKER	289	1	29
563	TRAFIC	290	1	29
564	VECTRA	291	1	29
565	VERANEIO	292	1	29
566	ZAFIRA	293	1	29
567	HOVER	294	75	92
568	BR-800	295	17	44
569	CARAJAS	296	17	44
570	TOCANTINS	297	17	44
571	XAVANTE	298	17	44
572	VIP	299	17	44
573	TOWNER	300	76	93
574	ACCORD	301	7	35
575	CITY	302	7	35
576	CIVIC	303	7	35
577	CR-V	304	7	35
578	FIT	305	7	35
579	ODYSSEY	306	7	35
580	PASSPORT	307	7	35
581	PRELUDE	308	7	35
582	ACCENT	309	14	41
583	ATOS	310	14	41
584	AZERA	311	14	41
585	COUPE	312	14	41
586	ELANTRA	314	14	41
587	EXCEL	315	14	41
588	GALLOPER	316	14	41
589	GENESIS	317	14	41
590	H1	318	14	41
591	H100	319	14	41
592	I30	321	14	41
593	IX35	323	14	41
594	MATRIX	324	14	41
595	PORTER	325	14	41
596	SANTA FE	326	14	41
597	SCOUPE	327	14	41
598	SONATA	328	14	41
599	TERRACAN	329	14	41
600	TRAJET	330	14	41
601	TUCSON	331	14	41
602	VELOSTER	332	14	41
603	VERACRUZ	333	14	41
604	AMIGO	334	84	13
605	HOMBRE	335	84	13
606	RODEO	336	84	13
607	J3	337	15	42
608	J5	338	15	42
609	J6	339	15	42
610	DAIMLER	340	86	99
611	S-TYPE	341	86	99
612	X-TYPE	342	86	99
613	MODELOS XJ	345	86	99
614	MODELOS XK	352	86	99
615	CHEROKEE	354	87	100
616	COMMANDER	355	87	100
617	COMPASS	356	87	100
618	GRAND CHEROKEE	357	87	100
619	WRANGLER	358	87	100
620	TOPIC VAN	359	88	101
621	JIPE MONTEZ	360	89	102
622	PICAPE MONTEZ	361	89	102
623	BESTA	362	16	43
624	BONGO	363	16	43
625	CADENZA	364	16	43
626	CARENS	365	16	43
627	CARNIVAL	366	16	43
628	CERATO	367	16	43
629	CERES	368	16	43
630	CLARUS	369	16	43
631	MAGENTIS	370	16	43
632	MOHAVE	371	16	43
633	OPIRUS	372	16	43
634	OPTIMA	373	16	43
635	PICANTO	374	16	43
636	SEPHIA	375	16	43
637	SHUMA	376	16	43
638	SORENTO	377	16	43
639	SOUL	378	16	43
640	SPORTAGE	379	16	43
641	LAIKA	380	94	107
642	NIVA	381	94	107
643	SAMARA	382	94	107
644	GALLARDO	383	12	39
645	MURCIELAGO	384	12	39
646	DEFENDER	385	96	109
647	DISCOVERY	386	96	109
648	FREELANDER	389	96	109
649	NEW RANGE	391	96	109
650	RANGE ROVER	392	96	109
651	ES	393	97	110
652	GS	396	97	110
653	IS-300	397	97	110
654	LS	398	97	110
655	RX	400	97	110
656	SC	402	97	110
657	320	403	98	111
658	620	404	98	111
659	H1	405	100	113
660	ELAN	406	101	114
661	ESPRIT	407	101	114
662	SCORPIO	408	102	115
663	222	409	104	116
664	228	410	104	116
665	3200	411	104	116
666	430	412	104	116
667	COUPE	413	104	116
668	GHIBLI	414	104	116
669	GRANCABRIO	415	104	116
670	GRANSPORT	416	104	116
671	GRANTURISMO	417	104	116
672	QUATTROPORTE	418	104	116
673	SHAMAL	419	104	116
674	SPIDER	420	104	116
675	PICK-UP	422	106	117
676	323	423	108	119
677	626	424	108	119
678	929	425	108	119
679	B-2500	426	108	119
680	B2200	427	108	119
681	MILLENIA	428	108	119
682	MPV	429	108	119
683	MX-3	430	108	119
684	MX-5	431	108	119
685	NAVAJO	432	108	119
686	PROTEGE	433	108	119
687	RX	434	108	119
688	CLASSE A	467	4	32
689	CLASSE B	468	4	32
690	CLASSE R	469	4	32
691	CLASSE GLK	498	4	32
692	SPRINTER	531	4	32
693	MYSTIQUE	532	110	121
694	SABLE	533	110	121
695	550	534	112	123
696	MG6	535	112	123
697	COOPER	536	113	124
698	ONE	537	113	124
699	3000	538	111	122
700	AIRTREK	539	111	122
701	ASX	540	111	122
702	COLT	541	111	122
703	DIAMANT	542	111	122
704	ECLIPSE	543	111	122
705	EXPO	544	111	122
706	GALANT	545	111	122
707	GRANDIS	546	111	122
708	L200	547	111	122
709	L300	548	111	122
710	LANCER	549	111	122
711	MIRAGE	550	111	122
712	MONTERO	551	111	122
713	OUTLANDER	552	111	122
714	PAJERO	553	111	122
715	SPACE WAGON	554	111	122
716	BG-TRUCK	555	114	125
717	350Z	556	43	66
718	ALTIMA	557	43	66
719	AX	558	43	66
720	D-21	559	43	66
721	FRONTIER	560	43	66
722	KING-CAB	562	43	66
723	LIVINA	563	43	66
724	MARCH	564	43	66
725	MAXIMA	565	43	66
726	MURANO	567	43	66
727	NX	568	43	66
728	PATHFINDER	569	43	66
729	PRIMERA	571	43	66
730	QUEST	572	43	66
731	SENTRA	573	43	66
732	STANZA	574	43	66
733	180SX	575	43	66
734	TERRANO	576	43	66
735	TIIDA	577	43	66
736	VERSA	578	43	66
737	X-TRAIL	579	43	66
738	XTERRA	580	43	66
739	ZX	581	43	66
740	106	582	22	49
741	205	583	22	49
742	206	584	22	49
743	207	585	22	49
744	3008	586	22	49
745	306	587	22	49
746	307	588	22	49
747	308	589	22	49
748	405	590	22	49
749	406	591	22	49
750	407	592	22	49
751	408	593	22	49
752	504	594	22	49
753	505	595	22	49
754	508	596	22	49
755	605	597	22	49
756	607	598	22	49
757	806	599	22	49
758	807	600	22	49
759	BOXER	601	22	49
760	HOGGAR	602	22	49
761	PARTNER	603	22	49
762	RCZ	604	22	49
763	GRAN VOYAGER	605	123	134
764	SUNDANCE	606	123	134
765	TRANS-AM	607	69	88
766	TRANS-SPORT	608	69	88
767	911	609	70	89
768	BOXSTER	612	70	89
769	CAYENNE	613	70	89
770	CAYMAN	614	70	89
771	PANAMERA	615	70	89
772	21 SEDAN	617	24	51
773	CLIO	618	24	51
774	DUSTER	619	24	51
775	EXPRESS	620	24	51
776	FLUENCE	621	24	51
777	KANGOO	622	24	51
778	LAGUNA	623	24	51
779	LOGAN	624	24	51
780	MASTER	625	24	51
781	MEGANE	626	24	51
782	SAFRANE	627	24	51
783	SANDERO	628	24	51
784	SCENIC	629	24	51
785	SYMBOL	630	24	51
786	TRAFIC	631	24	51
787	TWINGO	632	24	51
788	9000	634	137	143
789	SL-2	635	162	161
790	CORDOBA	636	130	140
791	IBIZA	637	130	140
792	INCA	638	130	140
793	FORTWO	641	142	146
794	ACTYON SPORTS	642	21	48
795	CHAIRMAN	643	21	48
796	ISTANA	644	21	48
797	KORANDO	645	21	48
798	KYRON	646	21	48
799	MUSSO	647	21	48
800	REXTON	648	21	48
801	FORESTER	649	8	36
802	IMPREZA	650	8	36
803	LEGACY	651	8	36
804	OUTBACK	652	8	36
805	SVX	653	8	36
806	TRIBECA	654	8	36
807	VIVIO	655	8	36
808	BALENO	656	59	80
809	GRAND VITARA	657	59	80
810	IGNIS	658	59	80
811	JIMNY	660	59	80
812	SUPER CARRY	662	59	80
813	SWIFT	663	59	80
814	SX4	664	59	80
815	VITARA	665	59	80
816	WAGON R	666	59	80
817	STARK	667	146	150
818	AVALON	668	23	50
819	BANDEIRANTE	669	23	50
820	CAMRY	670	23	50
821	CELICA	671	23	50
822	COROLLA	672	23	50
823	CORONA	673	23	50
824	HILUX	674	23	50
825	LAND CRUISER	675	23	50
826	MR-2	676	23	50
827	PASEO	677	23	50
828	PREVIA	678	23	50
829	RAV4	679	23	50
830	SUPRA	680	23	50
831	PANTANAL	682	149	153
832	T-4	684	149	153
833	400 SERIES	685	53	75
834	850	687	53	75
835	900 SERIES	688	53	75
836	AMAROK	700	2	30
837	APOLLO	701	2	30
838	BORA	702	2	30
839	CARAVELLE	703	2	30
840	CORRADO	704	2	30
841	EOS	706	2	30
842	EUROVAN	707	2	30
843	FOX	708	2	30
844	FUSCA	709	2	30
845	GOL	710	2	30
846	GOLF	711	2	30
847	JETTA	713	2	30
848	KOMBI	714	2	30
849	LOGUS	715	2	30
850	PARATI	717	2	30
851	PASSAT	718	2	30
852	POINTER	719	2	30
853	POLO	720	2	30
854	SANTANA	722	2	30
855	SAVEIRO	723	2	30
856	SPACEFOX	725	2	30
857	TIGUAN	726	2	30
858	TOUAREG	727	2	30
859	VOYAGE	729	2	30
860	ZDX	732	25	52
861	140	737	3	31
862	BRASILIA	755	2	30
863	BRASILVAN	756	13	40
864	CORCEL	775	13	40
865	PALIO WEEKEND	803	3	31
866	FOCUS SEDAN	806	13	40
867	FIESTA SEDAN	807	13	40
868	FIESTA TRAIL	808	13	40
869	207 SW	810	22	49
870	ESCORT SW	811	13	40
871	307 SEDAN	812	22	49
872	307 SW	813	22	49
873	C4 PALLAS	815	5	33
874	C4 PICASSO	816	5	33
875	C4 VTR	817	5	33
876	CLIO SEDAN	818	24	51
877	COROLLA FIELDER	819	23	50
878	HILUX SW4	824	23	50
879	MEGANE GRAND TOUR	825	24	51
880	SANDERO STEPWAY	827	24	51
881	XSARA PICASSO	829	5	33
882	COLHEITADEIRA	1360	131	141
883	PICKUP F75	1361	158	159
884	X12	1362	17	44
885	BEL AIR	1365	1	29
886	RX	1366	36	61
887	C-14	1369	1	29
888	SRX4	1370	155	156
889	C-15	1372	1	29
890	BRASIL	1373	1	29
891	POLARA	1377	18	45
892	600	1380	3	31
893	F-01	1382	13	40
894	FALCON	1383	13	40
895	GALAXIE	1384	13	40
896	MAVERICK	1386	13	40
897	MODELO A	1387	13	40
898	NEW FIESTA	1388	13	40
899	LINHA FX	1389	82	97
900	GTS	1391	124	135
901	H3	1392	80	96
902	PRIME	1394	14	41
903	TIBURON	1395	14	41
904	JEEP	1397	87	100
905	CJ5	1398	87	100
906	TC	1399	239	164
907	CLASSE CLC	1404	4	32
908	CLASSE CLS	1405	4	32
909	MONTEREY	1408	110	121
910	TOPSPORT	1411	114	125
911	TARGA	1412	114	125
912	X8	1414	114	125
913	370Z	1415	43	66
914	GTB	1418	124	135
915	GTC	1419	124	135
916	GTE	1420	124	135
917	AUSTIN	1421	115	126
918	7TL	1423	24	51
919	19	1424	24	51
920	CONVERSÍVEL	1426	175	163
921	SUPERMINI	1427	17	44
922	TL	1428	2	30
923	TOPOLINO	1429	3	31
924	SR5	1430	23	50
925	VITZ	1431	23	50
926	VARIANT	1432	2	30
927	CANDANGO	1454	57	79
928	SP2	1460	2	30
929	RECORB	1466	258	166
930	POLAUTO	1467	2	30
931	GORDINI	1508	24	51
932	MINX	1509	265	168
933	ETIOS	1971	23	50
934	ONIX	1972	1	29
935	HB20	1973	14	41
936	330	1975	36	61
937	520	1976	36	61
938	730	1978	36	61
939	M1	1980	36	61
940	SERIE Z	1982	36	61
941	CLASSE SLK	1983	4	32
942	CLASSE C	1984	4	32
943	CLASSE E	1985	4	32
944	CLASSE CL	1986	4	32
945	CLASSE CLK	1987	4	32
946	CLASSE S	1988	4	32
947	CLASSE SL	1989	4	32
948	CLASSE SLS	1990	4	32
949	CLASSE G	1991	4	32
950	CLASSE GL	1992	4	32
951	CLASSE M	1993	4	32
952	1500	2032	288	169
953	EQUUS	2061	14	41
954	350 GT	2067	12	39
955	400 GT	2068	12	39
956	MIURA	2069	12	39
957	ISLERO	2070	12	39
958	ESPADA	2071	12	39
959	COUNTACH	2072	12	39
960	DIABLO	2073	12	39
961	ZAGATO	2074	12	39
962	ALAR	2075	12	39
963	LM002	2076	12	39
964	REVENTON	2077	12	39
965	ANKONIAN	2078	12	39
966	AVENTADOR	2080	12	39
967	SESTO ELEMENTO	2081	12	39
968	J3 TURIN	2082	15	42
969	J2	2083	15	42
970	SANDERO GT	2084	24	51
971	SPIN	2087	1	29
972	TRAILBLAZER	2088	1	29
973	C3 PICASSO	2097	5	33
974	GRAND C4 PICASSO	2098	5	33
975	JUMPER MINIBUS	2099	5	33
976	JUMPER VETRATO	2100	5	33
977	207 SEDAN	2101	22	49
978	207 QUIKSILVER	2102	22	49
979	207 ESCAPADE	2103	22	49
980	308 CC	2104	22	49
981	BOXER PASSAGEIRO	2105	22	49
982	NEW FIESTA SEDAN	2106	13	40
983	TRANSIT PASSAGEIRO	2108	13	40
984	TRANSIT CHASSI	2109	13	40
985	A4 AVANT	2110	32	58
986	S4 AVANT	2111	32	58
987	A5 SPORTBACK	2112	32	58
988	A5 CABRIOLET	2113	32	58
989	S5 COUPE	2114	32	58
990	S5 SPORTBACK	2115	32	58
991	S5 CABRIOLET	2116	32	58
992	A6 AVANT	2117	32	58
993	A6 ALLROAD	2118	32	58
994	S6 AVANT	2119	32	58
995	S7	2120	32	58
996	TT ROADSTER	2121	32	58
997	TT RS	2122	32	58
998	TT RS ROADSTER	2123	32	58
999	TTS ROADSTER	2124	32	58
1000	R8 SPYDER	2125	32	58
1001	R8 GT	2126	32	58
1002	R8 GT SPYDER	2127	32	58
1003	F12	2129	10	37
1004	458 SPIDER	2130	10	37
1005	458 ITALIA	2131	10	37
1006	FF	2132	10	37
1007	599	2133	10	37
1008	SA	2134	10	37
1009	CHALLENGE	2135	10	37
1010	SUPERAMERICA	2136	10	37
1011	F430 SPIDER	2137	10	37
1012	430	2138	10	37
1013	612 SESSANTA	2139	10	37
1014	599 GTB	2140	10	37
1015	SCUDERIA SPIDER	2141	10	37
1016	512	2142	10	37
1017	456 GT	2143	10	37
1018	348 GTS	2144	10	37
1019	348 SPIDER	2145	10	37
1020	F355	2146	10	37
1021	F355 SPIDER	2147	10	37
1022	F50	2148	10	37
1023	355 SPIDER	2149	10	37
1024	360 MODENA	2150	10	37
1025	PAJERO FULL	2151	111	122
1026	PAJERO DAKAR	2152	111	122
1027	PAJERO TR4	2153	111	122
1028	LANCER SPORTBACK	2154	111	122
1029	LANCER EVOLUTION	2155	111	122
1030	L200 TRITON SAVANA	2156	111	122
1031	L200 TRITON	2157	111	122
1032	LIVINA X-GEAR	2159	43	66
1033	GRAND LIVINA	2160	43	66
1034	NEW ACTYON SPORTS	2161	21	48
1035	PRIUS	2162	23	50
1036	SPORT	2163	114	125
1037	MTS	2164	114	125
1038	SPIDER	2165	114	125
1039	KABRIO	2166	114	125
1040	SAGA	2167	114	125
1041	SAGA II	2168	114	125
1042	787	2169	114	125
1043	X11	2170	114	125
1044	GAIOLA	2171	295	170
1045	NITRO	2175	18	45
1046	CHALLENGER	2176	18	45
1047	DART	2177	18	45
1048	LE BARON	2178	18	45
1049	CORDOBA	2179	18	45
1050	CHARGER	2180	18	45
1051	WINDSOR	2181	19	46
1052	CROSSFIRE	2183	19	46
1053	CORDOBA	2184	19	46
1054	ESCALADE	2185	155	156
1055	RIVIERA	2186	41	64
1056	COUPE	2187	41	64
1057	CENTURY	2188	41	64
1058	APOLLO	2189	41	64
1059	CENTURION	2190	41	64
1060	EIGHT	2191	41	64
1061	ELECTRA	2192	41	64
1062	ESTATE WAGON	2193	41	64
1063	GRAN SPORT	2194	41	64
1064	GSX	2195	41	64
1065	INVICTA	2196	41	64
1066	LESABRE	2197	41	64
1067	LIMITED	2198	41	64
1068	PARK AVENUE	2199	41	64
1069	RAINIER	2200	41	64
1070	REATTA	2201	41	64
1071	REGAL	2202	41	64
1072	RENDEZVOUS	2203	41	64
1073	ROADMASTER	2204	41	64
1074	ROYAUM	2205	41	64
1075	SKYHAWK	2206	41	64
1076	SKYLARK	2207	41	64
1077	SOMERSET	2208	41	64
1078	SPECIAL	2209	41	64
1079	SPORT WAGON	2210	41	64
1080	SUPER	2211	41	64
1081	TERRAZA	2212	41	64
1082	WILDCAT	2213	41	64
1083	LACROSSE	2214	41	64
1084	ENCLAVE	2215	41	64
1085	GL8	2217	41	64
1086	HRV	2218	41	64
1087	LUCERNE	2219	41	64
1088	SIERRA	2230	13	40
1089	BROUGHAM	2231	51	73
1090	CHAIRMAN	2232	51	73
1091	DAMAS	2233	51	73
1092	GENTRA	2234	51	73
1093	MAEPSY	2235	51	73
1094	ISTANA	2236	51	73
1095	KALOS	2237	51	73
1096	KORANDO	2238	51	73
1097	LACETTI	2239	51	73
1098	LEMANS	2240	51	73
1099	MATIZ	2242	51	73
1100	MUSSO	2243	51	73
1101	NEXIA	2244	51	73
1102	REZZO	2245	51	73
1103	ROYALE PRINCE	2246	51	73
1104	ROYALE SALON	2247	51	73
1105	STATESMAN	2248	51	73
1106	TOSCA	2249	51	73
1107	WINSTORM	2250	51	73
1108	RURAL	2252	158	159
1109	D100	2253	18	45
1110	170	2259	4	32
1111	CUSTOM ROYAL	2261	18	45
1112	CLUB COUPE	2262	1	29
1113	MAGNUM	2263	18	45
1114	GMC 100	2264	1	29
1115	SOLSTICE	2265	69	88
1116	ITAMARATY	2266	158	159
1117	MARK V	2267	86	99
1118	GT	2268	124	135
1119	CHAMPION	2269	145	149
1120	BALILLA	2270	3	31
1121	INTERLAGOS	2271	158	159
1122	X15	2272	17	44
1123	F-85	2273	13	40
1124	SPEEDSTER 356	2274	70	89
1125	TOPIC FURGAO	2275	88	101
1126	TOPIC ESCOLAR	2276	88	101
1127	300D	2279	4	32
1128	CLASSE TE	2280	4	32
1129	T-100	2283	23	50
1130	MEGANE SEDAN	2294	24	51
1131	A4 CABRIOLET	2295	32	58
1132	LINHA G	2298	82	97
1133	LINHA G COUPE	2299	82	97
1134	LINHA G CONVERSIVEL	2300	82	97
1135	LINHA M	2301	82	97
1136	LINHA EX	2302	82	97
1137	LINHA JX	2303	82	97
1138	LINHA QX	2304	82	97
1139	MODELOS XF	2305	86	99
1140	F-TYPE	2306	86	99
1141	MARK VII	2307	86	99
1142	MARK VIII	2308	86	99
1143	MARK IX	2309	86	99
1144	MARK X	2310	86	99
1145	E-TYPE	2311	86	99
1146	C-TYPE	2312	86	99
1147	D-TYPE	2313	86	99
1148	MARK I	2314	86	99
1149	MARK II	2315	86	99
1150	GT4R	2346	124	135
1151	SPYDER	2347	124	135
1152	GTI	2348	124	135
1153	AM1	2349	124	135
1154	AM2	2350	124	135
1155	AM3	2351	124	135
1156	AM4	2352	124	135
1157	AMV	2353	124	135
1158	ACTY	2377	7	35
1159	AIRWAVE	2378	7	35
1160	ASCOT	2379	7	35
1161	BALLADE	2380	7	35
1162	BEAT	2381	7	35
1163	CR-X	2382	7	35
1164	CONCERTO	2383	7	35
1165	CR-Z	2384	7	35
1166	DOMANI	2385	7	35
1167	EDIX	2386	7	35
1168	ELEMENT	2387	7	35
1169	EV PLUS	2388	7	35
1170	FCX	2389	7	35
1171	FR-V	2390	7	35
1172	HR-V	2392	7	35
1173	HSC	2393	7	35
1174	INSIGHT	2394	7	35
1175	TL	2396	25	52
1176	LIFE DUNK	2397	7	35
1177	LOGO	2398	7	35
1178	MOBILIO	2399	7	35
1179	MDX	2400	25	52
1180	ORTHIA	2401	7	35
1181	PARTNER VAN	2402	7	35
1182	PILOT	2403	7	35
1183	RIDGELINE	2404	7	35
1184	S2000	2405	7	35
1185	S600	2406	7	35
1186	S500	2407	7	35
1187	S800	2408	7	35
1188	STEPWGN	2409	7	35
1189	STREAM	2410	7	35
1190	THATS	2411	7	35
1191	VAMOZ	2412	7	35
1192	Z	2413	7	35
1193	ZEST	2414	7	35
1194	AERIO	2441	59	80
1195	ALTO	2442	59	80
1196	APV	2443	59	80
1197	KEI	2444	59	80
1198	LAPIN	2445	59	80
1199	MR WAGON	2446	59	80
1200	XL-7	2447	59	80
1201	VERONA	2448	59	80
1202	JEEP CJ	2477	158	159
1203	306 CABRIOLET	2479	22	49
1204	BELCAR	2484	57	79
1205	M715	2485	90	103
1206	407 SW	2492	22	49
1207	307 CC	2493	22	49
1208	STYLELINE	2499	1	29
1209	ANGLIA	2500	13	40
1210	GT2	2508	26	53
1211	YUKON	2509	1	29
1212	SPORTSMAN	2510	54	76
1213	21 NEVADA	2514	24	51
1214	VEYRON	2515	11	38
1215	ENZO	2516	10	37
1216	306 SW	2517	22	49
1217	TI 80	2528	28	55
1218	SPYDER 550	2532	70	89
1219	380 GTB	2533	10	37
1220	T-5	2534	149	153
1221	KINGSWAY	2536	18	45
1222	SSR	2537	1	29
1223	IMPALA	2540	1	29
1224	208	2541	22	49
1225	GRAND BLAZER	2542	1	29
1226	100 SERIES	2555	53	75
1227	200 SERIES	2558	53	75
1228	300 SERIES	2559	53	75
1229	66	2561	53	75
1230	700 SERIES	2562	53	75
1231	AMAZON	2563	53	75
1232	C303	2564	53	75
1233	DUETT	2566	53	75
1234	L3314	2567	53	75
1235	OV 4	2568	53	75
1236	P1800	2569	53	75
1237	SUGGA	2570	53	75
1238	TT	2571	13	40
1239	ONCE	2572	5	33
1240	DE LUXE	2573	13	40
1241	CUSTOM	2574	13	40
1242	T-BUCKET	2575	13	40
1243	G15	2576	17	44
1244	PAJERO FULL 3D	2588	111	122
1245	PAJERO SPORT	2589	111	122
1246	120 CABRIO	2590	36	61
1247	320 TOURING	2591	36	61
1248	330 CABRIO	2592	36	61
1249	SERIE 5 TOURING	2593	36	61
1250	SERIE 6 CABRIO	2594	36	61
1251	SERIE M CONVERSIVEL	2595	36	61
1252	M5 TOURING	2596	36	61
1253	SERIE Z ROADSTER	2597	36	61
1254	KA SPORT	2599	13	40
1255	CC	2600	2	30
1256	CERATO KOUP	2605	16	43
1257	ASTRO	2607	1	29
1258	COROLLA XRS	2608	23	50
1259	ETIOS SEDAN	2609	23	50
1260	FREESTYLE	2611	13	40
1261	COUGAR	2612	110	121
1262	XUV 500	2615	102	115
1263	XYLO	2618	102	115
1264	BOLERO	2619	102	115
1265	THAR	2620	102	115
1266	AXE	2621	102	115
1267	LEGEND	2622	102	115
1268	CJ3	2623	87	100
1269	ARMADA	2624	102	115
1270	CHASSI	2625	102	115
1271	SCORPIO PICK-UP	2626	102	115
1272	STAR TRUCK	2627	6	34
1273	STAR	2628	6	34
1274	STAR VAN CARGO	2629	6	34
1275	STAR VAN PASSAGEIROS	2630	6	34
1276	ALVORADA	2632	141	145
1277	CHAMBORD	2633	141	145
1278	PROFISSIONAL	2637	141	145
1279	VEDETTE	2639	141	145
1280	ARONDE	2640	141	145
1281	1200S	2641	141	145
1282	1000	2642	141	145
1283	HB20X	2645	14	41
1284	HB20S	2646	14	41
1285	MONZA	2648	1	29
1286	CHEVETTE	2649	1	29
1287	X60	2650	98	111
1288	TRAX	2651	1	29
1289	118	2652	36	61
1290	120	2653	36	61
1291	130	2654	36	61
1292	BAVARIA	2655	36	61
1293	C-2800	2656	36	61
1294	318	2657	36	61
1295	320	2658	36	61
1296	318 CABRIO	2659	36	61
1297	325 CABRIO	2660	36	61
1298	530	2661	36	61
1299	540	2662	36	61
1300	550	2663	36	61
1301	740	2664	36	61
1302	750	2665	36	61
1303	760	2666	36	61
1304	MATRIX 4X4	2675	341	172
1305	A7	2694	132	142
1306	A9	2695	132	142
1307	A9 CARGO	2696	132	142
1308	T20	2697	132	142
1309	T20 BAU	2698	132	142
1310	T22	2699	132	142
1311	SUPER 90 COUPE	2704	64	84
1312	X20	2705	17	44
1313	ITAIPU	2706	17	44
1314	G800	2707	17	44
1315	XEF	2708	17	44
1316	MOTOMACHINE	2709	17	44
1317	BUGATO	2710	17	44
1318	QT	2711	17	44
1319	CAICARA	2716	57	79
1320	CARCARA	2717	57	79
1321	FISSORE	2718	57	79
1322	MALZONI	2719	57	79
1323	VEMAGUET	2720	57	79
1324	C4 LOUNGE	2727	5	33
1325	CX-7	2728	108	119
1326	TR	2729	147	151
1327	LUCENA	2730	147	151
1328	SEVETSE	2731	147	151
1329	RAGGE	2732	147	151
1330	C70	2733	53	75
1331	C30	2734	53	75
1332	544	2735	53	75
1333	S40	2736	53	75
1334	S60	2737	53	75
1335	S70	2738	53	75
1336	S80	2739	53	75
1337	V40	2740	53	75
1338	V50	2741	53	75
1339	V60	2742	53	75
1340	V70	2743	53	75
1341	S90	2744	53	75
1342	XC60	2745	53	75
1343	XC70	2746	53	75
1344	XC90	2747	53	75
1345	P1900	2748	53	75
1346	PV36	2749	53	75
1347	PV444	2750	53	75
1348	PV544	2751	53	75
1349	PV51	2752	53	75
1350	PV654	2753	53	75
1351	C50	2754	53	75
1352	190	2755	4	32
1353	CLASSE CLA	2756	4	32
1354	CLASSE V	2757	4	32
1355	VANEO	2758	4	32
1356	CITAN	2759	4	32
1357	VARIO	2760	4	32
1358	CLASSE S CLASSICO	2761	4	32
1359	J3S	2809	15	42
1360	PICK-UP	2810	345	173
1361	VAN	2811	345	173
1362	C3 SOLARIS	2823	5	33
1363	C3 XTR	2824	5	33
1364	C4 SOLARIS	2825	5	33
1365	C5 BREAK/TOURER	2826	5	33
1366	XSARA BREAK	2827	5	33
1367	XSARA VTS	2828	5	33
1368	XANTIA BREAK	2829	5	33
1369	XM BREAK	2830	5	33
1370	C15	2831	5	33
1371	NEMO	2832	5	33
1372	VISA	2833	5	33
1373	C1	2834	5	33
1374	C2	2835	5	33
1375	C3 PLURIEL	2836	5	33
1376	DS4	2837	5	33
1377	DS5	2838	5	33
1378	JUMPY	2839	5	33
1379	C-CROSSER	2840	5	33
1380	C35	2841	5	33
1381	C25	2842	5	33
1382	CX	2843	5	33
1383	CX BREAK	2844	5	33
1384	AXEL	2845	5	33
1385	DYANE	2846	5	33
1386	GS/GSA	2847	5	33
1387	GS/GSA BREAK	2848	5	33
1388	MEHARI	2849	5	33
1389	SAXO	2850	5	33
1390	SM	2851	5	33
1391	ELYSEE	2852	5	33
1392	MASTER MINIBUS	2853	24	51
1393	CELER	2854	47	69
1394	CELER SEDAN	2855	47	69
1395	CIELO SEDAN	2856	47	69
1396	A1 SPORTBACK	2857	32	58
1397	A1 QUATTRO	2858	32	58
1398	A3 SPORTBACK	2859	32	58
1399	RS4 AVANT	2860	32	58
1400	A8L W12	2861	32	58
1401	R8 V10	2862	32	58
1402	RANGER CD	2863	13	40
1403	T140	2864	15	42
1404	X1	2865	36	61
1405	X3	2866	36	61
1406	X5	2867	36	61
1407	X6	2868	36	61
1408	840	2869	36	61
1409	850	2870	36	61
1410	645	2871	36	61
1411	650	2872	36	61
1412	FIT TWIST	2874	7	35
1413	MP4	2876	346	174
1414	F1	2877	346	174
1415	MONDEO SW	2878	13	40
1416	ESCORT SEDAN	2879	13	40
1417	ESCORT CONVERSIVEL	2880	13	40
1418	MX-6	2881	108	119
1419	CORISCO	2884	1	29
1420	CHEVELLE	2885	1	29
1421	EXCURSION	2886	13	40
1422	TOURAN	2887	2	30
1423	F-10000	2890	13	40
1424	HOGGAR ESCAPADE	2891	22	49
1425	PHAETON	2901	13	40
1426	TRANSPORTER	2913	2	30
1427	GRAND BESTA	2914	16	43
1428	200SX	2915	43	66
1429	240SX	2916	43	66
1430	300M	2921	19	46
1431	300C TOURING	2922	19	46
1432	TORINO	2928	13	40
1433	VENTURE	2931	1	29
1434	FLEETLINE	2932	1	29
1435	FLEETMASTER	2933	1	29
1436	DELUXE	2934	1	29
1437	ESCORT XR3	2936	13	40
1438	MASTER	2937	1	29
1439	TORONADO	2938	120	131
1440	SIX	2939	120	131
1441	EIGHT	2940	120	131
1442	DELUXE	2941	120	131
1443	SERIES 60	2942	120	131
1444	SERIES 70	2943	120	131
1445	SERIES 80	2944	120	131
1446	SERIES 90	2945	120	131
1447	STARFIRE	2946	120	131
1448	442	2947	120	131
1449	CUTLASS	2948	120	131
1450	CUTLASS SUPREME	2949	120	131
1451	CUTLASS SALON	2950	120	131
1452	CUTLASS CALAIS	2951	120	131
1453	CUTLASS CIERA	2952	120	131
1454	CUSTOM CRUISER	2953	120	131
1455	VISTA CRUISER	2954	120	131
1456	F-85	2955	120	131
1457	FIRENZA	2957	120	131
1458	ACHIEVA	2958	120	131
1459	ALERO	2959	120	131
1460	AURORA	2960	120	131
1461	BRAVADA	2961	120	131
1462	INTRIGUE	2962	120	131
1463	SILHOUETTE	2963	120	131
1464	SUPERBIRD	2972	123	134
1465	FURY	2973	123	134
1466	SPECIAL	2974	123	134
1467	PROWLER	2975	123	134
1468	TRAIL DUSTER	2976	123	134
1469	VOYAGER	2977	123	134
1470	SCAMP	2978	123	134
1471	ARROW	2979	123	134
1472	PT50	2980	123	134
1473	PT57	2981	123	134
1474	PT81	2982	123	134
1475	PT105	2983	123	134
1476	PT125	2984	123	134
1477	EXPRESS	2985	123	134
1478	VOYAGER EXPRESSO	2986	123	134
1479	NEON	2987	123	134
1480	LASER	2988	123	134
1481	CARAVELLE	2989	123	134
1482	STATION WAGON	2990	123	134
1483	MODEL Q	2991	123	134
1484	MODEL P6	2992	123	134
1485	DB9 COUPE	2993	31	57
1486	DB9 VOLANTE	2994	31	57
1487	VIRAGE COUPE	2995	31	57
1488	RAPIDE S	2996	31	57
1489	V12 VANTAGE	2997	31	57
1490	V8 VANTAGE COUPE	2998	31	57
1491	V8 VANTAGE ROADSTER	2999	31	57
1492	V8 VANTAGE S COUPE	3000	31	57
1493	V8 VANTAGE S ROADSTER	3001	31	57
1494	VANQUISH COUPE	3002	31	57
1495	VANQUISH VOLANTE	3003	31	57
1496	V12 ZAGATO	3004	31	57
1497	DB5	3005	31	57
1498	DBS	3007	31	57
1499	DBS VOLANTE	3008	31	57
1500	CYGNET	3009	31	57
1501	ONE-77	3010	31	57
1502	DBR9	3011	31	57
1503	M3	3013	36	61
1504	M5	3014	36	61
1505	M6	3015	36	61
1506	X6 M	3016	36	61
1507	CABRIO	3017	113	124
1508	COUPE	3018	113	124
1509	ROADSTER	3019	113	124
1510	COUNTRYMAN	3020	113	124
1511	PACEMAN	3021	113	124
1512	JOHN COOPER WORKS	3022	113	124
1513	ZONDA	3023	122	133
1514	NEW XV	3024	8	36
1515	IMPREZA WRX HATCH	3025	8	36
1516	IMPREZA WRX STI HATCH	3026	8	36
1517	IMPREZA WRX STI SEDAN	3027	8	36
1518	IMPREZA WRX SEDAN	3028	8	36
1519	ETIOS CROSS	3030	23	50
1520	HURACAN	3031	12	39
1521	UP	3032	2	30
1522	EXPLORER	3080	195	207
1523	FORTWO CABRIO	4964	142	146
1524	GT	4969	26	53
1525	GTL	4970	26	53
1526	GTM	4971	26	53
1527	C2	4972	26	53
1528	CRX	4973	26	53
1529	AC 2000	4974	26	53
1530	AVIATOR	4975	99	112
1531	BLACKWOOD	4976	99	112
1532	CAPRI	4977	99	112
1533	CONTINENTAL	4978	99	112
1534	LS	4979	99	112
1535	MARK	4980	99	112
1536	MARK LT	4981	99	112
1537	MKR	4982	99	112
1538	MKS	4983	99	112
1539	MKX	4984	99	112
1540	MKZ	4985	99	112
1541	NAVIGATOR	4986	99	112
1542	PREMIERE	4987	99	112
1543	TOWN CAR	4988	99	112
1544	VERSAILLES	4989	99	112
1545	ZEPHYR	4990	99	112
1546	CLASSIC	4991	1	29
1547	ACTYON	4992	21	48
1548	MARAJO	5003	1	29
1549	SUPREMA	5004	1	29
1550	NEW BEETLE	5005	2	30
1551	QUANTUM	5006	2	30
1552	CROSSFOX	5007	2	30
1553	MILLE	5008	3	31
1554	GC2	5009	534	175
1555	EC7	5010	534	175
1556	530	5011	98	111
1557	MOBI	5012	3	31
1558	TORO	5013	3	31
1559	RENEGADE	5014	87	100
1560	DUSTER OROCH	5015	24	51
1561	SANDERO RS	5016	24	51
1562	HB20R	5017	14	41
1563	GRAND SANTA FE	5018	14	41
1564	GOLF VARIANT	5019	2	30
1565	SPACE CROSS	5020	2	30
1566	2008	5021	22	49
1567	QUORIS	5022	16	43
1568	GRAND CARNIVAL	5023	16	43
1569	T8	5024	15	42
1570	T6	5025	15	42
1571	T5	5026	15	42
1572	KA SEDAN	5027	13	40
1573	FOCUS FASTBACK	5028	13	40
1574	BIZ	754	7	176
1575	CB 300R	761	7	176
1576	CB 400	763	7	176
1577	CB 500	764	7	176
1578	CB 600 HORNET	765	7	176
1579	CBR 1000F	766	7	176
1580	FIREBLADE CBR	767	7	176
1581	CBR 450	768	7	176
1582	CBR 600	769	7	176
1583	TWISTER CBX 250	771	7	176
1584	CBX 750F	772	7	176
1585	CG FAN	773	7	176
1586	CG TITAN	774	7	176
1587	CRYPTON T115	777	135	184
1588	CRZ	778	133	183
1589	V-STROM DL	779	59	179
1590	DT 200	780	135	184
1591	ELEFANTRE	781	27	177
1592	FUTURE	783	140	186
1593	GR 500	785	136	185
1594	GRI 50	786	136	185
1595	GSX	787	59	179
1596	GSX-R GIXXER/SRAD	788	59	179
1597	FAZER YS250	791	135	184
1598	FACTOR YBR125	792	135	184
1599	YZF R1	796	135	184
1600	VIRAGO 250	800	135	184
1601	CITY	833	27	177
1602	DAKAR	834	27	177
1603	ELEFANT	835	27	177
1604	FORCE	836	27	177
1605	JUNIOR	837	27	177
1606	SST	838	27	177
1607	SUPER CITY	839	27	177
1608	SXT	840	27	177
1609	TCHAU	841	27	177
1610	AME-110	842	177	190
1611	AME-150	843	177	190
1612	AME-250	844	177	190
1613	AME-LX	845	177	190
1614	AREA-51	846	178	191
1615	CLASSIC	847	178	191
1616	LEONARDO	848	178	191
1617	MOTO	849	178	191
1618	PEGASO	850	178	191
1619	RALLY	851	178	191
1620	RS	852	178	191
1621	RSV MILLE	853	178	191
1622	RX	854	178	191
1623	SCARABEO	855	178	191
1624	SONIC	858	178	191
1625	SR RACING	859	178	191
1626	SR WWW	860	178	191
1627	CALIFFONE	861	179	192
1628	MASTER	862	179	192
1629	SKEGIA	863	179	192
1630	CHAMPION	864	180	193
1631	CLASSIC	865	180	193
1632	TNT	866	181	194
1633	TRE	869	181	194
1634	MX-50	870	182	195
1635	DB4	872	183	196
1636	DB5R	873	183	196
1637	DB6	874	183	196
1638	DB6R	875	183	196
1639	DB7	876	183	196
1640	MANTRA	877	183	196
1641	SBR8	878	183	196
1642	TESI	879	183	196
1643	G650GS	882	36	178
1644	S1000RR	891	36	178
1645	ELEGANT	892	184	197
1646	FOSTI	893	184	197
1647	PISTA	894	184	197
1648	TURBO	895	184	197
1649	ZANELLA	896	184	197
1650	YB	897	185	198
1651	CAN-AM	898	186	199
1652	1125	900	187	200
1653	FIREBOLT	902	187	200
1654	LIGHTNING	904	187	200
1655	ULYSSES	905	187	200
1656	JBR	906	188	201
1657	CANYON	908	190	202
1658	ELEFANT	909	190	202
1659	GRAN CANYON	910	190	202
1660	MITO	911	190	202
1661	NAVIGATOR	912	190	202
1662	PLANET	913	190	202
1663	ROADSTER	914	190	202
1664	V-RAPTOR	915	190	202
1665	W-16	916	190	202
1666	MOBILETE	917	191	203
1667	ALTINO	919	192	204
1668	MESSAGE	920	192	204
1669	VC	921	192	204
1670	VF	922	192	204
1671	VS	923	192	204
1672	VT	924	192	204
1673	VX	925	192	204
1674	APACHE	926	193	205
1675	CITYCOM	927	193	205
1676	KANSAS	928	193	205
1677	LASER	929	193	205
1678	NEXT	930	193	205
1679	RIVA	931	193	205
1680	ROADWIN	932	193	205
1681	SMART	933	193	205
1682	SPEED	934	193	205
1683	SUPER	935	193	205
1684	ZIG	936	193	205
1685	DY100-31	937	194	206
1686	DY110-20	938	194	206
1687	DY125-18	939	194	206
1688	DY125-36A	940	194	206
1689	DY125-37	941	194	206
1690	DY125-5	942	194	206
1691	DY125-52	943	194	206
1692	DY150-12	944	194	206
1693	DY200	945	194	206
1694	SUMMER	946	195	207
1695	DY125-8	947	195	207
1696	SPACE	948	195	207
1697	PHANTON	949	195	207
1698	CITY	950	195	207
1699	DY150GY	951	195	207
1700	CARGO 150	952	195	207
1701	CARGO 200	953	195	207
1702	DY250-2	954	195	207
1703	ATLANTIS	955	196	208
1704	GPR	956	196	208
1705	PREDATOR	957	196	208
1706	RED BULLET	958	196	208
1707	REPLICAS	959	196	208
1708	SENDA	960	196	208
1709	1098	961	197	209
1710	1198	962	197	209
1711	749	963	197	209
1712	848	964	197	209
1713	996	965	197	209
1714	998	966	197	209
1715	999	967	197	209
1716	999R	968	197	209
1717	DESMOSEDICI	969	197	209
1718	DIAVEL	970	197	209
1719	HYPERMOTARD	971	197	209
1720	MONSTER	972	197	209
1721	MULTISTRADA	973	197	209
1722	SPORTCLASSIC	974	197	209
1723	SS	975	197	209
1724	ST-2	976	197	209
1725	ST-4	977	197	209
1726	STREETFIGHTER	978	197	209
1727	MIRAGE	979	198	210
1728	ONE	980	198	210
1729	ONE RACING	981	198	210
1730	FY100-10A	984	200	211
1731	FY125-19	985	200	211
1732	FY125-20	986	200	211
1733	FY125EY-2	987	200	211
1734	FY125Y-3	988	200	211
1735	FY150-3	989	200	211
1736	FY150T-18	990	200	211
1737	FY250	991	200	211
1738	GR08T4	992	136	185
1739	GR 125S/ST	993	136	185
1740	GR125T3	995	136	185
1741	GR125U	996	136	185
1742	GR 125Z	997	136	185
1743	GR 150P/PI	998	136	185
1744	GR150ST	1000	136	185
1745	GR150T3	1001	136	185
1746	GR150TI	1002	136	185
1747	GR150U	1003	136	185
1748	GR250T3	1004	136	185
1749	ENDUCROSS	1005	201	212
1750	ROOKIE ENDURO	1006	201	212
1751	BOY	1007	201	212
1752	MC	1008	201	212
1753	PAMPERA	1009	201	212
1754	TX BOY	1010	201	212
1755	TXT	1011	201	212
1756	TXT ROOKIE	1012	201	212
1757	EASY	1013	202	213
1758	RUNNER	1014	202	213
1759	SAFARI	1015	202	213
1760	SPORT	1016	202	213
1761	HB-110	1018	203	214
1762	HB-125	1019	203	214
1763	HB-150	1020	203	214
1764	SOFTAIL	1022	204	215
1765	TOURING ROAD KING	1026	204	215
1766	TOURING ELECTRA GLIDE	1027	204	215
1767	DYNA	1028	204	215
1768	V-ROD	1038	204	215
1769	LEGION	1041	205	216
1770	ANKUR	1042	206	217
1771	PUCH	1043	206	217
1772	STREAM	1044	206	217
1773	AMERICA	1045	7	176
1774	CB 1000R	1047	7	176
1775	CB 1300	1048	7	176
1776	SUPERBLACKBIRD CBR 1100XX	1049	7	176
1777	CBR 250	1050	7	176
1778	AERO CBX 150	1052	7	176
1779	STRADA CBX 200	1053	7	176
1780	CH 125R	1054	7	176
1781	CR 85	1055	7	176
1782	GL GOLD WING	1061	7	176
1783	LEAD	1062	7	176
1784	MAGNA VF 750C	1063	7	176
1785	NX 200/250	1064	7	176
1786	NX 350 SAHARA	1066	7	176
1787	NX 400 FALCON	1067	7	176
1788	NXR BROS	1069	7	176
1789	POP 100	1070	7	176
1790	SUPER HAWK	1074	7	176
1791	TRX	1075	7	176
1792	VALKYRIE	1077	7	176
1793	VFR 1200	1078	7	176
1794	VTX	1083	7	176
1795	VARADERO XL 1000V	1084	7	176
1796	XL	1085	7	176
1797	XL 700V TRANSALP	1086	7	176
1798	XLR	1087	7	176
1799	XLX	1088	7	176
1800	VLR 350	1089	7	176
1801	XR	1091	7	176
1802	TORNADO XR 250	1092	7	176
1803	XRE 300	1094	7	176
1804	FE	1095	207	218
1805	CR	1098	208	219
1806	HUSQY	1099	208	219
1807	SM	1100	208	219
1808	SMR	1101	208	219
1809	TC	1102	208	219
1810	TE	1103	208	219
1811	WR	1104	208	219
1812	WRE	1105	208	219
1813	ACTION	1106	209	220
1814	BRAVE	1107	209	220
1815	MATRIX	1108	209	220
1816	MOVING	1109	209	220
1817	ONE	1110	209	220
1818	VINTAGE	1111	209	220
1819	WARRIOR	1112	209	220
1820	JP	1113	210	221
1821	BARHOG	1115	211	222
1822	PROSTREET	1116	211	222
1823	SPYDER	1117	211	222
1824	ATLANTIC	1118	212	223
1825	HYPE	1119	212	223
1826	JONNY	1120	212	223
1827	ORBIT	1121	212	223
1828	PEGASUS	1122	212	223
1829	QUICK	1123	212	223
1830	TR	1124	212	223
1831	TOP	1126	213	224
1832	DUAL	1127	213	224
1833	COMET GT 650	1130	133	183
1834	COMET GT-R 650	1131	133	183
1835	CRUISE	1132	133	183
1836	ERO	1134	133	183
1837	FLASH	1135	133	183
1838	FURIA	1136	133	183
1839	GF	1137	133	183
1840	MAGIK	1139	133	183
1841	MIDAS	1140	133	183
1842	MIRAGE	1141	133	183
1843	MOTOKAR	1142	133	183
1844	PRIMA	1143	133	183
1845	RX	1144	133	183
1846	SETA	1145	133	183
1847	SOFT	1146	133	183
1848	SUPER CAB	1147	133	183
1849	TN	1148	133	183
1850	WAY	1149	133	183
1851	WIN	1150	133	183
1852	AVAJET	1151	170	187
1853	CONCOURS	1152	170	187
1854	D-TRACKER	1153	170	187
1855	ER-6N	1154	170	187
1856	KLX 110/140	1156	170	187
1857	KX 100/125	1157	170	187
1858	KZ	1158	170	187
1859	MAXI	1159	170	187
1860	NINJA 250	1160	170	187
1861	VERSYS	1161	170	187
1862	VOYAGER	1162	170	187
1863	VULCAN	1163	170	187
1864	ZZR	1166	170	187
1865	DJW	1167	214	225
1866	MBOY	1168	214	225
1867	PEOPLE	1169	214	225
1868	ZING	1170	214	225
1869	AKROS	1182	215	226
1870	ERGON	1183	215	226
1871	NIX	1184	215	226
1872	MOTO TRUCK	1186	216	227
1873	QUATTOR	1187	217	228
1874	FORMIGAO	1188	218	229
1875	CARGO	1190	98	180
1876	DE LUXE	1191	219	230
1877	E RETRO	1192	219	230
1878	LY	1193	219	230
1879	TRICICLO	1194	220	231
1880	CIAK	1195	221	232
1881	SPIDER	1196	221	232
1882	DRAGO	1197	222	233
1883	EASY	1198	222	233
1884	FAST	1199	222	233
1885	SKEMA	1200	222	233
1886	VITE	1201	222	233
1887	CALIFORNIA	1202	223	234
1888	QUOTA	1203	223	234
1889	V11	1204	223	234
1890	LE MANS	1205	223	234
1891	230R	1206	224	235
1892	BRUTALE	1207	225	236
1893	F4	1208	225	236
1894	BIG FORCE	1209	226	237
1895	BLACK STAR	1210	226	237
1896	BRX	1211	226	237
1897	DUAL	1212	226	237
1898	FENIX GOLD	1213	226	237
1899	FOX	1214	226	237
1900	GO	1215	226	237
1901	HALLEY	1216	226	237
1902	FENIX	1217	226	237
1903	JURASIC	1218	226	237
1904	MA	1219	226	237
1905	SIMBA	1222	226	237
1906	SPORT	1223	226	237
1907	SPYDER	1224	226	237
1908	STREET	1225	226	237
1909	SUPER	1226	226	237
1910	XRT	1227	226	237
1911	AX	1228	227	238
1912	JC	1229	227	238
1913	QM	1230	227	238
1914	BR III	1231	228	239
1915	BUXY	1232	22	49
1916	ELYSEO	1233	22	49
1917	SCOOTELEC	1234	22	49
1918	SPEEDAKE	1235	22	49
1919	SPEEDFIGHT	1236	22	49
1920	SQUAB	1237	22	49
1921	TREKKER	1238	22	49
1922	VIVACITY	1239	22	49
1923	ZENITH	1240	22	49
1924	BEVERLY	1241	229	240
1925	LIBERTY	1242	229	240
1926	MP3	1243	229	240
1927	NRG	1244	229	240
1928	RUNNER	1245	229	240
1929	VESPA	1246	229	240
1930	ZIP	1247	229	240
1931	BLACK JACK	1248	230	241
1932	FENIX GOLD	1249	230	241
1933	GHOST	1250	230	241
1934	SPYDER	1251	230	241
1935	ENJOY	1252	231	242
1936	HUSKY	1253	231	242
1937	PASSING	1254	231	242
1938	RACING 200	1255	132	182
1939	SCROSS	1256	232	243
1940	AKROS	1257	140	186
1941	ERGON	1258	140	186
1942	FIFTY	1259	140	186
1943	HUNTER	1260	140	186
1944	MAX	1261	140	186
1945	PALIO	1262	140	186
1946	PGO	1263	140	186
1947	STX	1264	140	186
1948	STX MOTARD	1265	140	186
1949	SUPER FIFTY	1266	140	186
1950	VBLADE	1267	140	186
1951	WEB	1268	140	186
1952	WEB EVO	1269	140	186
1953	ADDRESS	1270	59	179
1954	BANDIT 250	1272	59	179
1955	BOULEVARD	1273	59	179
1956	BURGMAN AN	1274	59	179
1957	DR	1276	59	179
1958	FREEWIND 650	1278	59	179
1959	GS 500	1279	59	179
1960	GSR	1280	59	179
1961	INTRUDER	1282	59	179
1962	KATANA	1283	59	179
1963	LETS II	1284	59	179
1964	LT	1285	59	179
1965	MARAUDER GZ	1286	59	179
1966	RF	1287	59	179
1967	RM 250	1288	59	179
1968	SAVAGE	1289	59	179
1969	TL	1290	59	179
1970	VX 800	1291	59	179
1971	TRIMOTO	1292	233	244
1972	CJ	1293	234	245
1973	JH	1294	234	245
1974	JL	1295	234	245
1975	STAR 50	1296	234	245
1976	WORK 125	1297	234	245
1977	SKY 125	1298	234	245
1978	FLY 135	1299	234	245
1979	BEST	1300	234	245
1980	ADVENTURER	1301	148	152
1981	BONNEVILLE	1302	148	152
1982	DAYTONA	1303	148	152
1983	LEGEND	1304	148	152
1984	ROCKET	1305	148	152
1985	SCRAMBLER	1306	148	152
1986	SPEED TRIPLE	1307	148	152
1987	SPRINT	1308	148	152
1988	STREET TRIPLE	1309	148	152
1989	THRUXTON	1310	148	152
1990	THUNDERBIRD	1311	148	152
1991	TIGER	1312	148	152
1992	TRIDENT	1313	148	152
1993	TROPHY	1314	148	152
1994	TT-600	1315	148	152
1995	REBELLIAN	1316	235	246
1996	TRITON	1317	235	246
1997	VTHUNDER	1318	235	246
1998	WY	1319	236	247
1999	AXIS	1321	135	184
2000	BWS	1322	135	184
2001	JOG	1327	135	184
2002	MAJESTY	1328	135	184
2003	MT-03	1329	135	184
2004	NEO AT	1331	135	184
2005	RD 135	1333	135	184
2006	ROYAL STAR	1335	135	184
2007	TDM	1337	135	184
2008	TDR 180	1338	135	184
2009	TRX	1339	135	184
2010	TT-R	1340	135	184
2011	V-MAX 1200	1341	135	184
2012	WR 250F	1342	135	184
2013	XJR	1344	135	184
2014	XT 660R	1345	135	184
2015	XTZ 125	1346	135	184
2016	MIDNIGHT STAR XVS	1348	135	184
2017	YFS	1350	135	184
2018	YES EN 125	1363	59	179
2019	SHADOW	1393	7	176
2020	XM	1442	246	249
2021	LAMBRETA	1450	253	251
2022	SCOOTER	1518	269	253
2023	ATV	1967	176	189
2024	JAGUAR	1968	176	189
2025	RT	1970	176	189
2026	ZS 200	2011	281	254
2027	BW 125	2012	282	255
2028	KART	2040	254	165
2029	DREAM	2057	7	176
2030	RX	2058	135	184
2031	WALK MACHINE	2065	294	256
2032	HERO	2172	7	176
2033	NC 700X	2173	7	176
2034	DRAG STAR	2174	135	184
2035	BAIO	2220	170	187
2036	KDX	2221	170	187
2037	B-KING GSX 1300	2223	59	179
2038	125 ZS	2227	281	254
2039	SR	2285	178	191
2040	DY50	2286	194	206
2041	NAKED	2287	212	223
2042	RACER	2288	212	223
2043	TEXAS	2289	212	223
2044	CRF 110/150	2293	7	176
2045	XJ6	2316	135	184
2046	LANDER XTZ 250	2317	135	184
2047	ALBA	2327	135	184
2048	FROG	2328	135	184
2049	LIBERO	2329	135	184
2050	GLADIATOR	2330	135	184
2051	MEST	2331	135	184
2052	ECCY	2332	135	184
2053	PASSOL	2333	135	184
2054	EC-02	2334	135	184
2055	YZ 85LW	2335	135	184
2056	V-STAR	2336	135	184
2057	PAS	2338	135	184
2058	AEROX	2339	135	184
2059	MORPHOUS	2340	135	184
2060	XF50X	2341	135	184
2061	LAGEND	2343	135	184
2062	TZR	2344	135	184
2063	QT50	2345	135	184
2064	SHARK	2376	234	245
2065	FURY	2391	7	176
2066	STUNNER	2416	7	176
2067	CB 50	2417	7	176
2068	BOLDOR CB 900	2419	7	176
2069	CBF 600	2420	7	176
2070	CBR 400RR	2421	7	176
2071	CBX 1000	2423	7	176
2072	CD 125	2424	7	176
2073	ML 125	2425	7	176
2074	NSR 500	2426	7	176
2075	RC	2428	7	176
2076	PAN-EUROPEAN ST	2430	7	176
2077	TURUNA 125	2432	7	176
2078	VTR	2433	7	176
2079	AFRICA TWIN XRV 750	2436	7	176
2080	MZ 250	2437	297	257
2081	KAPRA	2438	297	257
2082	RALLYE	2439	297	257
2083	PASSEIO	2440	297	257
2084	BANDIT 400	2449	59	179
2085	BANDIT 600	2450	59	179
2086	BANDIT GSF 750	2452	59	179
2087	BANDIT 1200	2453	59	179
2088	HAYABUSA	2455	59	179
2089	INTRUDER CUSTOM	2456	59	179
2090	RV	2457	59	179
2091	SV	2458	59	179
2092	MARAUDER VZ	2459	59	179
2093	CG CARGO/JOB	2460	7	176
2094	EXPLORER	2462	27	177
2095	ELIMINATOR	2467	170	187
2096	GTR	2468	170	187
2097	KLE	2469	170	187
2098	KLR	2470	170	187
2099	SUPER SHERPA	2471	170	187
2100	ZRX	2472	170	187
2101	ZR	2473	170	187
2102	NINJA 1400	2474	170	187
2103	FS1	2475	135	184
2104	HB-50	2476	203	214
2105	PC 50	2480	7	176
2106	CG 125	2481	7	176
2107	PACIFIC COAST	2491	7	176
2108	CG TODAY	2495	7	176
2109	GT	2496	59	179
2110	FZR1000	2501	135	184
2111	GSI	2502	59	179
2112	AMAZONAS	2503	213	224
2113	CB 125	2511	7	176
2114	PHOENIX 50	2518	132	182
2115	INDIANAPOLIS 200	2519	132	182
2116	F35/F40	2520	132	182
2117	X2 250	2521	132	182
2118	MAX 150	2522	132	182
2119	NEW WAVE 125	2523	132	182
2120	EXPLORER 150	2524	132	182
2121	XS400	2525	135	184
2122	RD 350 VIUVA NEGRA	2527	135	184
2123	XY 250	2530	132	182
2124	JOB	2544	59	179
2125	RED HUNTER	2545	299	258
2126	W/NG	2546	299	258
2127	M2F	2547	299	258
2128	GOLDEN ARROW	2548	299	258
2129	AE 50	2554	59	179
2130	RODEO	2616	102	181
2131	DURO	2617	102	181
2132	DUTY	2631	7	176
2133	150	2667	340	259
2134	WAKE 500	2668	341	260
2135	OUTCROSS	2669	341	260
2136	JOY PLUS	2670	341	260
2137	PASSION	2671	341	260
2138	TREND	2672	341	260
2139	PIT BULL	2673	341	260
2140	BRUTTUS	2674	341	260
2141	UFO 50	2676	342	261
2142	LF250ST	2677	342	261
2143	FOX 150R	2678	342	261
2144	LF400ST	2679	342	261
2145	VR 150 WIND	2680	342	261
2146	HERCULES 200	2681	342	261
2147	ONIX 50R	2682	342	261
2148	HS 150 FIRE	2683	342	261
2149	JET 50	2684	132	182
2150	RETRO 50	2685	132	182
2151	NEW 50	2686	132	182
2152	EAGLE 50	2687	132	182
2153	SUPER SMART 50	2688	132	182
2154	NEW 200	2689	132	182
2155	CARGO 200	2690	132	182
2156	BRAVO 200	2691	132	182
2157	STRONG 250	2692	132	182
2158	FUTURE 150	2693	132	182
2159	KN 150	2700	343	262
2160	KN 125 S	2701	343	262
2161	KN 50 S	2702	343	262
2162	IZY 50	2703	209	220
2163	PCX	2721	7	176
2164	AIRHEAD	2762	36	178
2165	C1	2763	36	178
2166	F650GS	2764	36	178
2167	F650CS	2765	36	178
2168	F800GS	2766	36	178
2169	K75	2767	36	178
2170	K100	2768	36	178
2171	K1200R	2769	36	178
2172	K1300R	2770	36	178
2173	K1200GT	2771	36	178
2174	K1300GT	2772	36	178
2175	K1200GS	2773	36	178
2176	K1200S	2774	36	178
2177	R32	2775	36	178
2178	R51/3	2776	36	178
2179	R27	2777	36	178
2180	R60	2778	36	178
2181	R75	2779	36	178
2182	R75/5	2780	36	178
2183	R90S	2781	36	178
2184	R1200C	2782	36	178
2185	R1150GS	2783	36	178
2186	R1200RT	2784	36	178
2187	SPORTSTER	2812	204	215
2188	TOURING STREET GLIDE	2816	204	215
2189	XTZ 250 TENERE	2902	135	184
2190	XT 225	2903	135	184
2191	XT 660Z TENERE	2904	135	184
2192	XT 1200Z SUPER TENERE	2905	135	184
2193	MOBY 50	2906	234	245
2194	JOTO 135	2907	234	245
2195	MONTEZ 250	2908	234	245
2196	DUNNA 600	2909	234	245
2197	VICO	2910	234	245
2198	FAZER FZ6	2923	135	184
2199	FAZER YS150	2924	135	184
2200	FAZER FZ1	2925	135	184
2201	YZF 600R	2926	135	184
2202	YZF R6	2927	135	184
2203	CRF 230/250	2965	7	176
2204	CRF 450	2966	7	176
2205	NX 650 DOMINATOR	2968	7	176
2206	CR 250	2969	7	176
2207	CR 125	2970	7	176
2208	HB	3029	349	266
2209	OUTLANDER 400	3113	358	267
2210	OUTLANDER 500	3114	358	267
2211	OUTLANDER 650	3115	358	267
2212	OUTLANDER 800R	3116	358	267
2213	OUTLANDER MAX 400	3117	358	267
2214	OUTLANDER MAX 500	3118	358	267
2215	OUTLANDER MAX 650	3119	358	267
2216	OUTLANDER MAX 800R	3120	358	267
2217	OUTLANDER MAX LTD 800R	3121	358	267
2218	RENEGADE 500	3122	358	267
2219	RENEGADE 800R	3123	358	267
2220	DS 250	3124	358	267
2221	DS 450	3125	358	267
2222	DS 90	3126	358	267
2223	RT	3127	358	267
2224	RS	3128	358	267
2225	NINJA 1000	3129	170	187
2226	NINJA 600	3130	170	187
2227	NINJA 300	3131	170	187
2228	NINJA 1100	3132	170	187
2229	NINJA 900	3133	170	187
2230	NINJA 700	3134	170	187
2231	NINJA 1200	3135	170	187
2232	Z1000	3136	170	187
2233	Z750	3137	170	187
2234	Z800	3138	170	187
2235	VERSYS CITY	3139	170	187
2236	VERSYS GRAND TOURER	3140	170	187
2237	VERSYS TOURER	3141	170	187
2238	VERSYS 1000	3142	170	187
2239	KX 450/500	3143	170	187
2240	KX 250	3144	170	187
2241	KX 65/85	3145	170	187
2242	KLX 400/450	3146	170	187
2243	KLX 250/300	3147	170	187
2244	TMAX	3151	135	184
2245	YFM 700R	3152	135	184
2246	GRIZZLY	3153	135	184
2247	50 SX	3166	344	263
2248	65 SX	3167	344	263
2249	85 SX	3168	344	263
2250	125 SX	3169	344	263
2251	150 SX	3170	344	263
2252	250 SX	3171	344	263
2253	350 SX	3172	344	263
2254	450 SX-F	3173	344	263
2255	350 EXC	3174	344	263
2256	500 EXC	3175	344	263
2257	150 XC	3176	344	263
2258	250 XC	3177	344	263
2259	300 XC	3178	344	263
2260	450 XC-F/W	3180	344	263
2261	200 XC	3181	344	263
2262	690 ENDURO R	3183	344	263
2263	1190 ADVENTURE	3184	344	263
2264	990 SM T	3185	344	263
2265	990 ADVENTURE BAJA	3186	344	263
2266	690 DUKE	3187	344	263
2267	1190 RC8 R	3188	344	263
2268	ACX 250F	3189	359	268
2269	HOTZOO SPORT 90	3190	359	268
2270	SPORTLANDER 150R	3191	359	268
2271	SPORTLANDER 250XR	3192	359	268
2272	SPORTLANDER 350ZX	3193	359	268
2273	SPORTLANDER 450TR	3194	359	268
2274	QUADRILANDER 300	3195	359	268
2275	QUADRILANDER 400	3196	359	268
2276	QUADRILANDER 600	3197	359	268
2277	FRONTLANDER 500	3198	359	268
2278	FRONTLANDER 800 EFI	3199	359	268
2279	525 XC	3201	344	263
2280	505 SX	3202	344	263
2281	450 XC	3203	344	263
2282	450 SX	3204	344	263
2283	VENICE 50	3205	132	182
2284	LIBERTY 50	3206	132	182
2285	BIKE 50	3207	132	182
2286	JET 125	3208	132	182
2287	CUSTOM 250	3209	132	182
2288	DISCOVER 250	3210	132	182
2289	RZR 570	4362	171	188
2290	RZR 800	4363	171	188
2291	RZR 800 XC	4364	171	188
2292	RZR S 800	4365	171	188
2293	RZR 900	4366	171	188
2294	RZR XP 1000	4367	171	188
2295	RZR 4 800	4368	171	188
2296	RZR 4 900	4369	171	188
2297	RZR 4 1000	4370	171	188
2298	RANGER 6X6	4371	171	188
2299	RANGER 800	4372	171	188
2300	RANGER DIESEL	4373	171	188
2301	RANGER XP 900	4374	171	188
2302	RANGER 400	4375	171	188
2303	RANGER 570	4376	171	188
2304	RANGER 800 MIDSIZE	4377	171	188
2305	RANGER EV	4378	171	188
2306	RANGER CREW 570	4379	171	188
2307	RANGER CREW 800	4380	171	188
2308	RANGER CREW DIESEL	4381	171	188
2309	RANGER CREW 900	4382	171	188
2310	SPORTSMAN 550 EPS	4383	171	188
2311	SPORTSMAN 570	4384	171	188
2312	SPORTSMAN 400 HO	4385	171	188
2313	SPORTSMAN WV850 HO	4386	171	188
2314	SPORTSMAN XP 850	4387	171	188
2315	SPORTSMAN 800 EFI	4388	171	188
2316	SPORTSMAN BIG BOSS 6X6 800	4389	171	188
2317	SCRAMBLER XP 850 HO	4390	171	188
2318	SCRAMBLER XP 1000 EPS	4391	171	188
2319	SPORTSMAN TOURING 850	4392	171	188
2320	SPORTSMAN TOURING 570	4393	171	188
2321	SPORTSMAN TOURING 550	4394	171	188
2322	SPORTSMAN X2 550	4395	171	188
2323	PHOENIX 200	4396	171	188
2324	RZR 170	4397	171	188
2325	OUTLAW 90	4398	171	188
2326	SPORTSMAN 90	4399	171	188
2327	OUTLAW 50	4400	171	188
2328	BRUTUS	4401	171	188
2329	CROSS ROADS 8-BALL	4402	483	269
2330	CROSS ROADS CLASSIC	4403	483	269
2331	CROSS COUNTRY 8-BALL	4404	483	269
2332	CROSS COUNTRY	4405	483	269
2333	NESS CROSS COUNTRY	4406	483	269
2334	VISION TOUR	4407	483	269
2335	CROSS COUNTRY TOUR	4408	483	269
2336	CROSS COUNTRY TOUR ANNIVERSARY	4409	483	269
2337	VEGAS 8-BALL	4410	483	269
2338	HIGH-BALL	4411	483	269
2339	HAMMER 8-BALL	4412	483	269
2340	BOARDWALK	4413	483	269
2341	JACKPOT	4414	483	269
2342	JUDGE	4415	483	269
2343	ZACH NESS CROSS COUNTRY	4416	483	269
2344	HARD-BALL	4417	483	269
2345	NESS VISION	4418	483	269
2346	CORY NESS CROSS COUNTRY TOUR	4419	483	269
2347	CHIEF CLASSIC	4420	484	270
2348	CHIEF VINTAGE	4421	484	270
2349	CHIEFTAIN	4422	484	270
2350	COOL STAR 125	4459	98	180
2351	X3	4460	98	180
2352	JOJO 110	4461	98	180
2353	CC125	4462	98	180
2354	CC150	4463	98	180
2355	KP150F	4464	98	180
2356	LF100	4465	98	180
2357	PK125	4466	98	180
2358	POWER KING	4467	98	180
2359	CROSS	4468	98	180
2360	GLOW 110S	4469	98	180
2361	KP150	4470	98	180
2362	POWER MAN 250	4471	98	180
2363	HIKER	4472	98	180
2364	IV	4473	98	180
2365	STEED 250	4474	98	180
2366	TRAVELLER	4475	98	180
2367	TB125	4476	98	180
2368	PK110F	4477	98	180
2369	LF125	4478	98	180
2370	LF125	4520	98	180
2371	F2 PLUS	4914	532	271
2372	SUPER F2	4915	532	271
2373	SUPER F1	4916	532	271
2374	SUPER F3	4917	532	271
2375	BVX 125	4918	532	271
2376	BVX 130 STREET	4919	532	271
2377	BVX 150 S1	4920	532	271
2378	TR 150 D6	4921	532	271
2379	AX 200	4922	532	271
2380	BVX 200	4923	532	271
2381	BX 260	4924	532	271
2382	BR 250 D1	4925	532	271
2383	CARGO 260	4926	532	271
2384	COMET GT 250	4928	133	183
2385	COMET GT-R 250	4929	133	183
2386	RD 50	4930	135	184
2387	DT 50	4931	135	184
2388	MT-01	4932	135	184
2389	FZ-09	4933	135	184
2390	MT-07	4934	135	184
2391	FZR600	4935	135	184
2392	FZR400	4936	135	184
2393	FZR250	4937	135	184
2394	XS500	4938	135	184
2395	XS650	4939	135	184
2396	XS750	4940	135	184
2397	XS850	4941	135	184
2398	XS1100	4942	135	184
2399	SR500	4943	135	184
2400	SRX 400	4944	135	184
2401	SRX 600	4945	135	184
2402	V-MAX 1680	4946	135	184
2403	FJR1300	4947	135	184
2404	XTZ 750 SUPER TENERE	4948	135	184
2405	XT 600	4949	135	184
2406	VIRAGO 400	4950	135	184
2407	VIRAGO 535	4951	135	184
2408	VIRAGO 750	4952	135	184
2409	VIRAGO 1400	4953	135	184
2410	XZ 550	4954	135	184
2411	YZR 500	4955	135	184
2412	WR 450F	4956	135	184
2413	TZ 250	4957	135	184
2414	YZ 125	4958	135	184
2415	YZ 250	4959	135	184
2416	YZ 450	4960	135	184
2417	TX500	4961	135	184
2418	XR 180	4962	135	184
2419	TT 125	4963	135	184
2420	ER-5	4966	170	187
2421	CVO	4993	204	215
2422	ALPINA	4994	185	198
2423	APOLO	4995	185	198
2424	NEVADA	4996	185	198
2425	WINSTAR	4997	185	198
2426	ELEKTRA	4998	185	198
2427	TEXANA	4999	185	198
2428	ALTINO	5000	185	198
2429	AQUILA	5001	185	198
2430	DAYSTAR ROUTIER	5002	185	198
2431	JBC	5029	61	326
2432	N601	5030	61	326
2433	N900	5031	61	326
2434	7900	5032	124	379
2435	9000	5033	124	379
2436	914	5034	124	379
2437	R-112	5035	137	387
2438	R-142	5036	137	387
2439	T-112	5037	137	387
2440	T-142	5038	137	387
2441	180	5039	68	331
2442	INTEGRA	5040	25	296
2443	LEGEND	5041	25	296
2444	NSX	5042	25	296
2445	MARRUA	5043	27	298
2446	145	5044	28	299
2447	147	5045	28	299
2448	155	5046	28	299
2449	156	5047	28	299
2450	164	5048	28	299
2451	166	5049	28	299
2452	2300	5050	28	299
2453	SPIDER	5051	28	299
2454	HUMMER	5052	156	401
2455	AM-825	5053	16	287
2456	HI-TOPIC	5054	16	287
2457	ROCSTA	5055	16	287
2458	TOPIC	5056	16	287
2459	TOWNER	5057	16	287
2460	100	5058	32	302
2461	80	5059	32	302
2462	A1	5060	32	302
2463	A3	5061	32	302
2464	A4 SEDAN	5062	32	302
2465	A5 COUPE	5063	32	302
2466	A6 SEDAN	5064	32	302
2467	A7	5065	32	302
2468	A8	5066	32	302
2469	Q3	5067	32	302
2470	Q5	5068	32	302
2471	Q7	5069	32	302
2472	R8	5070	32	302
2473	RS3	5071	32	302
2474	RS4	5072	32	302
2475	RS5	5073	32	302
2476	RS6	5074	32	302
2477	S3	5075	32	302
2478	S4 SEDAN	5076	32	302
2479	S6 SEDAN	5077	32	302
2480	S8	5078	32	302
2481	TT	5079	32	302
2482	TTS	5080	32	302
2483	BUGGY	5081	157	402
2484	DEVILLE	5082	155	400
2485	ELDORADO	5083	155	400
2486	SEVILLE	5084	155	400
2487	JAVALI	5085	42	309
2488	MINI STAR FAMILY	5086	6	278
2489	MINI STAR UTILITY	5087	6	278
2490	CIELO	5088	47	313
2491	FACE	5089	47	313
2492	QQ	5090	47	313
2493	S-18	5091	47	313
2494	TIGGO	5092	47	313
2495	300C	5093	19	290
2496	CARAVAN	5094	19	290
2497	CIRRUS	5095	19	290
2498	GRAN CARAVAN	5096	19	290
2499	LE BARON	5097	19	290
2500	NEON	5098	19	290
2501	PT CRUISER	5099	19	290
2502	SEBRING	5100	19	290
2503	STRATUS	5101	19	290
2504	TOWN E COUNTRY	5102	19	290
2505	VISION	5103	19	290
2506	AIRCROSS	5104	5	277
2507	AX	5105	5	277
2508	BERLINGO	5106	5	277
2509	BX	5107	5	277
2510	C3	5108	5	277
2511	C4	5109	5	277
2512	C5	5110	5	277
2513	C6	5111	5	277
2514	C8	5112	5	277
2515	DS3	5113	5	277
2516	EVASION	5114	5	277
2517	JUMPER	5115	5	277
2518	XANTIA	5116	5	277
2519	XM	5117	5	277
2520	XSARA	5118	5	277
2521	ZX	5119	5	277
2522	CL-244	5120	50	316
2523	CL-330	5121	50	316
2524	ESPERO	5122	51	317
2525	LANOS	5123	51	317
2526	LEGANZA	5124	51	317
2527	NUBIRA	5125	51	317
2528	PRINCE	5126	51	317
2529	RACER	5127	51	317
2530	SUPER SALON	5128	51	317
2531	TICO	5129	51	317
2532	APPLAUSE	5130	52	318
2533	CHARADE	5131	52	318
2534	CUORE	5132	52	318
2535	FEROZA	5133	52	318
2536	GRAN MOVE	5134	52	318
2537	MOVE VAN	5135	52	318
2538	TERIOS	5136	52	318
2539	AVENGER	5137	18	289
2540	DAKOTA	5138	18	289
2541	JOURNEY	5139	18	289
2542	RAM	5140	18	289
2543	STEALTH	5141	18	289
2544	M-100	5142	61	326
2545	PLUTUS	5143	61	326
2546	START	5144	61	326
2547	ULC	5145	61	326
2548	ENGESA	5146	63	327
2549	CAMPER	5147	64	328
2550	MASTER	5148	64	328
2551	348	5149	10	281
2552	355	5150	10	281
2553	360	5151	10	281
2554	456	5152	10	281
2555	550	5153	10	281
2556	575M	5154	10	281
2557	612	5155	10	281
2558	CALIFORNIA	5156	10	281
2559	F430	5157	10	281
2560	F599	5158	10	281
2561	147	5159	3	275
2562	500	5160	3	275
2563	BRAVA	5161	3	275
2564	BRAVO	5162	3	275
2565	COUPE	5163	3	275
2566	DOBLO	5164	3	275
2567	DUCATO CARGO	5165	3	275
2568	DUNA	5166	3	275
2569	ELBA	5167	3	275
2570	FIORINO	5168	3	275
2571	FREEMONT	5169	3	275
2572	GRAND SIENA	5170	3	275
2573	IDEA	5171	3	275
2574	LINEA	5172	3	275
2575	MAREA	5173	3	275
2576	OGGI	5174	3	275
2577	PALIO	5175	3	275
2578	PANORAMA	5176	3	275
2579	PREMIO	5177	3	275
2580	PUNTO	5178	3	275
2581	SIENA	5179	3	275
2582	STILO	5180	3	275
2583	STRADA	5181	3	275
2584	TEMPRA	5182	3	275
2585	TIPO	5183	3	275
2586	UNO	5184	3	275
2587	AEROSTAR	5185	13	284
2588	ASPIRE	5186	13	284
2589	BELINA	5187	13	284
2590	CLUB WAGON	5188	13	284
2591	CONTOUR	5189	13	284
2592	CORCEL II	5190	13	284
2593	COURIER	5191	13	284
2594	CROWN VICTORIA	5192	13	284
2595	DEL REY	5193	13	284
2596	ECOSPORT	5194	13	284
2597	EDGE	5195	13	284
2598	ESCORT	5196	13	284
2599	EXPEDITION	5197	13	284
2600	EXPLORER	5198	13	284
2601	F-100	5199	13	284
2602	F-1000	5200	13	284
2603	F-150	5201	13	284
2604	F-250	5202	13	284
2605	FIESTA	5203	13	284
2606	FOCUS	5204	13	284
2607	FURGLAINE	5205	13	284
2608	FUSION	5206	13	284
2609	IBIZA	5207	13	284
2610	KA	5208	13	284
2611	MONDEO	5209	13	284
2612	MUSTANG	5210	13	284
2613	PAMPA	5211	13	284
2614	PROBE	5212	13	284
2615	RANGER	5213	13	284
2616	VERSAILLES ROYALE	5214	13	284
2617	TAURUS	5215	13	284
2618	THUNDERBIRD	5216	13	284
2619	TRANSIT	5217	13	284
2620	VERONA	5218	13	284
2621	VERSAILLES	5219	13	284
2622	WINDSTAR	5220	13	284
2623	A-10	5221	1	273
2624	A-20	5222	1	273
2625	AGILE	5223	1	273
2626	ASTRA	5224	1	273
2627	BLAZER	5225	1	273
2628	BONANZA	5226	1	273
2629	C-10	5227	1	273
2630	C-20	5228	1	273
2631	CALIBRA	5229	1	273
2632	CAMARO	5230	1	273
2633	CAPRICE	5231	1	273
2634	CAPTIVA	5232	1	273
2635	CARAVAN	5233	1	273
2636	CAVALIER	5234	1	273
2637	CELTA	5235	1	273
2638	CHEVY	5236	1	273
2639	CHEYNNE	5237	1	273
2640	COBALT	5238	1	273
2641	CORSA	5239	1	273
2642	CORVETTE	5240	1	273
2643	CRUZE	5241	1	273
2644	D-10	5242	1	273
2645	D-20	5243	1	273
2646	IPANEMA	5244	1	273
2647	KADETT	5245	1	273
2648	LUMINA	5246	1	273
2649	MALIBU	5247	1	273
2650	MERIVA	5248	1	273
2651	MONTANA	5249	1	273
2652	OMEGA	5250	1	273
2653	OPALA	5251	1	273
2654	PRISMA	5252	1	273
2655	S10	5253	1	273
2656	SILVERADO	5254	1	273
2657	SONIC	5255	1	273
2658	SONOMA	5256	1	273
2659	SPACEVAN	5257	1	273
2660	SS10	5258	1	273
2661	SUBURBAN	5259	1	273
2662	SYCLONE	5260	1	273
2663	TIGRA	5261	1	273
2664	TRACKER	5262	1	273
2665	TRAFIC	5263	1	273
2666	VECTRA	5264	1	273
2667	VERANEIO	5265	1	273
2668	ZAFIRA	5266	1	273
2669	HOVER	5267	75	336
2670	BR-800	5268	17	288
2671	CARAJAS	5269	17	288
2672	TOCANTINS	5270	17	288
2673	XAVANTE	5271	17	288
2674	VIP	5272	17	288
2675	TOWNER	5273	76	337
2676	ACCORD	5274	7	279
2677	CITY	5275	7	279
2678	CIVIC	5276	7	279
2679	CR-V	5277	7	279
2680	FIT	5278	7	279
2681	ODYSSEY	5279	7	279
2682	PASSPORT	5280	7	279
2683	PRELUDE	5281	7	279
2684	ACCENT	5282	14	285
2685	ATOS	5283	14	285
2686	AZERA	5284	14	285
2687	COUPE	5285	14	285
2688	ELANTRA	5286	14	285
2689	EXCEL	5287	14	285
2690	GALLOPER	5288	14	285
2691	GENESIS	5289	14	285
2692	H1	5290	14	285
2693	H100	5291	14	285
2694	I30	5292	14	285
2695	IX35	5293	14	285
2696	MATRIX	5294	14	285
2697	PORTER	5295	14	285
2698	SANTA FE	5296	14	285
2699	SCOUPE	5297	14	285
2700	SONATA	5298	14	285
2701	TERRACAN	5299	14	285
2702	TRAJET	5300	14	285
2703	TUCSON	5301	14	285
2704	VELOSTER	5302	14	285
2705	VERACRUZ	5303	14	285
2706	J3	5304	15	286
2707	J5	5305	15	286
2708	J6	5306	15	286
2709	DAIMLER	5307	86	343
2710	S-TYPE	5308	86	343
2711	X-TYPE	5309	86	343
2712	MODELOS XJ	5310	86	343
2713	MODELOS XK	5311	86	343
2714	CHEROKEE	5312	87	344
2715	COMMANDER	5313	87	344
2716	COMPASS	5314	87	344
2717	GRAND CHEROKEE	5315	87	344
2718	WRANGLER	5316	87	344
2719	TOPIC VAN	5317	88	345
2720	JIPE MONTEZ	5318	89	346
2721	PICAPE MONTEZ	5319	89	346
2722	BESTA	5320	16	287
2723	BONGO	5321	16	287
2724	CADENZA	5322	16	287
2725	CARENS	5323	16	287
2726	CARNIVAL	5324	16	287
2727	CERATO	5325	16	287
2728	CERES	5326	16	287
2729	CLARUS	5327	16	287
2730	MAGENTIS	5328	16	287
2731	MOHAVE	5329	16	287
2732	OPIRUS	5330	16	287
2733	OPTIMA	5331	16	287
2734	PICANTO	5332	16	287
2735	SEPHIA	5333	16	287
2736	SHUMA	5334	16	287
2737	SORENTO	5335	16	287
2738	SOUL	5336	16	287
2739	SPORTAGE	5337	16	287
2740	LAIKA	5338	94	351
2741	NIVA	5339	94	351
2742	SAMARA	5340	94	351
2743	GALLARDO	5341	12	283
2744	MURCIELAGO	5342	12	283
2745	DEFENDER	5343	96	353
2746	DISCOVERY	5344	96	353
2747	FREELANDER	5345	96	353
2748	NEW RANGE	5346	96	353
2749	RANGE ROVER	5347	96	353
2750	ES	5348	97	354
2751	GS	5349	97	354
2752	IS-300	5350	97	354
2753	LS	5351	97	354
2754	RX	5352	97	354
2755	SC	5353	97	354
2756	320	5354	98	355
2757	620	5355	98	355
2758	H1	5356	100	357
2759	ELAN	5357	101	358
2760	ESPRIT	5358	101	358
2761	SCORPIO	5359	102	359
2762	222	5360	104	360
2763	228	5361	104	360
2764	3200	5362	104	360
2765	430	5363	104	360
2766	COUPE	5364	104	360
2767	GHIBLI	5365	104	360
2768	GRANCABRIO	5366	104	360
2769	GRANSPORT	5367	104	360
2770	GRANTURISMO	5368	104	360
2771	QUATTROPORTE	5369	104	360
2772	SHAMAL	5370	104	360
2773	SPIDER	5371	104	360
2774	PICK-UP	5372	106	361
2775	323	5373	108	363
2776	626	5374	108	363
2777	929	5375	108	363
2778	B-2500	5376	108	363
2779	B2200	5377	108	363
2780	MILLENIA	5378	108	363
2781	MPV	5379	108	363
2782	MX-3	5380	108	363
2783	MX-5	5381	108	363
2784	NAVAJO	5382	108	363
2785	PROTEGE	5383	108	363
2786	RX	5384	108	363
2787	CLASSE A	5385	4	276
2788	CLASSE B	5386	4	276
2789	CLASSE R	5387	4	276
2790	CLASSE GLK	5388	4	276
2791	SPRINTER	5389	4	276
2792	MYSTIQUE	5390	110	365
2793	SABLE	5391	110	365
2794	550	5392	112	367
2795	MG6	5393	112	367
2796	COOPER	5394	113	368
2797	ONE	5395	113	368
2798	3000	5396	111	366
2799	AIRTREK	5397	111	366
2800	ASX	5398	111	366
2801	COLT	5399	111	366
2802	DIAMANT	5400	111	366
2803	ECLIPSE	5401	111	366
2804	EXPO	5402	111	366
2805	GALANT	5403	111	366
2806	GRANDIS	5404	111	366
2807	L200	5405	111	366
2808	L300	5406	111	366
2809	LANCER	5407	111	366
2810	MIRAGE	5408	111	366
2811	MONTERO	5409	111	366
2812	OUTLANDER	5410	111	366
2813	PAJERO	5411	111	366
2814	SPACE WAGON	5412	111	366
2815	BG-TRUCK	5413	114	369
2816	350Z	5414	43	310
2817	ALTIMA	5415	43	310
2818	AX	5416	43	310
2819	D-21	5417	43	310
2820	FRONTIER	5418	43	310
2821	KING-CAB	5419	43	310
2822	LIVINA	5420	43	310
2823	MARCH	5421	43	310
2824	MAXIMA	5422	43	310
2825	MURANO	5423	43	310
2826	NX	5424	43	310
2827	PATHFINDER	5425	43	310
2828	PRIMERA	5426	43	310
2829	QUEST	5427	43	310
2830	SENTRA	5428	43	310
2831	STANZA	5429	43	310
2832	180SX	5430	43	310
2833	TERRANO	5431	43	310
2834	TIIDA	5432	43	310
2835	VERSA	5433	43	310
2836	X-TRAIL	5434	43	310
2837	XTERRA	5435	43	310
2838	ZX	5436	43	310
2839	106	5437	22	293
2840	205	5438	22	293
2841	206	5439	22	293
2842	207	5440	22	293
2843	3008	5441	22	293
2844	306	5442	22	293
2845	307	5443	22	293
2846	308	5444	22	293
2847	405	5445	22	293
2848	406	5446	22	293
2849	407	5447	22	293
2850	408	5448	22	293
2851	504	5449	22	293
2852	505	5450	22	293
2853	508	5451	22	293
2854	605	5452	22	293
2855	607	5453	22	293
2856	806	5454	22	293
2857	807	5455	22	293
2858	BOXER	5456	22	293
2859	HOGGAR	5457	22	293
2860	PARTNER	5458	22	293
2861	RCZ	5459	22	293
2862	GRAN VOYAGER	5460	123	378
2863	SUNDANCE	5461	123	378
2864	TRANS-AM	5462	69	332
2865	TRANS-SPORT	5463	69	332
2866	911	5464	70	333
2867	BOXSTER	5465	70	333
2868	CAYENNE	5466	70	333
2869	CAYMAN	5467	70	333
2870	PANAMERA	5468	70	333
2871	21 SEDAN	5469	24	295
2872	CLIO	5470	24	295
2873	DUSTER	5471	24	295
2874	EXPRESS	5472	24	295
2875	FLUENCE	5473	24	295
2876	KANGOO	5474	24	295
2877	LAGUNA	5475	24	295
2878	LOGAN	5476	24	295
2879	MASTER	5477	24	295
2880	MEGANE	5478	24	295
2881	SAFRANE	5479	24	295
2882	SANDERO	5480	24	295
2883	SCENIC	5481	24	295
2884	SYMBOL	5482	24	295
2885	TRAFIC	5483	24	295
2886	TWINGO	5484	24	295
2887	9000	5485	137	387
2888	SL-2	5486	162	405
2889	CORDOBA	5487	130	384
2890	IBIZA	5488	130	384
2891	INCA	5489	130	384
2892	FORTWO	5490	142	390
2893	ACTYON SPORTS	5491	21	292
2894	CHAIRMAN	5492	21	292
2895	ISTANA	5493	21	292
2896	KORANDO	5494	21	292
2897	KYRON	5495	21	292
2898	MUSSO	5496	21	292
2899	REXTON	5497	21	292
2900	FORESTER	5498	8	280
2901	IMPREZA	5499	8	280
2902	LEGACY	5500	8	280
2903	OUTBACK	5501	8	280
2904	SVX	5502	8	280
2905	TRIBECA	5503	8	280
2906	VIVIO	5504	8	280
2907	BALENO	5505	59	324
2908	GRAND VITARA	5506	59	324
2909	IGNIS	5507	59	324
2910	JIMNY	5508	59	324
2911	SUPER CARRY	5509	59	324
2912	SWIFT	5510	59	324
2913	SX4	5511	59	324
2914	VITARA	5512	59	324
2915	WAGON R	5513	59	324
2916	STARK	5514	146	394
2917	AVALON	5515	23	294
2918	BANDEIRANTE	5516	23	294
2919	CAMRY	5517	23	294
2920	CELICA	5518	23	294
2921	COROLLA	5519	23	294
2922	CORONA	5520	23	294
2923	HILUX	5521	23	294
2924	LAND CRUISER	5522	23	294
2925	MR-2	5523	23	294
2926	PASEO	5524	23	294
2927	PREVIA	5525	23	294
2928	RAV4	5526	23	294
2929	SUPRA	5527	23	294
2930	PANTANAL	5528	149	397
2931	T-4	5529	149	397
2932	400 SERIES	5530	53	319
2933	850	5531	53	319
2934	900 SERIES	5532	53	319
2935	AMAROK	5533	2	274
2936	APOLLO	5534	2	274
2937	BORA	5535	2	274
2938	CARAVELLE	5536	2	274
2939	CORRADO	5537	2	274
2940	EOS	5538	2	274
2941	EUROVAN	5539	2	274
2942	FOX	5540	2	274
2943	FUSCA	5541	2	274
2944	GOL	5542	2	274
2945	GOLF	5543	2	274
2946	JETTA	5544	2	274
2947	KOMBI	5545	2	274
2948	LOGUS	5546	2	274
2949	PARATI	5547	2	274
2950	PASSAT	5548	2	274
2951	POINTER	5549	2	274
2952	POLO	5550	2	274
2953	SANTANA	5551	2	274
2954	SAVEIRO	5552	2	274
2955	SPACEFOX	5553	2	274
2956	TIGUAN	5554	2	274
2957	TOUAREG	5555	2	274
2958	VOYAGE	5556	2	274
2959	ZDX	5557	25	296
2960	140	5558	3	275
2961	BRASILIA	5559	2	274
2962	BRASILVAN	5560	13	284
2963	CORCEL	5561	13	284
2964	PALIO WEEKEND	5562	3	275
2965	FOCUS SEDAN	5563	13	284
2966	FIESTA SEDAN	5564	13	284
2967	FIESTA TRAIL	5565	13	284
2968	207 SW	5566	22	293
2969	ESCORT SW	5567	13	284
2970	307 SEDAN	5568	22	293
2971	307 SW	5569	22	293
2972	C4 PALLAS	5570	5	277
2973	C4 PICASSO	5571	5	277
2974	C4 VTR	5572	5	277
2975	CLIO SEDAN	5573	24	295
2976	COROLLA FIELDER	5574	23	294
2977	HILUX SW4	5575	23	294
2978	MEGANE GRAND TOUR	5576	24	295
2979	SANDERO STEPWAY	5577	24	295
2980	XSARA PICASSO	5578	5	277
2981	COLHEITADEIRA	5579	131	385
2982	PICKUP F75	5580	158	403
2983	X12	5581	17	288
2984	BEL AIR	5582	1	273
2985	RX	5583	36	305
2986	C-14	5584	1	273
2987	SRX4	5585	155	400
2988	C-15	5586	1	273
2989	BRASIL	5587	1	273
2990	POLARA	5588	18	289
2991	600	5589	3	275
2992	F-01	5590	13	284
2993	FALCON	5591	13	284
2994	GALAXIE	5592	13	284
2995	MAVERICK	5593	13	284
2996	MODELO A	5594	13	284
2997	NEW FIESTA	5595	13	284
2998	LINHA FX	5596	82	341
2999	GTS	5597	124	379
3000	H3	5598	80	340
3001	PRIME	5599	14	285
3002	TIBURON	5600	14	285
3003	JEEP	5601	87	344
3004	CJ5	5602	87	344
3005	TC	5603	239	408
3006	CLASSE CLC	5604	4	276
3007	CLASSE CLS	5605	4	276
3008	MONTEREY	5606	110	365
3009	TOPSPORT	5607	114	369
3010	TARGA	5608	114	369
3011	X8	5609	114	369
3012	370Z	5610	43	310
3013	GTB	5611	124	379
3014	GTC	5612	124	379
3015	GTE	5613	124	379
3016	AUSTIN	5614	115	370
3017	7TL	5615	24	295
3018	19	5616	24	295
3019	CONVERSÍVEL	5617	175	407
3020	SUPERMINI	5618	17	288
3021	TL	5619	2	274
3022	TOPOLINO	5620	3	275
3023	SR5	5621	23	294
3024	VITZ	5622	23	294
3025	VARIANT	5623	2	274
3026	CANDANGO	5624	57	323
3027	SP2	5625	2	274
3028	RECORB	5626	258	410
3029	POLAUTO	5627	2	274
3030	GORDINI	5628	24	295
3031	MINX	5629	265	412
3032	ETIOS	5630	23	294
3033	ONIX	5631	1	273
3034	HB20	5632	14	285
3035	330	5633	36	305
3036	520	5634	36	305
3037	730	5635	36	305
3038	M1	5636	36	305
3039	SERIE Z	5637	36	305
3040	CLASSE SLK	5638	4	276
3041	CLASSE C	5639	4	276
3042	CLASSE E	5640	4	276
3043	CLASSE CL	5641	4	276
3044	CLASSE CLK	5642	4	276
3045	CLASSE S	5643	4	276
3046	CLASSE SL	5644	4	276
3047	CLASSE SLS	5645	4	276
3048	CLASSE G	5646	4	276
3049	CLASSE GL	5647	4	276
3050	CLASSE M	5648	4	276
3051	1500	5649	288	413
3052	EQUUS	5650	14	285
3053	350 GT	5651	12	283
3054	400 GT	5652	12	283
3055	MIURA	5653	12	283
3056	ISLERO	5654	12	283
3057	ESPADA	5655	12	283
3058	COUNTACH	5656	12	283
3059	DIABLO	5657	12	283
3060	ZAGATO	5658	12	283
3061	ALAR	5659	12	283
3062	LM002	5660	12	283
3063	REVENTON	5661	12	283
3064	ANKONIAN	5662	12	283
3065	AVENTADOR	5663	12	283
3066	SESTO ELEMENTO	5664	12	283
3067	J3 TURIN	5665	15	286
3068	J2	5666	15	286
3069	SANDERO GT	5667	24	295
3070	SPIN	5668	1	273
3071	TRAILBLAZER	5669	1	273
3072	C3 PICASSO	5670	5	277
3073	GRAND C4 PICASSO	5671	5	277
3074	JUMPER MINIBUS	5672	5	277
3075	JUMPER VETRATO	5673	5	277
3076	207 SEDAN	5674	22	293
3077	207 QUIKSILVER	5675	22	293
3078	207 ESCAPADE	5676	22	293
3079	308 CC	5677	22	293
3080	BOXER PASSAGEIRO	5678	22	293
3081	NEW FIESTA SEDAN	5679	13	284
3082	TRANSIT PASSAGEIRO	5680	13	284
3083	TRANSIT CHASSI	5681	13	284
3084	A4 AVANT	5682	32	302
3085	S4 AVANT	5683	32	302
3086	A5 SPORTBACK	5684	32	302
3087	A5 CABRIOLET	5685	32	302
3088	S5 COUPE	5686	32	302
3089	S5 SPORTBACK	5687	32	302
3090	S5 CABRIOLET	5688	32	302
3091	A6 AVANT	5689	32	302
3092	A6 ALLROAD	5690	32	302
3093	S6 AVANT	5691	32	302
3094	S7	5692	32	302
3095	TT ROADSTER	5693	32	302
3096	TT RS	5694	32	302
3097	TT RS ROADSTER	5695	32	302
3098	TTS ROADSTER	5696	32	302
3099	R8 SPYDER	5697	32	302
3100	R8 GT	5698	32	302
3101	R8 GT SPYDER	5699	32	302
3102	F12	5700	10	281
3103	458 SPIDER	5701	10	281
3104	458 ITALIA	5702	10	281
3105	FF	5703	10	281
3106	599	5704	10	281
3107	SA	5705	10	281
3108	CHALLENGE	5706	10	281
3109	SUPERAMERICA	5707	10	281
3110	F430 SPIDER	5708	10	281
3111	430	5709	10	281
3112	612 SESSANTA	5710	10	281
3113	599 GTB	5711	10	281
3114	SCUDERIA SPIDER	5712	10	281
3115	512	5713	10	281
3116	456 GT	5714	10	281
3117	348 GTS	5715	10	281
3118	348 SPIDER	5716	10	281
3119	F355	5717	10	281
3120	F355 SPIDER	5718	10	281
3121	F50	5719	10	281
3122	355 SPIDER	5720	10	281
3123	360 MODENA	5721	10	281
3124	PAJERO FULL	5722	111	366
3125	PAJERO DAKAR	5723	111	366
3126	PAJERO TR4	5724	111	366
3127	LANCER SPORTBACK	5725	111	366
3128	LANCER EVOLUTION	5726	111	366
3129	L200 TRITON SAVANA	5727	111	366
3130	L200 TRITON	5728	111	366
3131	LIVINA X-GEAR	5729	43	310
3132	GRAND LIVINA	5730	43	310
3133	NEW ACTYON SPORTS	5731	21	292
3134	PRIUS	5732	23	294
3135	SPORT	5733	114	369
3136	MTS	5734	114	369
3137	SPIDER	5735	114	369
3138	KABRIO	5736	114	369
3139	SAGA	5737	114	369
3140	SAGA II	5738	114	369
3141	787	5739	114	369
3142	X11	5740	114	369
3143	GAIOLA	5741	295	414
3144	NITRO	5742	18	289
3145	CHALLENGER	5743	18	289
3146	DART	5744	18	289
3147	LE BARON	5745	18	289
3148	CORDOBA	5746	18	289
3149	CHARGER	5747	18	289
3150	WINDSOR	5748	19	290
3151	CROSSFIRE	5749	19	290
3152	CORDOBA	5750	19	290
3153	ESCALADE	5751	155	400
3154	RIVIERA	5752	41	308
3155	COUPE	5753	41	308
3156	CENTURY	5754	41	308
3157	APOLLO	5755	41	308
3158	CENTURION	5756	41	308
3159	EIGHT	5757	41	308
3160	ELECTRA	5758	41	308
3161	ESTATE WAGON	5759	41	308
3162	GRAN SPORT	5760	41	308
3163	GSX	5761	41	308
3164	INVICTA	5762	41	308
3165	LESABRE	5763	41	308
3166	LIMITED	5764	41	308
3167	PARK AVENUE	5765	41	308
3168	RAINIER	5766	41	308
3169	REATTA	5767	41	308
3170	REGAL	5768	41	308
3171	RENDEZVOUS	5769	41	308
3172	ROADMASTER	5770	41	308
3173	ROYAUM	5771	41	308
3174	SKYHAWK	5772	41	308
3175	SKYLARK	5773	41	308
3176	SOMERSET	5774	41	308
3177	SPECIAL	5775	41	308
3178	SPORT WAGON	5776	41	308
3179	SUPER	5777	41	308
3180	TERRAZA	5778	41	308
3181	WILDCAT	5779	41	308
3182	LACROSSE	5780	41	308
3183	ENCLAVE	5781	41	308
3184	GL8	5782	41	308
3185	HRV	5783	41	308
3186	LUCERNE	5784	41	308
3187	SIERRA	5785	13	284
3188	BROUGHAM	5786	51	317
3189	CHAIRMAN	5787	51	317
3190	DAMAS	5788	51	317
3191	GENTRA	5789	51	317
3192	MAEPSY	5790	51	317
3193	ISTANA	5791	51	317
3194	KALOS	5792	51	317
3195	KORANDO	5793	51	317
3196	LACETTI	5794	51	317
3197	LEMANS	5795	51	317
3198	MATIZ	5796	51	317
3199	MUSSO	5797	51	317
3200	NEXIA	5798	51	317
3201	REZZO	5799	51	317
3202	ROYALE PRINCE	5800	51	317
3203	ROYALE SALON	5801	51	317
3204	STATESMAN	5802	51	317
3205	TOSCA	5803	51	317
3206	WINSTORM	5804	51	317
3207	RURAL	5805	158	403
3208	D100	5806	18	289
3209	170	5807	4	276
3210	CUSTOM ROYAL	5808	18	289
3211	CLUB COUPE	5809	1	273
3212	MAGNUM	5810	18	289
3213	GMC 100	5811	1	273
3214	SOLSTICE	5812	69	332
3215	ITAMARATY	5813	158	403
3216	MARK V	5814	86	343
3217	GT	5815	124	379
3218	CHAMPION	5816	145	393
3219	BALILLA	5817	3	275
3220	INTERLAGOS	5818	158	403
3221	X15	5819	17	288
3222	F-85	5820	13	284
3223	SPEEDSTER 356	5821	70	333
3224	TOPIC FURGAO	5822	88	345
3225	TOPIC ESCOLAR	5823	88	345
3226	300D	5824	4	276
3227	CLASSE TE	5825	4	276
3228	T-100	5826	23	294
3229	MEGANE SEDAN	5827	24	295
3230	A4 CABRIOLET	5828	32	302
3231	LINHA G	5829	82	341
3232	LINHA G COUPE	5830	82	341
3233	LINHA G CONVERSIVEL	5831	82	341
3234	LINHA M	5832	82	341
3235	LINHA EX	5833	82	341
3236	LINHA JX	5834	82	341
3237	LINHA QX	5835	82	341
3238	MODELOS XF	5836	86	343
3239	F-TYPE	5837	86	343
3240	MARK VII	5838	86	343
3241	MARK VIII	5839	86	343
3242	MARK IX	5840	86	343
3243	MARK X	5841	86	343
3244	E-TYPE	5842	86	343
3245	C-TYPE	5843	86	343
3246	D-TYPE	5844	86	343
3247	MARK I	5845	86	343
3248	MARK II	5846	86	343
3249	GT4R	5847	124	379
3250	SPYDER	5848	124	379
3251	GTI	5849	124	379
3252	AM1	5850	124	379
3253	AM2	5851	124	379
3254	AM3	5852	124	379
3255	AM4	5853	124	379
3256	AMV	5854	124	379
3257	ACTY	5855	7	279
3258	AIRWAVE	5856	7	279
3259	ASCOT	5857	7	279
3260	BALLADE	5858	7	279
3261	BEAT	5859	7	279
3262	CR-X	5860	7	279
3263	CONCERTO	5861	7	279
3264	CR-Z	5862	7	279
3265	DOMANI	5863	7	279
3266	EDIX	5864	7	279
3267	ELEMENT	5865	7	279
3268	EV PLUS	5866	7	279
3269	FCX	5867	7	279
3270	FR-V	5868	7	279
3271	HR-V	5869	7	279
3272	HSC	5870	7	279
3273	INSIGHT	5871	7	279
3274	TL	5872	25	296
3275	LIFE DUNK	5873	7	279
3276	LOGO	5874	7	279
3277	MOBILIO	5875	7	279
3278	MDX	5876	25	296
3279	ORTHIA	5877	7	279
3280	PARTNER VAN	5878	7	279
3281	PILOT	5879	7	279
3282	RIDGELINE	5880	7	279
3283	S2000	5881	7	279
3284	S600	5882	7	279
3285	S500	5883	7	279
3286	S800	5884	7	279
3287	STEPWGN	5885	7	279
3288	STREAM	5886	7	279
3289	THATS	5887	7	279
3290	VAMOZ	5888	7	279
3291	Z	5889	7	279
3292	ZEST	5890	7	279
3293	AERIO	5891	59	324
3294	ALTO	5892	59	324
3295	APV	5893	59	324
3296	KEI	5894	59	324
3297	LAPIN	5895	59	324
3298	MR WAGON	5896	59	324
3299	XL-7	5897	59	324
3300	VERONA	5898	59	324
3301	JEEP CJ	5899	158	403
3302	306 CABRIOLET	5900	22	293
3303	BELCAR	5901	57	323
3304	M715	5902	90	347
3305	407 SW	5903	22	293
3306	307 CC	5904	22	293
3307	STYLELINE	5905	1	273
3308	ANGLIA	5906	13	284
3309	GT2	5907	26	297
3310	YUKON	5908	1	273
3311	SPORTSMAN	5909	54	320
3312	21 NEVADA	5910	24	295
3313	VEYRON	5911	11	282
3314	ENZO	5912	10	281
3315	306 SW	5913	22	293
3316	TI 80	5914	28	299
3317	SPYDER 550	5915	70	333
3318	380 GTB	5916	10	281
3319	T-5	5917	149	397
3320	KINGSWAY	5918	18	289
3321	SSR	5919	1	273
3322	IMPALA	5920	1	273
3323	208	5921	22	293
3324	GRAND BLAZER	5922	1	273
3325	100 SERIES	5923	53	319
3326	200 SERIES	5924	53	319
3327	300 SERIES	5925	53	319
3328	66	5926	53	319
3329	700 SERIES	5927	53	319
3330	AMAZON	5928	53	319
3331	C303	5929	53	319
3332	DUETT	5930	53	319
3333	L3314	5931	53	319
3334	OV 4	5932	53	319
3335	P1800	5933	53	319
3336	SUGGA	5934	53	319
3337	TT	5935	13	284
3338	ONCE	5936	5	277
3339	DE LUXE	5937	13	284
3340	CUSTOM	5938	13	284
3341	T-BUCKET	5939	13	284
3342	G15	5940	17	288
3343	PAJERO FULL 3D	5941	111	366
3344	PAJERO SPORT	5942	111	366
3345	120 CABRIO	5943	36	305
3346	320 TOURING	5944	36	305
3347	330 CABRIO	5945	36	305
3348	SERIE 5 TOURING	5946	36	305
3349	SERIE 6 CABRIO	5947	36	305
3350	SERIE M CONVERSIVEL	5948	36	305
3351	M5 TOURING	5949	36	305
3352	SERIE Z ROADSTER	5950	36	305
3353	KA SPORT	5951	13	284
3354	CC	5952	2	274
3355	CERATO KOUP	5953	16	287
3356	ASTRO	5954	1	273
3357	COROLLA XRS	5955	23	294
3358	ETIOS SEDAN	5956	23	294
3359	FREESTYLE	5957	13	284
3360	COUGAR	5958	110	365
3361	XUV 500	5959	102	359
3362	XYLO	5960	102	359
3363	BOLERO	5961	102	359
3364	THAR	5962	102	359
3365	AXE	5963	102	359
3366	LEGEND	5964	102	359
3367	CJ3	5965	87	344
3368	ARMADA	5966	102	359
3369	CHASSI	5967	102	359
3370	SCORPIO PICK-UP	5968	102	359
3371	STAR TRUCK	5969	6	278
3372	STAR	5970	6	278
3373	STAR VAN CARGO	5971	6	278
3374	STAR VAN PASSAGEIROS	5972	6	278
3375	ALVORADA	5973	141	389
3376	CHAMBORD	5974	141	389
3377	PROFISSIONAL	5975	141	389
3378	VEDETTE	5976	141	389
3379	ARONDE	5977	141	389
3380	1200S	5978	141	389
3381	1000	5979	141	389
3382	HB20X	5980	14	285
3383	HB20S	5981	14	285
3384	MONZA	5982	1	273
3385	CHEVETTE	5983	1	273
3386	X60	5984	98	355
3387	TRAX	5985	1	273
3388	118	5986	36	305
3389	120	5987	36	305
3390	130	5988	36	305
3391	BAVARIA	5989	36	305
3392	C-2800	5990	36	305
3393	318	5991	36	305
3394	320	5992	36	305
3395	318 CABRIO	5993	36	305
3396	325 CABRIO	5994	36	305
3397	530	5995	36	305
3398	540	5996	36	305
3399	550	5997	36	305
3400	740	5998	36	305
3401	750	5999	36	305
3402	760	6000	36	305
3403	MATRIX 4X4	6001	341	416
3404	A7	6002	132	386
3405	A9	6003	132	386
3406	A9 CARGO	6004	132	386
3407	T20	6005	132	386
3408	T20 BAU	6006	132	386
3409	T22	6007	132	386
3410	SUPER 90 COUPE	6008	64	328
3411	X20	6009	17	288
3412	ITAIPU	6010	17	288
3413	G800	6011	17	288
3414	XEF	6012	17	288
3415	MOTOMACHINE	6013	17	288
3416	BUGATO	6014	17	288
3417	QT	6015	17	288
3418	CAICARA	6016	57	323
3419	CARCARA	6017	57	323
3420	FISSORE	6018	57	323
3421	MALZONI	6019	57	323
3422	VEMAGUET	6020	57	323
3423	C4 LOUNGE	6021	5	277
3424	CX-7	6022	108	363
3425	TR	6023	147	395
3426	LUCENA	6024	147	395
3427	SEVETSE	6025	147	395
3428	RAGGE	6026	147	395
3429	C70	6027	53	319
3430	C30	6028	53	319
3431	544	6029	53	319
3432	S40	6030	53	319
3433	S60	6031	53	319
3434	S70	6032	53	319
3435	S80	6033	53	319
3436	V40	6034	53	319
3437	V50	6035	53	319
3438	V60	6036	53	319
3439	V70	6037	53	319
3440	S90	6038	53	319
3441	XC60	6039	53	319
3442	XC70	6040	53	319
3443	XC90	6041	53	319
3444	P1900	6042	53	319
3445	PV36	6043	53	319
3446	PV444	6044	53	319
3447	PV544	6045	53	319
3448	PV51	6046	53	319
3449	PV654	6047	53	319
3450	C50	6048	53	319
3451	190	6049	4	276
3452	CLASSE CLA	6050	4	276
3453	CLASSE V	6051	4	276
3454	VANEO	6052	4	276
3455	CITAN	6053	4	276
3456	VARIO	6054	4	276
3457	CLASSE S CLASSICO	6055	4	276
3458	J3S	6056	15	286
3459	PICK-UP	6057	345	417
3460	VAN	6058	345	417
3461	C3 SOLARIS	6059	5	277
3462	C3 XTR	6060	5	277
3463	C4 SOLARIS	6061	5	277
3464	C5 BREAK/TOURER	6062	5	277
3465	XSARA BREAK	6063	5	277
3466	XSARA VTS	6064	5	277
3467	XANTIA BREAK	6065	5	277
3468	XM BREAK	6066	5	277
3469	C15	6067	5	277
3470	NEMO	6068	5	277
3471	VISA	6069	5	277
3472	C1	6070	5	277
3473	C2	6071	5	277
3474	C3 PLURIEL	6072	5	277
3475	DS4	6073	5	277
3476	DS5	6074	5	277
3477	JUMPY	6075	5	277
3478	C-CROSSER	6076	5	277
3479	C35	6077	5	277
3480	C25	6078	5	277
3481	CX	6079	5	277
3482	CX BREAK	6080	5	277
3483	AXEL	6081	5	277
3484	DYANE	6082	5	277
3485	GS/GSA	6083	5	277
3486	GS/GSA BREAK	6084	5	277
3487	MEHARI	6085	5	277
3488	SAXO	6086	5	277
3489	SM	6087	5	277
3490	ELYSEE	6088	5	277
3491	MASTER MINIBUS	6089	24	295
3492	CELER	6090	47	313
3493	CELER SEDAN	6091	47	313
3494	CIELO SEDAN	6092	47	313
3495	A1 SPORTBACK	6093	32	302
3496	A1 QUATTRO	6094	32	302
3497	A3 SPORTBACK	6095	32	302
3498	RS4 AVANT	6096	32	302
3499	A8L W12	6097	32	302
3500	R8 V10	6098	32	302
3501	RANGER CD	6099	13	284
3502	T140	6100	15	286
3503	X1	6101	36	305
3504	X3	6102	36	305
3505	X5	6103	36	305
3506	X6	6104	36	305
3507	840	6105	36	305
3508	850	6106	36	305
3509	645	6107	36	305
3510	650	6108	36	305
3511	FIT TWIST	6109	7	279
3512	MP4	6110	346	418
3513	F1	6111	346	418
3514	MONDEO SW	6112	13	284
3515	ESCORT SEDAN	6113	13	284
3516	ESCORT CONVERSIVEL	6114	13	284
3517	MX-6	6115	108	363
3518	CORISCO	6116	1	273
3519	CHEVELLE	6117	1	273
3520	EXCURSION	6118	13	284
3521	TOURAN	6119	2	274
3522	F-10000	6120	13	284
3523	HOGGAR ESCAPADE	6121	22	293
3524	PHAETON	6122	13	284
3525	TRANSPORTER	6123	2	274
3526	GRAND BESTA	6124	16	287
3527	200SX	6125	43	310
3528	240SX	6126	43	310
3529	300M	6127	19	290
3530	300C TOURING	6128	19	290
3531	TORINO	6129	13	284
3532	VENTURE	6130	1	273
3533	FLEETLINE	6131	1	273
3534	FLEETMASTER	6132	1	273
3535	DELUXE	6133	1	273
3536	ESCORT XR3	6134	13	284
3537	MASTER	6135	1	273
3538	TORONADO	6136	120	375
3539	SIX	6137	120	375
3540	EIGHT	6138	120	375
3541	DELUXE	6139	120	375
3542	SERIES 60	6140	120	375
3543	SERIES 70	6141	120	375
3544	SERIES 80	6142	120	375
3545	SERIES 90	6143	120	375
3546	STARFIRE	6144	120	375
3547	442	6145	120	375
3548	CUTLASS	6146	120	375
3549	CUTLASS SUPREME	6147	120	375
3550	CUTLASS SALON	6148	120	375
3551	CUTLASS CALAIS	6149	120	375
3552	CUTLASS CIERA	6150	120	375
3553	CUSTOM CRUISER	6151	120	375
3554	VISTA CRUISER	6152	120	375
3555	F-85	6153	120	375
3556	FIRENZA	6154	120	375
3557	ACHIEVA	6155	120	375
3558	ALERO	6156	120	375
3559	AURORA	6157	120	375
3560	BRAVADA	6158	120	375
3561	INTRIGUE	6159	120	375
3562	SILHOUETTE	6160	120	375
3563	SUPERBIRD	6161	123	378
3564	FURY	6162	123	378
3565	SPECIAL	6163	123	378
3566	PROWLER	6164	123	378
3567	TRAIL DUSTER	6165	123	378
3568	VOYAGER	6166	123	378
3569	SCAMP	6167	123	378
3570	ARROW	6168	123	378
3571	PT50	6169	123	378
3572	PT57	6170	123	378
3573	PT81	6171	123	378
3574	PT105	6172	123	378
3575	PT125	6173	123	378
3576	EXPRESS	6174	123	378
3577	VOYAGER EXPRESSO	6175	123	378
3578	NEON	6176	123	378
3579	LASER	6177	123	378
3580	CARAVELLE	6178	123	378
3581	STATION WAGON	6179	123	378
3582	MODEL Q	6180	123	378
3583	MODEL P6	6181	123	378
3584	DB9 COUPE	6182	31	301
3585	DB9 VOLANTE	6183	31	301
3586	VIRAGE COUPE	6184	31	301
3587	RAPIDE S	6185	31	301
3588	V12 VANTAGE	6186	31	301
3589	V8 VANTAGE COUPE	6187	31	301
3590	V8 VANTAGE ROADSTER	6188	31	301
3591	V8 VANTAGE S COUPE	6189	31	301
3592	V8 VANTAGE S ROADSTER	6190	31	301
3593	VANQUISH COUPE	6191	31	301
3594	VANQUISH VOLANTE	6192	31	301
3595	V12 ZAGATO	6193	31	301
3596	DB5	6194	31	301
3597	DBS	6195	31	301
3598	DBS VOLANTE	6196	31	301
3599	CYGNET	6197	31	301
3600	ONE-77	6198	31	301
3601	DBR9	6199	31	301
3602	M3	6200	36	305
3603	M5	6201	36	305
3604	M6	6202	36	305
3605	X6 M	6203	36	305
3606	CABRIO	6204	113	368
3607	COUPE	6205	113	368
3608	ROADSTER	6206	113	368
3609	COUNTRYMAN	6207	113	368
3610	PACEMAN	6208	113	368
3611	JOHN COOPER WORKS	6209	113	368
3612	ZONDA	6210	122	377
3613	NEW XV	6211	8	280
3614	IMPREZA WRX HATCH	6212	8	280
3615	IMPREZA WRX STI HATCH	6213	8	280
3616	IMPREZA WRX STI SEDAN	6214	8	280
3617	IMPREZA WRX SEDAN	6215	8	280
3618	ETIOS CROSS	6216	23	294
3619	HURACAN	6217	12	283
3620	UP	6218	2	274
3621	FORTWO CABRIO	6219	142	390
3622	GT	6220	26	297
3623	GTL	6221	26	297
3624	GTM	6222	26	297
3625	C2	6223	26	297
3626	CRX	6224	26	297
3627	AC 2000	6225	26	297
3628	AVIATOR	6226	99	356
3629	BLACKWOOD	6227	99	356
3630	CAPRI	6228	99	356
3631	CONTINENTAL	6229	99	356
3632	LS	6230	99	356
3633	MARK	6231	99	356
3634	MARK LT	6232	99	356
3635	MKR	6233	99	356
3636	MKS	6234	99	356
3637	MKX	6235	99	356
3638	MKZ	6236	99	356
3639	NAVIGATOR	6237	99	356
3640	PREMIERE	6238	99	356
3641	TOWN CAR	6239	99	356
3642	VERSAILLES	6240	99	356
3643	ZEPHYR	6241	99	356
3644	CLASSIC	6242	1	273
3645	ACTYON	6243	21	292
3646	MARAJO	6244	1	273
3647	SUPREMA	6245	1	273
3648	NEW BEETLE	6246	2	274
3649	QUANTUM	6247	2	274
3650	CROSSFOX	6248	2	274
3651	MILLE	6249	3	275
3652	GC2	6250	534	419
3653	EC7	6251	534	419
3654	530	6252	98	355
3655	MOBI	6253	3	275
3656	TORO	6254	3	275
3657	RENEGADE	6255	87	344
3658	DUSTER OROCH	6256	24	295
3659	SANDERO RS	6257	24	295
3660	HB20R	6258	14	285
3661	GRAND SANTA FE	6259	14	285
3662	GOLF VARIANT	6260	2	274
3663	SPACE CROSS	6261	2	274
3664	2008	6262	22	293
3665	QUORIS	6263	16	287
3666	GRAND CARNIVAL	6264	16	287
3667	T8	6265	15	286
3668	T6	6266	15	286
3669	T5	6267	15	286
3670	KA SEDAN	6268	13	284
3671	FOCUS FASTBACK	6269	13	284
3672	BUXY	6270	22	293
3673	ELYSEO	6271	22	293
3674	SCOOTELEC	6272	22	293
3675	SPEEDAKE	6273	22	293
3676	SPEEDFIGHT	6274	22	293
3677	SQUAB	6275	22	293
3678	TREKKER	6276	22	293
3679	VIVACITY	6277	22	293
3680	ZENITH	6278	22	293
3681	ADVENTURER	6279	148	396
3682	BONNEVILLE	6280	148	396
3683	DAYTONA	6281	148	396
3684	LEGEND	6282	148	396
3685	ROCKET	6283	148	396
3686	SCRAMBLER	6284	148	396
3687	SPEED TRIPLE	6285	148	396
3688	SPRINT	6286	148	396
3689	STREET TRIPLE	6287	148	396
3690	THRUXTON	6288	148	396
3691	THUNDERBIRD	6289	148	396
3692	TIGER	6290	148	396
3693	TRIDENT	6291	148	396
3694	TROPHY	6292	148	396
3695	TT-600	6293	148	396
3696	KART	6294	254	409
\.


--
-- Data for Name: servicos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.servicos (serv_id, cat_serv_id, serv_nome, serv_descricao, serv_situacao) FROM stdin;
55	15	Testando novo serviço com nova categoria		t
54	15	testando novo serviço com nova categoria		t
50	10	Nova categoria teste Mota	teste	t
51	10	serviço teste mota 2	troquei a descrição	t
52	1	Lavagem Comercial	Teste da Lavegem	t
53	1	Lavagem Comercial		t
\.


--
-- Data for Name: servicos_tipo_veiculo; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.servicos_tipo_veiculo (stv_id, serv_id, tps_id, stv_preco, stv_duracao, stv_situacao) FROM stdin;
1	52	2	170.00	01:30:00	t
2	53	1	350.00	02:45:00	t
3	53	3	100.00	01:00:00	t
4	53	4	300.00	02:30:00	t
13	55	3	13.00	00:30:00	t
14	54	1	120.00	02:00:00	t
15	54	2	130.00	02:00:00	t
16	54	4	1400.00	03:00:00	t
\.


--
-- Data for Name: tipo_veiculo_servico; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tipo_veiculo_servico (tps_id, tps_nome, tps_situacao) FROM stdin;
1	Caminhao	t
2	Carro	t
3	Moto	t
4	Caminhonete	t
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.usuarios (usu_id, usu_nome, usu_cpf, usu_data_nasc, usu_sexo, usu_telefone, usu_email, usu_observ, usu_acesso, usu_senha, usu_situacao, usu_token_reset, usu_expiracao_token) FROM stdin;
1	João Silva	123.456.789-01	1990-05-12	0	(11) 98888-1111	joao.silva@email.com	Usuário ativo	t	$2b$10$hashsenha01	t	\N	\N
106	Pedro Henrique Amorim	017.303.070-00	2000-02-05	0	(14) 99449-3893	pedro.amorim@gmail.com		f	$2b$10$gLGvRKndieof0owoXBMine1V0AaMvd3grTvCb6fUhE2gsLADPwuzm	t	\N	\N
103	Luis Henrique Castro Filho	423.132.590-13	2007-03-23	0	(13) 99839-9902	luis.castro@gmail.com		f	$2b$10$KebXezjqw95IXf145i27B.Ge1sTUvtL0VBxHsi0t/MrpMUgXR4Ulu	t	\N	\N
85	Admin	426.579.380-00	2000-11-17	0	(99) 59595-9888	administrador@admin.com		t	$2b$10$PvSGrkbg49VdLhB8WLBstuXzWF3qKUZywNBjw.QbMCsdo6hIc4whG	t	\N	\N
109	Manuel Barcelos Braga	819.917.780-23	1969-09-07	0	(15) 99404-5784	manuel.barcelos@gmail.com		f	$2b$10$aOIRrzEsVkR8X4NmFWMfgeF8ofF9ybnIzwDHRMaht4ApF2BPbQu2y	t	\N	\N
110	Alex Silva Moreira de Vasconcelos	942.717.380-77	1995-07-11	0	(14) 99506-6631	alex.moreira@gmail.com	\N	f	$2b$10$mWSNWvfjVF6w4xCHK8EbJegUJ4EKh0z0APnDWPLi46vN8JX8LhuqO	t	\N	\N
108	Kevin Felipe dos Santos	746.012.740-01	1997-06-05	0	(14) 99915-0342	kevin.felipe@gmail.com	\N	f	$2b$10$u/Sr8JllXWQwxY3xKjQZOO3cDQ5UHXq6hE8LtK8hSbh5Tr4NBTKmm	f	\N	\N
113	Eduardo Silva Correa	549.870.380-56	1993-04-04	0	(14) 99948-7387	eduardo.correa@gmail.com	\N	f	$2b$10$wNV3eGdeRuOD1YezuVgV3uL1Xi.TN6AoLajr9qG77Z4oYlrdSoP0q	t	\N	\N
112	Zacarias Fernandes Rocha	985.998.890-01	1972-05-05	0	(14) 99400-4555	zacarias.rocha@gmail.com		f	$2b$10$GlB0CMssXX7kzxUoXkCsg.jOdD8Ab36ri4jyjFUAnfuaCB9giTn2u	t	\N	\N
111	Leandro Thiago Ferreira	758.044.600-64	1992-03-30	0	(18) 99348-8551	leandro.ferreira@gmail.com		f	$2b$10$S1T1AjNS3wxYqcOMwMm7fexHBnJezFmqF095C2NvgaDUnM9f12r6u	t	\N	\N
117	Nathan Silva	320.510.380-74	1993-03-04	0	(14) 99505-5389	nathan@gmail.com	Dono	f	$2b$10$8Ed8kfHAzex2hTuRJTB/Yeo0tb86YFMImCc9AaNP0WV9Wnh5oMRFy	t	\N	\N
118	Nei Junio	931.304.220-72	2000-02-20	0	(18) 99622-3545	nei.junio@gmail.com	\N	f	$2b$10$/k9xrUf8eqFtEQGmw0c8M.EpLbm8nIem2eYGjULwaJQy/VlRHa8hC	t	\N	\N
114	Nei Junio Nogueira Gomes	631.648.970-65	2003-11-17	0	(18) 99455-9595	neijunio50@gmail.com	\N	f	$2b$10$6QupQIyqhJzfI4YWu/RRqeagyKI.CptYokMkLUWPitjYcLvJsqxYa	t	\N	\N
120	Matheus Mota Tonini	064.646.190-71	1993-04-01	0	(14) 99650-9695	1motaxyz@gmail.com		f	$2b$10$LxU1L8ODtsKErokC/.Qp.OZLetCFi2bQUv.hfpoN3mqZnt9t1oKke	t	2012f260480fc8692d898b4eb9208d3f879cf62a	2026-01-10 17:05:35.052+00
\.


--
-- Data for Name: veiculo_usuario; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.veiculo_usuario (veic_usu_id, veic_id, usu_id, ehproprietario, data_inicial, data_final) FROM stdin;
2	1	1	t	2025-12-30	\N
4	5	103	f	2025-12-31	2025-12-31
1	5	111	t	2025-12-30	2025-12-31
3	5	108	t	2025-12-30	2025-12-31
8	5	112	f	2026-01-01	\N
7	5	108	f	2026-01-02	2025-12-31
6	5	108	f	2026-01-01	2025-12-31
5	5	109	t	2026-01-01	\N
9	5	111	t	2025-12-31	\N
10	7	110	t	2025-12-31	\N
11	8	106	t	2026-01-04	\N
12	7	112	t	2026-01-04	\N
13	8	112	t	2026-01-04	\N
14	10	113	t	2026-01-06	\N
15	10	103	t	2026-01-06	\N
19	10	108	t	2026-01-06	2026-01-09
18	10	111	t	2026-01-06	2026-01-09
17	10	1	t	2026-01-06	2026-01-09
16	10	112	t	2026-01-06	2026-01-09
21	11	118	t	2026-01-09	\N
20	11	114	f	2026-01-09	2026-01-11
\.


--
-- Data for Name: veiculos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.veiculos (veic_id, mod_id, veic_placa, veic_ano, veic_cor, veic_combustivel, veic_observ, veic_situacao) FROM stdin;
1	1	ABC1234	2020	Prata	Diesel	Observacoes sobre o veiculo ABC1234 - caminhao	t
7	1775	DES-1G03	2015	Preto	GASOLINA		t
9	229	GAO-3394	2010	Azul	GASOLINA		f
8	1559	ROG-2043	2021	Marrom	GASOLINA		f
5	237	AAA-444	2024	Prata	FLEX		t
10	1520	FVD-1032	2017	Amarelo	GASOLINA		t
11	1363	GUN-3912	2022	Azul	GASOLINA		t
12	551	VOV-2312	2000	Prata	GASOLINA		t
13	2655	ASD-1231	2027	Preto	DIESEL		t
\.


--
-- Name: agenda_servicos_agend_serv_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.agenda_servicos_agend_serv_id_seq', 73, true);


--
-- Name: agenda_servicos_situacao_agend_serv_situ_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.agenda_servicos_situacao_agend_serv_situ_id_seq', 5, true);


--
-- Name: agendamentos_agend_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.agendamentos_agend_id_seq', 24, true);


--
-- Name: categorias_cat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categorias_cat_id_seq', 4, true);


--
-- Name: categorias_servicos_cat_serv_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categorias_servicos_cat_serv_id_seq', 15, true);


--
-- Name: disponibilidade_disp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.disponibilidade_disp_id_seq', 12, true);


--
-- Name: indisponibilidade_indisp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.indisponibilidade_indisp_id_seq', 11, true);


--
-- Name: marcas_mar_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.marcas_mar_id_seq', 419, true);


--
-- Name: modelos_mod_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.modelos_mod_id_seq', 1, false);


--
-- Name: servicos_serv_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.servicos_serv_id_seq', 55, true);


--
-- Name: servicos_tipo_veiculo_stv_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.servicos_tipo_veiculo_stv_id_seq', 16, true);


--
-- Name: tipo_veiculo_servico_tps_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tipo_veiculo_servico_tps_id_seq', 1, false);


--
-- Name: usuarios_usu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.usuarios_usu_id_seq', 120, true);


--
-- Name: veiculo_usuario_veic_usu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.veiculo_usuario_veic_usu_id_seq', 21, true);


--
-- Name: veiculos_veic_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.veiculos_veic_id_seq', 13, true);


--
-- Name: agenda_servicos agenda_servicos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agenda_servicos
    ADD CONSTRAINT agenda_servicos_pkey PRIMARY KEY (agend_serv_id);


--
-- Name: agenda_servicos_situacao agenda_servicos_situacao_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agenda_servicos_situacao
    ADD CONSTRAINT agenda_servicos_situacao_pkey PRIMARY KEY (agend_serv_situ_id);


--
-- Name: agendamentos agendamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agendamentos
    ADD CONSTRAINT agendamentos_pkey PRIMARY KEY (agend_id);


--
-- Name: agendamentos agendamentos_tracking_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agendamentos
    ADD CONSTRAINT agendamentos_tracking_token_key UNIQUE (tracking_token);


--
-- Name: categorias categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (cat_id);


--
-- Name: categorias_servicos categorias_servicos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categorias_servicos
    ADD CONSTRAINT categorias_servicos_pkey PRIMARY KEY (cat_serv_id);


--
-- Name: disponibilidade disponibilidade_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.disponibilidade
    ADD CONSTRAINT disponibilidade_pkey PRIMARY KEY (disp_id);


--
-- Name: indisponibilidade indisponibilidade_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.indisponibilidade
    ADD CONSTRAINT indisponibilidade_pkey PRIMARY KEY (indisp_id);


--
-- Name: marcas marcas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marcas
    ADD CONSTRAINT marcas_pkey PRIMARY KEY (mar_id);


--
-- Name: modelos modelos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.modelos
    ADD CONSTRAINT modelos_pkey PRIMARY KEY (mod_id);


--
-- Name: servicos servicos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.servicos
    ADD CONSTRAINT servicos_pkey PRIMARY KEY (serv_id);


--
-- Name: servicos_tipo_veiculo servicos_tipo_veiculo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.servicos_tipo_veiculo
    ADD CONSTRAINT servicos_tipo_veiculo_pkey PRIMARY KEY (stv_id);


--
-- Name: tipo_veiculo_servico tipo_veiculo_servico_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_veiculo_servico
    ADD CONSTRAINT tipo_veiculo_servico_pkey PRIMARY KEY (tps_id);


--
-- Name: servicos_tipo_veiculo uk_servico_tipo_veiculo; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.servicos_tipo_veiculo
    ADD CONSTRAINT uk_servico_tipo_veiculo UNIQUE (serv_id, tps_id);


--
-- Name: usuarios uk_usuarios_cpf; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT uk_usuarios_cpf UNIQUE (usu_cpf);


--
-- Name: usuarios uk_usuarios_email; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT uk_usuarios_email UNIQUE (usu_email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (usu_id);


--
-- Name: veiculo_usuario veiculo_usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.veiculo_usuario
    ADD CONSTRAINT veiculo_usuario_pkey PRIMARY KEY (veic_usu_id);


--
-- Name: veiculos veiculos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.veiculos
    ADD CONSTRAINT veiculos_pkey PRIMARY KEY (veic_id);


--
-- Name: idx_tracking_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tracking_token ON public.agendamentos USING btree (tracking_token);


--
-- Name: agendamentos agendamentos_fk1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agendamentos
    ADD CONSTRAINT agendamentos_fk1 FOREIGN KEY (veic_usu_id) REFERENCES public.veiculo_usuario(veic_usu_id);


--
-- Name: agenda_servicos fk_agenda_servicos_agendamentos; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agenda_servicos
    ADD CONSTRAINT fk_agenda_servicos_agendamentos FOREIGN KEY (agend_id) REFERENCES public.agendamentos(agend_id);


--
-- Name: agenda_servicos fk_agenda_servicos_servicos; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agenda_servicos
    ADD CONSTRAINT fk_agenda_servicos_servicos FOREIGN KEY (serv_id) REFERENCES public.servicos(serv_id);


--
-- Name: servicos fk_cat_serv_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.servicos
    ADD CONSTRAINT fk_cat_serv_id FOREIGN KEY (cat_serv_id) REFERENCES public.categorias_servicos(cat_serv_id);


--
-- Name: categorias fk_categorias_tps_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT fk_categorias_tps_id FOREIGN KEY (tps_id) REFERENCES public.tipo_veiculo_servico(tps_id);


--
-- Name: servicos_tipo_veiculo fk_stv_servico; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.servicos_tipo_veiculo
    ADD CONSTRAINT fk_stv_servico FOREIGN KEY (serv_id) REFERENCES public.servicos(serv_id);


--
-- Name: servicos_tipo_veiculo fk_stv_tipo_veiculo; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.servicos_tipo_veiculo
    ADD CONSTRAINT fk_stv_tipo_veiculo FOREIGN KEY (tps_id) REFERENCES public.tipo_veiculo_servico(tps_id);


--
-- Name: marcas marcas_fk3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marcas
    ADD CONSTRAINT marcas_fk3 FOREIGN KEY (cat_id) REFERENCES public.categorias(cat_id);


--
-- Name: modelos modelos_fk2; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.modelos
    ADD CONSTRAINT modelos_fk2 FOREIGN KEY (mar_id) REFERENCES public.marcas(mar_id);


--
-- Name: veiculo_usuario veiculo_usuario_fk1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.veiculo_usuario
    ADD CONSTRAINT veiculo_usuario_fk1 FOREIGN KEY (veic_id) REFERENCES public.veiculos(veic_id);


--
-- Name: veiculo_usuario veiculo_usuario_fk2; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.veiculo_usuario
    ADD CONSTRAINT veiculo_usuario_fk2 FOREIGN KEY (usu_id) REFERENCES public.usuarios(usu_id);


--
-- Name: veiculos veiculos_fk1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.veiculos
    ADD CONSTRAINT veiculos_fk1 FOREIGN KEY (mod_id) REFERENCES public.modelos(mod_id);


--
-- PostgreSQL database dump complete
--

\unrestrict 1XJYNJeXO4zTvaTTovd6RgGmmwOcoDkjbLr3SHSpVFp3JJAMTMqcAhK2krb46lP

