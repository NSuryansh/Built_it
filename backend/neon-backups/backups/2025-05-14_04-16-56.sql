--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: neondb_owner
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO neondb_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: neondb_owner
--

COMMENT ON SCHEMA public IS '';


--
-- Name: Gender; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."Gender" AS ENUM (
    'Male',
    'Female',
    'Other'
);


ALTER TYPE public."Gender" OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: DocCertification; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."DocCertification" (
    id integer NOT NULL,
    doctor_id integer NOT NULL,
    certification text NOT NULL
);


ALTER TABLE public."DocCertification" OWNER TO neondb_owner;

--
-- Name: DocCertification_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public."DocCertification_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."DocCertification_id_seq" OWNER TO neondb_owner;

--
-- Name: DocCertification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public."DocCertification_id_seq" OWNED BY public."DocCertification".id;


--
-- Name: DocEducation; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."DocEducation" (
    id integer NOT NULL,
    doctor_id integer NOT NULL,
    education text NOT NULL
);


ALTER TABLE public."DocEducation" OWNER TO neondb_owner;

--
-- Name: DocEducation_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public."DocEducation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."DocEducation_id_seq" OWNER TO neondb_owner;

--
-- Name: DocEducation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public."DocEducation_id_seq" OWNED BY public."DocEducation".id;


--
-- Name: EmergencyApp; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."EmergencyApp" (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    "dateTime" timestamp(3) without time zone NOT NULL,
    reason text NOT NULL,
    doctor_id integer NOT NULL
);


ALTER TABLE public."EmergencyApp" OWNER TO neondb_owner;

--
-- Name: EmergencyApp_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public."EmergencyApp_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."EmergencyApp_id_seq" OWNER TO neondb_owner;

--
-- Name: EmergencyApp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public."EmergencyApp_id_seq" OWNED BY public."EmergencyApp".id;


--
-- Name: Message; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Message" (
    id text NOT NULL,
    "encryptedText" text NOT NULL,
    iv text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "encryptedAESKey" text NOT NULL,
    "authTag" text NOT NULL,
    "senderType" text NOT NULL,
    read boolean DEFAULT false NOT NULL,
    "doctorId" integer NOT NULL,
    "userId" integer NOT NULL
);


ALTER TABLE public."Message" OWNER TO neondb_owner;

--
-- Name: Subscription; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Subscription" (
    id text NOT NULL,
    endpoint text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "doctorId" integer,
    "userId" integer
);


ALTER TABLE public."Subscription" OWNER TO neondb_owner;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO neondb_owner;

--
-- Name: admin; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.admin (
    id integer NOT NULL,
    email text NOT NULL,
    mobile text NOT NULL,
    password text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.admin OWNER TO neondb_owner;

--
-- Name: admin_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_id_seq OWNER TO neondb_owner;

--
-- Name: admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.admin_id_seq OWNED BY public.admin.id;


--
-- Name: appointments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.appointments (
    id integer NOT NULL,
    user_id integer NOT NULL,
    doctor_id integer NOT NULL,
    "dateTime" timestamp(3) without time zone NOT NULL,
    reason text,
    "isDoctor" boolean DEFAULT false NOT NULL,
    stars integer
);


ALTER TABLE public.appointments OWNER TO neondb_owner;

--
-- Name: appointments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.appointments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.appointments_id_seq OWNER TO neondb_owner;

--
-- Name: appointments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.appointments_id_seq OWNED BY public.appointments.id;


--
-- Name: chatbot; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.chatbot (
    id integer NOT NULL,
    user_id integer NOT NULL,
    "isBot" boolean DEFAULT false NOT NULL,
    message text NOT NULL,
    "sentAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.chatbot OWNER TO neondb_owner;

--
-- Name: chatbot_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.chatbot_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chatbot_id_seq OWNER TO neondb_owner;

--
-- Name: chatbot_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.chatbot_id_seq OWNED BY public.chatbot.id;


--
-- Name: doctor; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.doctor (
    name text NOT NULL,
    mobile text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    reg_id text NOT NULL,
    "desc" text,
    img text,
    id integer NOT NULL,
    address text,
    city text,
    experience text,
    "avgRating" numeric(65,30) DEFAULT 0 NOT NULL,
    "isInactive" boolean DEFAULT false NOT NULL
);


ALTER TABLE public.doctor OWNER TO neondb_owner;

--
-- Name: doctor_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.doctor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.doctor_id_seq OWNER TO neondb_owner;

--
-- Name: doctor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.doctor_id_seq OWNED BY public.doctor.id;


--
-- Name: doctor_leave; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.doctor_leave (
    id integer NOT NULL,
    doctor_id integer NOT NULL,
    date_start timestamp(3) without time zone NOT NULL,
    date_end timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.doctor_leave OWNER TO neondb_owner;

--
-- Name: doctor_leave_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.doctor_leave_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.doctor_leave_id_seq OWNER TO neondb_owner;

--
-- Name: doctor_leave_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.doctor_leave_id_seq OWNED BY public.doctor_leave.id;


--
-- Name: events; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.events (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    "dateTime" timestamp(3) without time zone NOT NULL,
    venue text NOT NULL,
    url text
);


ALTER TABLE public.events OWNER TO neondb_owner;

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_id_seq OWNER TO neondb_owner;

--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: feelings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.feelings (
    user_id integer NOT NULL,
    mental_peace integer NOT NULL,
    sleep_quality integer NOT NULL,
    passion integer NOT NULL,
    less_stress_score integer NOT NULL,
    happiness_score integer NOT NULL,
    social_life integer NOT NULL
);


ALTER TABLE public.feelings OWNER TO neondb_owner;

--
-- Name: notif; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.notif (
    id integer NOT NULL,
    user_id integer NOT NULL,
    chat_user integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.notif OWNER TO neondb_owner;

--
-- Name: notif_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.notif_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notif_id_seq OWNER TO neondb_owner;

--
-- Name: notif_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.notif_id_seq OWNED BY public.notif.id;


--
-- Name: otpverif; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.otpverif (
    id integer NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    useremail text NOT NULL,
    token integer NOT NULL
);


ALTER TABLE public.otpverif OWNER TO neondb_owner;

--
-- Name: otpverif_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.otpverif_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.otpverif_id_seq OWNER TO neondb_owner;

--
-- Name: otpverif_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.otpverif_id_seq OWNED BY public.otpverif.id;


--
-- Name: passwordResetToken; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."passwordResetToken" (
    id integer NOT NULL,
    token text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "userId" integer NOT NULL
);


ALTER TABLE public."passwordResetToken" OWNER TO neondb_owner;

--
-- Name: passwordResetToken_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public."passwordResetToken_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."passwordResetToken_id_seq" OWNER TO neondb_owner;

--
-- Name: passwordResetToken_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public."passwordResetToken_id_seq" OWNED BY public."passwordResetToken".id;


--
-- Name: pastApp; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."pastApp" (
    id integer NOT NULL,
    note text NOT NULL,
    doc_id integer,
    user_id integer,
    "createdAt" timestamp(3) without time zone NOT NULL,
    "isDoctor" boolean DEFAULT false NOT NULL,
    stars integer
);


ALTER TABLE public."pastApp" OWNER TO neondb_owner;

--
-- Name: pastApp_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public."pastApp_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."pastApp_id_seq" OWNER TO neondb_owner;

--
-- Name: pastApp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public."pastApp_id_seq" OWNED BY public."pastApp".id;


--
-- Name: pastEvents; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."pastEvents" (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    "dateTime" timestamp(3) without time zone NOT NULL,
    venue text NOT NULL
);


ALTER TABLE public."pastEvents" OWNER TO neondb_owner;

--
-- Name: pastEvents_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public."pastEvents_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."pastEvents_id_seq" OWNER TO neondb_owner;

--
-- Name: pastEvents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public."pastEvents_id_seq" OWNED BY public."pastEvents".id;


--
-- Name: referrals; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.referrals (
    id integer NOT NULL,
    user_id integer NOT NULL,
    doctor_id integer NOT NULL,
    referred_by text NOT NULL,
    reason text NOT NULL,
    username text DEFAULT 'Hello'::text NOT NULL
);


ALTER TABLE public.referrals OWNER TO neondb_owner;

--
-- Name: referrals_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.referrals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.referrals_id_seq OWNER TO neondb_owner;

--
-- Name: referrals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.referrals_id_seq OWNED BY public.referrals.id;


--
-- Name: requests; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.requests (
    id integer NOT NULL,
    user_id integer NOT NULL,
    doctor_id integer NOT NULL,
    "dateTime" timestamp(3) without time zone NOT NULL,
    reason text,
    "forDoctor" boolean DEFAULT true NOT NULL
);


ALTER TABLE public.requests OWNER TO neondb_owner;

--
-- Name: requests_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.requests_id_seq OWNER TO neondb_owner;

--
-- Name: requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.requests_id_seq OWNED BY public.requests.id;


--
-- Name: slots; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.slots (
    id integer NOT NULL,
    doctor_id integer NOT NULL,
    starting_time time without time zone NOT NULL
);


ALTER TABLE public.slots OWNER TO neondb_owner;

--
-- Name: slots_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.slots_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.slots_id_seq OWNER TO neondb_owner;

--
-- Name: slots_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.slots_id_seq OWNED BY public.slots.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    username text NOT NULL,
    mobile text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    alt_mobile text NOT NULL,
    "publicKey" text NOT NULL,
    department text NOT NULL,
    "rollNo" text NOT NULL,
    "acadProg" text NOT NULL,
    gender public."Gender" NOT NULL,
    "roomNo" text DEFAULT ''::text NOT NULL
);


ALTER TABLE public."user" OWNER TO neondb_owner;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_id_seq OWNER TO neondb_owner;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: DocCertification id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."DocCertification" ALTER COLUMN id SET DEFAULT nextval('public."DocCertification_id_seq"'::regclass);


--
-- Name: DocEducation id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."DocEducation" ALTER COLUMN id SET DEFAULT nextval('public."DocEducation_id_seq"'::regclass);


--
-- Name: EmergencyApp id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."EmergencyApp" ALTER COLUMN id SET DEFAULT nextval('public."EmergencyApp_id_seq"'::regclass);


--
-- Name: admin id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.admin ALTER COLUMN id SET DEFAULT nextval('public.admin_id_seq'::regclass);


--
-- Name: appointments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.appointments ALTER COLUMN id SET DEFAULT nextval('public.appointments_id_seq'::regclass);


--
-- Name: chatbot id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.chatbot ALTER COLUMN id SET DEFAULT nextval('public.chatbot_id_seq'::regclass);


--
-- Name: doctor id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.doctor ALTER COLUMN id SET DEFAULT nextval('public.doctor_id_seq'::regclass);


--
-- Name: doctor_leave id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.doctor_leave ALTER COLUMN id SET DEFAULT nextval('public.doctor_leave_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: notif id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notif ALTER COLUMN id SET DEFAULT nextval('public.notif_id_seq'::regclass);


--
-- Name: otpverif id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.otpverif ALTER COLUMN id SET DEFAULT nextval('public.otpverif_id_seq'::regclass);


--
-- Name: passwordResetToken id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."passwordResetToken" ALTER COLUMN id SET DEFAULT nextval('public."passwordResetToken_id_seq"'::regclass);


--
-- Name: pastApp id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."pastApp" ALTER COLUMN id SET DEFAULT nextval('public."pastApp_id_seq"'::regclass);


--
-- Name: pastEvents id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."pastEvents" ALTER COLUMN id SET DEFAULT nextval('public."pastEvents_id_seq"'::regclass);


--
-- Name: referrals id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.referrals ALTER COLUMN id SET DEFAULT nextval('public.referrals_id_seq'::regclass);


--
-- Name: requests id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.requests ALTER COLUMN id SET DEFAULT nextval('public.requests_id_seq'::regclass);


--
-- Name: slots id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.slots ALTER COLUMN id SET DEFAULT nextval('public.slots_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: DocCertification; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."DocCertification" (id, doctor_id, certification) FROM stdin;
57	7	Therapist of the month
58	7	 IIT Indore
253	1	hello
255	2	abc
\.


--
-- Data for Name: DocEducation; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."DocEducation" (id, doctor_id, education) FROM stdin;
134	1	<Add>
136	2	college
56	7	AIIMS
57	7	 Delhi
\.


--
-- Data for Name: EmergencyApp; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."EmergencyApp" (id, name, email, phone, "dateTime", reason, doctor_id) FROM stdin;
1	shreya	cse230001049@iiti.ac.in	987654321	2025-04-01 11:30:00	emergency	2
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Message" (id, "encryptedText", iv, "createdAt", "encryptedAESKey", "authTag", "senderType", read, "doctorId", "userId") FROM stdin;
76e3bd7b-1bf0-4862-83f0-1e797d56a636	86aNdCCvw/LasfUaO3VBrRje	eC1e5AhY7YSYG/Sc	2025-05-13 20:02:42.373	5ded035dfe1259a98de01461608ac2cb1e2f034d9f3bcc62453f54a05ddbffc4		user	t	1	19
4457c042-e347-4170-802f-4b3d7aa48b28	AJtdgsk0Qwaqc7yKkllTseIWEg==	Ky7y22r7cu3+K+nl	2025-05-13 20:02:47.8	e2dab1cc9bbf744dd50270c893dc4e19cfe7edf3bf4572f5351ca6078f9572f5		user	t	1	19
278409fd-3448-4fdc-bd81-5165e79f8563	wXZAf3TcEz+Kg3+fjBCZfV6j	U4BUzhK+crzk/6eJ	2025-05-13 20:02:48.107	e2dab1cc9bbf744dd50270c893dc4e19cfe7edf3bf4572f5351ca6078f9572f5		user	t	1	19
507d2d03-8066-4309-8223-755fa13a38cb	TMg1+GXaS57/Lhz0UgcgcojYdg==	qmYlj9vW9r4TQ2vl	2025-05-13 20:02:48.533	e2dab1cc9bbf744dd50270c893dc4e19cfe7edf3bf4572f5351ca6078f9572f5		user	t	1	19
1ea9b879-c130-48ae-b15e-669f0f0be216	fLo2To1Whxe7EmOY9aEYl9gVmlWvlYpvthgdPKJ+KtIzqdl7Y5pb	EEpzc9c8XtgQiwCP	2025-05-13 22:07:14.681	092f199b5784f4463107c37ea0f3c56c6356b5c18c743b71a4c7c39e06ff191f		doc	f	1	19
b0145d36-1f0f-49c6-81e7-545adbae72dc	nfQZc0xTzjGg3gt9E29L8we+eoxIAzJqfuArgl0pg9O43NtuXYuaJA==	NLlNe+sOE8P6KnKQ	2025-05-13 22:07:23.044	09071d9790314565859288bb5a7ba12da8c9268a43e340efbdc45c54923526bc		user	f	1	19
8c9744b9-4128-480d-acd4-089e712e9a94	cgRD/qp3yDZ5O1ZX0LZ4fHfYejzISsrs	82TcMxPhzPtHYbpF	2025-05-13 22:07:32.919	092f199b5784f4463107c37ea0f3c56c6356b5c18c743b71a4c7c39e06ff191f		doc	f	1	19
ecf501df-89cc-4e9c-879a-9629e15fe1c0	9fdIgU8L2yZTq7r4bgc2dIZL1DgjCzWymSA=	6hobzpAF2ev2qLqO	2025-05-13 22:07:35.511	092f199b5784f4463107c37ea0f3c56c6356b5c18c743b71a4c7c39e06ff191f		doc	f	1	19
d232b2a2-9999-4a70-b3fb-2e9249dcf618	MLm2vDXFqP3RhT6mi+yY5VmV/swO	qa/F11WJm7FZkhse	2025-05-13 20:36:14.204	3a361f3ff1b98a7f9b789e7c971481d9effc9e859dfe82a8592348658b76b0df		doc	t	1	19
7f3ca5a3-92d0-4c50-8070-af3b49e4380c	I0rOLGzPNSdNn0toC6L8oJ6e	Crg9XZ3q8vLjiw/2	2025-05-13 20:41:00.372	3a361f3ff1b98a7f9b789e7c971481d9effc9e859dfe82a8592348658b76b0df		doc	t	1	19
b4e995d2-2da2-4eff-9a92-cc1aee1cc307	6Cs2zstyYayOv70Z1UoMZAKzAkje10HKdtNp3Ag=	tfAF7MCC9lGa5sT9	2025-05-13 22:07:39.13	092f199b5784f4463107c37ea0f3c56c6356b5c18c743b71a4c7c39e06ff191f		doc	f	1	19
2c434df0-1617-4a43-9616-88cb3ab5ad66	coTNDhgXxXhsBaW/UoRcFPQd1/sOBg9Wo3ZaMKc=	CJ2E4y1Q/9rTNI7n	2025-05-13 22:07:44.338	09071d9790314565859288bb5a7ba12da8c9268a43e340efbdc45c54923526bc		user	f	1	19
8eb6884f-1a2b-4961-8a72-b0614ae46cd7	VHeNN0qsw9p5jcQq7oncfOPUNofr5k8SuvuIxScA7g==	2mXFfCeQJ7TVE5ak	2025-05-13 22:07:47.615	09071d9790314565859288bb5a7ba12da8c9268a43e340efbdc45c54923526bc		user	f	1	19
547c9f06-77fb-4f3f-8c28-625bd6e93c5d	Pb7B62exOpxA4RUXaBIb3yAw17cPh40iUQ==	vt2KSWKI0Jdc8mQs	2025-05-13 22:07:50.013	09071d9790314565859288bb5a7ba12da8c9268a43e340efbdc45c54923526bc		user	f	1	19
5962ba7a-9f2e-49c7-8cd7-4e7b094824c2	nCmw/NRpkY5F9ue+/M1Nt/tv4KPao4L1	XR5O+w6AZ1HkzHt2	2025-05-13 22:07:51.98	09071d9790314565859288bb5a7ba12da8c9268a43e340efbdc45c54923526bc		user	f	1	19
c89c47f3-aea2-4668-a58c-afc173a19db9	V9X6rWWeisPzG9kMjtjKnsmQ	q7O3izK4s60yyHah	2025-05-13 20:41:01.312	3a361f3ff1b98a7f9b789e7c971481d9effc9e859dfe82a8592348658b76b0df		doc	t	1	19
27d580da-66dd-4f38-8d08-3b3bef25ee48	HO25GwRcDW8hj37Hlj0s+MuA	kmTlOBboWnbVlAtd	2025-05-13 20:41:00.9	3a361f3ff1b98a7f9b789e7c971481d9effc9e859dfe82a8592348658b76b0df		doc	t	1	19
fd6f1779-0af2-4865-8662-980c1a6c135e	/7Jp+0BBlLEOfEiVh5eI2Ywd	hDmC+ctK+Ok17kmD	2025-05-13 20:52:48.608	ab4c8a591d499388212ffcd8f57eeb679bf9488cfe2c8f55724f0c680ac33224		doc	t	1	19
0baae649-70a6-4619-aac5-aed4d5154816	LB04gmtmXdJtCmI/I5+USS/b	iPmVXkQ3SItR+pk2	2025-05-13 20:53:00.044	ab4c8a591d499388212ffcd8f57eeb679bf9488cfe2c8f55724f0c680ac33224		doc	t	1	19
c7ddaeee-a1d0-45ce-ad2a-e36b81db5f59	E43adElWLmbrn5vP4KFukG+l	0R2kXa2hUlYSUz/2	2025-05-13 20:54:11.905	012663624ffbdaf2a3d58ff4737ed7ab9e6a87d2b7f746754c5391a47ea77422		doc	t	1	19
e9e16900-4e5a-4749-a430-e8e0da14951d	dNfpjVCKlNXwPVp2V0dxvHEW	8W+1x8Ja/ENBHKVv	2025-05-13 20:54:38.386	012663624ffbdaf2a3d58ff4737ed7ab9e6a87d2b7f746754c5391a47ea77422		doc	t	1	19
b2be6ee8-a092-49ad-b842-1d2250792462	ZUHqhN16P+hq3z2oAqFK07cu	SB4blzrLH+A27P9S	2025-05-13 20:54:49.966	012663624ffbdaf2a3d58ff4737ed7ab9e6a87d2b7f746754c5391a47ea77422		doc	t	1	19
754f649f-1cac-4e8e-9a64-4e3f61bb7f72	1WlXalUsiC2seWZAzMDgPd/g	FieUPGwUeLO7rio8	2025-05-13 20:56:40.927	012663624ffbdaf2a3d58ff4737ed7ab9e6a87d2b7f746754c5391a47ea77422		doc	t	1	19
deb9fd44-3edd-428d-8fa1-8f3926e2ecb9	1ZHV36zl+NbXx4k6s5pt5viM	J2kdrK7jUuqBPnKM	2025-05-13 19:25:17.623	ccf82058dfc608ba8da94dcbe41a5092a4cec03e48eb019ce25ffae7d14494c0		user	t	1	19
4d83353f-55bc-4217-b4a1-10943ef24aa9	msDBQKB8GQRIDR3PMwIX1a+O	hPX74M0heW6E6MBC	2025-05-13 19:37:47.612	573e4d9b67735c11cdec3a2352fa77348e7add5c869ccee76999a17b5d379703		user	t	1	19
81cf5219-505b-4e8e-a640-46ca2054fafb	oMifKBjhpYqrSBSv8LUIucc1Og==	svwsSyBbK08agpmt	2025-05-13 20:49:47.872	96be77a282d2f1735503e871b194284103a9a30bdc8c7425cb0a87b509a85f2a		user	t	1	19
9a1bd220-49b0-486e-8a9f-df902a1cf74f	eq/AJmM7UXmxLujzQv4BTaM=	kho/7s9r+fzBWDYD	2025-05-13 20:54:35.37	e057c348da7683659fea8bfe3741ebd73344d90118f4f5f1b91bd0ce71928eca		user	t	1	19
c77e2309-38c8-4ab3-9b1b-be8b4b2eab00	HzoconQrbqgjJOAlc1FkmtnH	B67F574OujJzsaWZ	2025-05-13 21:05:29.19	e057c348da7683659fea8bfe3741ebd73344d90118f4f5f1b91bd0ce71928eca		user	t	1	19
3286f9c7-2356-469a-8e13-4a5f67c9be48	gEkwGb5lWVlKG617MgF6eaBH	I4O7xbAoujhen7Q7	2025-05-13 19:25:41.745	ccf82058dfc608ba8da94dcbe41a5092a4cec03e48eb019ce25ffae7d14494c0		user	t	1	19
9a8e4fb1-2ed1-4d3d-9f8d-66d5b0b013a6	xz9Pk6XP5rinF2kG3AwbTjSJ	p7cVtIa9A6OA22P4	2025-05-13 21:58:18.123	e1f2d7dbf684c384ca33ac085dafd089fc7c4ba9ad90e3020d3661266926a780		user	t	1	19
0e894737-0988-45b4-aea9-8a2a0bb1ed7a	+G5YFImCOTgLeffHc3bvRERb	ozMT7DAxZ6eJnamh	2025-05-13 19:25:47.652	ccf82058dfc608ba8da94dcbe41a5092a4cec03e48eb019ce25ffae7d14494c0		user	t	1	19
07c1cb19-7ff9-4e9a-96bb-78cddc139aec	mj6NALsoSnmrsR0fi9WNoGuA	JoNPlybOk0dJLdJU	2025-05-13 21:06:17.895	b7c71a80dbbc735aa984e87d7233ca04a502089f713d8a76cbed275bfb1ea3c3		user	t	1	19
d2c3d333-8694-40ea-bda4-cbd5bea4bee0	SvVvQZhBoyhjvSqhIAmypHw=	gjts332IDkyVraFv	2025-05-13 21:08:21.539	1ec270e3e6be02051f2a308d071b5cea650826ba73f1e81081d938518d0f47ba		user	t	1	19
403afb8e-b5e1-4e8d-9a8e-e2ca8e7def3b	gihGI7r5+eiBlcKjjXZT+R2F	dujUNNorMvVDFxNP	2025-05-13 22:00:21.551	e1f2d7dbf684c384ca33ac085dafd089fc7c4ba9ad90e3020d3661266926a780		user	t	1	19
d8568553-f580-4b61-bd84-ddea0b1b37c7	ii/BR/2+Jh49z7ec4edsTjw8	qnyWML+FuQ8IUBUn	2025-05-13 21:05:33.427	012663624ffbdaf2a3d58ff4737ed7ab9e6a87d2b7f746754c5391a47ea77422		doc	t	1	19
e871f887-d1b6-465d-9c37-6b9cbca735aa	EeE3EsmE3o70xpmshWz9hsLc	KH/faqQLdwJr6DLi	2025-05-13 21:05:37.049	012663624ffbdaf2a3d58ff4737ed7ab9e6a87d2b7f746754c5391a47ea77422		doc	t	1	19
3a937722-7c6f-4699-ba5d-25902df3c5f1	qie65JSzYkiYAT4ZesWa2BCm	BdUN5EJO9zzg2z6m	2025-05-13 21:05:55.882	012663624ffbdaf2a3d58ff4737ed7ab9e6a87d2b7f746754c5391a47ea77422		doc	t	1	19
97326169-5887-4baf-ba09-369903d546f6	ilTOKcFf/4GC0Vp8SIsZuCHU	GLBPlRIkps74dK9O	2025-05-13 21:06:02.813	012663624ffbdaf2a3d58ff4737ed7ab9e6a87d2b7f746754c5391a47ea77422		doc	t	1	19
401994d7-25f0-4b4c-894a-82a28e78ce45	wr2GsDrnq67QmNCUGUu2HViE	mLxQ4/pluIWAvFRw	2025-05-13 20:41:01.762	3a361f3ff1b98a7f9b789e7c971481d9effc9e859dfe82a8592348658b76b0df		doc	t	1	19
6fcbee2a-c111-43e7-bdb6-b974fe03f702	sissvgp7p5Yz/HqZm83C9Z7x	mgZsfKEBtTYruQWv	2025-05-13 20:41:02.158	3a361f3ff1b98a7f9b789e7c971481d9effc9e859dfe82a8592348658b76b0df		doc	t	1	19
4d00d0a8-e6ff-4287-8ec9-9cf260fcc17d	La6atF0fd9TPERiMGyMumvyZ	xJbiHQ4mF0AWcz5f	2025-05-13 20:41:34.753	a78eacc5864bba05ef73a8cfe68588d29529dda1add7806317cd54cba1ca3a0b		doc	t	1	19
34e5174e-43ba-4217-81f8-6d0bdf812dc2	LSHTSF8dA88mklrLladUlwQ=	VGHc5gqy+T/+IXGv	2025-05-13 20:48:58.573	ab4c8a591d499388212ffcd8f57eeb679bf9488cfe2c8f55724f0c680ac33224		doc	t	1	19
7e0beafc-5cb4-4c01-892f-91e5af9fd15f	BB+4cLj1wxBNvgiSiszz0Sd1	JzgDgvU5mjs2xtQI	2025-05-13 21:46:26.128	c78731391451a4a806cbb66e3b71027676198a980a30202f77eed8e780df8fa6		doc	t	1	19
a61d2392-33d9-4236-be06-81474e21e69c	pEaEQiKwaxXhCWJ9yFnVKj5t	g6F+Mw0iSu3HCjrT	2025-05-13 20:51:46.605	ab4c8a591d499388212ffcd8f57eeb679bf9488cfe2c8f55724f0c680ac33224		doc	t	1	19
84a515f4-03c6-4f46-95b6-0c096858356f	LFiZ4CYjClE5/C2BobFDFHnR	H0V5Ji04fJTRbwNB	2025-05-13 21:48:50.025	c78731391451a4a806cbb66e3b71027676198a980a30202f77eed8e780df8fa6		doc	t	1	19
fc4c9a8f-46e0-48c1-8c6a-da8517a0162c	H/YpOuYxP1NLDnHt3rCGYEU=	mYdIGUj3TezuPC+F	2025-05-13 21:58:35.778	1767613613e735a999bd33536a284bd8cb1e0d7009d3cb4bbf78424910567520		doc	t	1	19
61d25e0e-5947-44b0-aaca-7017665b5752	Oo7IO6jfF3rCmkeT+lSECPuU	4TA4CAmUTmYp3OAl	2025-05-13 22:00:17.685	f3bbc856d0a5e7a28ede664bf60d53a48a806f02201eb815d322d66272ba20bf		doc	t	1	19
2e33287e-5655-4d13-a84b-cee9ebe9345e	osLsSOiLxVVr7EhducVVo9A=	z7CFUjF0FJIGx4ri	2025-05-13 22:00:30.054	f3bbc856d0a5e7a28ede664bf60d53a48a806f02201eb815d322d66272ba20bf		doc	t	1	19
96026104-df9b-4343-9ddb-a726dec100b0	CAOqIpO0R6BBnwnJBMgYOFGoh0ssEb4nj5ohDURMzYY+zkcJaNH4kcg9	hArxdpyhXRGpWVzt	2025-05-13 21:46:55.075	cb08b4773e4a0a82ebb393d19167a30897a5427a7acbff4f76d8854f7917c63d		user	t	1	19
80b720d7-8a83-4976-8179-724e22d10c30	ZCLeluwNe9kGaLziasU0gbwtmzR32e4V8Tm7bJOK+Q==	/P86/JyvTs3hXJvb	2025-05-13 21:47:04.722	cb08b4773e4a0a82ebb393d19167a30897a5427a7acbff4f76d8854f7917c63d		user	t	1	19
5fc978aa-41df-42d7-977a-19c027fff530	KO2FEHtY8gHcF/MKXeYcAPQsxEVtGQ==	jcOFU/ffU37PEtW/	2025-05-13 21:47:09.631	cb08b4773e4a0a82ebb393d19167a30897a5427a7acbff4f76d8854f7917c63d		user	t	1	19
ffb39f4d-1116-466d-8828-4da336cc2929	xxKSdyeZjvszlljvWaHFRr5A	5lpMY74ChzeiJR4A	2025-05-13 21:47:14.537	cb08b4773e4a0a82ebb393d19167a30897a5427a7acbff4f76d8854f7917c63d		user	t	1	19
f87f708b-791f-49c2-8e79-0454f6ac9f4b	KtoRamn2hsIs+oBfgTTTGPo5	wzDUxXAqYj8ON5W9	2025-05-13 21:47:55.325	cb08b4773e4a0a82ebb393d19167a30897a5427a7acbff4f76d8854f7917c63d		user	t	1	19
3063588d-0d9d-452e-b221-628ca534cf63	e6qoe8dopYUyLz3YNQpDPfPjamQhDx6B7KE4bvkiFA==	F3V/DW1uWIyhdRnk	2025-05-13 21:47:00.323	c78731391451a4a806cbb66e3b71027676198a980a30202f77eed8e780df8fa6		doc	t	1	19
00395f03-80c9-4737-97bc-8f8482efc06d	Z26W0EVcOTCPm6Gry2HylKk=	PNA+D9ViljCrsg7j	2025-05-13 21:47:12.074	c78731391451a4a806cbb66e3b71027676198a980a30202f77eed8e780df8fa6		doc	t	1	19
3e7002d0-c8b8-4377-8265-db88a37da989	wZAEXQzP7zOb9XWJjnTA2Iok	373q+YzAxMHSF2vc	2025-05-13 21:47:51.142	c78731391451a4a806cbb66e3b71027676198a980a30202f77eed8e780df8fa6		doc	t	1	19
8023e034-b3d3-4cee-a3dc-2b6f710192c9	L7a1SreMBO8ztMdae0U0B6Dr	pECTQmoQE4KmWxgR	2025-05-13 21:06:15.016	012663624ffbdaf2a3d58ff4737ed7ab9e6a87d2b7f746754c5391a47ea77422		doc	t	1	19
69feef5d-af4a-4ee5-99ce-1d884a61a71c	vyImJo5c+/t8Y+50UVLMdxVZ	efHyR779gZQ8uG+n	2025-05-13 21:08:00.612	bd3913b3fd7a6c8fc107bf0d40b70b44671fd5bc9a465c27d3150b9ee4c63715		doc	t	1	19
12981175-c707-4b84-9a32-fbbebfe96ac1	V9fixQTcHMCpc+PGLLQvn3ux	wtQWdfsDySzqLtbS	2025-05-13 22:00:33.744	e1f2d7dbf684c384ca33ac085dafd089fc7c4ba9ad90e3020d3661266926a780		user	t	1	19
ccbdae55-85c6-4e53-9c43-0dcd8ff9b3d5	uOEqnpof4n+uYkE1KJ5bYXE=	+BlnnnyIzIkBYMuw	2025-05-13 22:05:44.18	4ac1eaec175917c0bf45c91857ae639411d445152668cf7747c47247a55b987a		user	t	1	19
d2b7ce7c-5635-457e-8a98-fdb851655bcb	7rmNP9mjnDe1HnVlUAdiKtmK	chXed214DQDKU+02	2025-05-13 22:06:46.529	a4eca7646639c2a5ea9e13f84b8fdbe248413316df30db394e2b085872e7c006		user	t	1	19
1453cc7a-c9c0-469d-a3e5-a5c3252061e2	75clrlouOvZFKwTyFXK8+u3f	bxxcYP5Zd3ydMewo	2025-05-13 21:08:04.402	bd3913b3fd7a6c8fc107bf0d40b70b44671fd5bc9a465c27d3150b9ee4c63715		doc	t	1	19
5fdaa47a-a900-4c74-9a01-409e935dbb1a	R0NojtB80xXcmgzgf5Zy5PY=	cks6vRBkuQQ/ThKE	2025-05-13 21:08:13.505	bd3913b3fd7a6c8fc107bf0d40b70b44671fd5bc9a465c27d3150b9ee4c63715		doc	t	1	19
d24f9ecd-14f9-47f8-8f5f-78eb43f61e73	+W7izMaiUbGzAm26KVfj213KIw==	Uvu5s+bmBNMb7EFu	2025-05-13 21:58:08.258	1767613613e735a999bd33536a284bd8cb1e0d7009d3cb4bbf78424910567520		doc	t	1	19
4019c093-cd14-4754-95d0-5cb5b363f784	mTQbVp/qSTn7h0n+5jHul+aD	uefhPxTzHvIBcH3R	2025-05-13 21:58:55.804	d554d621541a62b11692115ddb47cabdc716b88eebd56211e78aaa9185c3bacc		doc	t	1	19
a4496dd6-21ea-41c1-91fe-c3be0584a71b	qpFRWjUJfpUXJ+yPEt+9EpaN	Qq9lIwujxf1vmF4k	2025-05-13 22:05:40.792	126059f15d19eaa03dabed1589e7ee126b986f8a7670237eda0a9dc8149a48c9		doc	t	1	19
143462a0-23a4-44cf-bbfc-853a61b349ce	MNo27Nm0lPVtcReLnAHYT1R5	+/sIY1hVcxeaktUr	2025-05-13 22:06:36.015	e20a8f6f0da16b811b0484203700d01a9208dbb5f22dabbe45cef5159b592f40		doc	t	1	19
04b570e1-86ea-4ffd-be87-18c949000083	4Rg1IqP1soinQlGwOStHEUPXMP5duQ==	GGl7skKSz9W2u+6M	2025-05-13 22:06:39.51	e20a8f6f0da16b811b0484203700d01a9208dbb5f22dabbe45cef5159b592f40		doc	t	1	19
\.


--
-- Data for Name: Subscription; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Subscription" (id, endpoint, "createdAt", "doctorId", "userId") FROM stdin;
8f3135d7-7c8d-47cd-b31e-5ebe2d96c2e8	dorn_IDUfEjahE0SwK40Xw:APA91bEIrG1BjNSE8-cmxcyJgH31n_r0zK12A6hzm1L_87KlJEGdd5DIVGRhl7-DlUJhSyMV_Z0J_fGvCAn81D13OS64XvzozGuXPQsU0m8GznYweJroKXs	2025-04-24 10:10:38.76	\N	18
e1341235-e217-43c1-b440-ad77f80a0290	dmMSkI8gq7hplhTzORZ9F4:APA91bF7RHW0tIms9zhAq0Zk-Qy-IbBkTsm8xi8NFdSKHNdqpHMTMD3SZprtZaUoWIUHyFFQJVH4WevkgSQYO005Jr-9dCQ5cBFOMCwMSPfMOhJhkPF8RXc	2025-04-25 06:54:56.829	1	19
299ea9e4-1d8d-41de-b392-2ea5fbd1aa9c	c50sBk-LidVp1IzLb_JoWU:APA91bHAlBKunP1aAk860VW-6rsupqtgLQFJnFZ5H7ul2q2K3plJSB7KllJCM5PzumqgZ6l97LkQGpIGVX5b7RQn1fTSemEtOHHs04xHtA0TgaJtHIzmL78	2025-04-24 10:49:10.094	\N	19
d4174cf8-5854-44b2-a7e8-3b60aa148306	eH_XhSl4lX6ZEY3HZyp3R4:APA91bFBcNv7rpFkc3YjmaOVbHa1EuFgnLVNw215uYT_luTBmZ-eGHVLzfnspjnZg9uL9p5wIbc4wRvLCzn9gW2v5qq26AIFV1KwngBfhr9-kZfVQVYoO4o	2025-04-24 05:34:51.146	\N	18
02435e32-9017-412e-b6e6-5038af7e1f9c	dvlC90zJULmdjZNVetVhdo:APA91bGI5YTcAKYszTRBYWX_8jZxVqWCalpIvF10chRTMNWfyKVFdoGvw2oRr863TFzbscWmWEPlNMLGeNoomEQWVSdYbfZEYpKyO9jOu90lBAsSNcSwnOU	2025-05-13 12:45:56.373	7	\N
4ba2a63b-5c2d-402d-aca0-3b176a952e93	e8i5NZA6wYF8I-Zg7BVLM2:APA91bFlKubNRolgm1_lBmdwyxZJvzZ5XoGyS6n8yrWPYc__Bs3--jqMwSZjAhaUzO7r7vPLETu-EgGbCPkx4leHqv4TarrOozBuMrs2MwpVGvq6H1xOs24	2025-04-23 20:24:10.096	\N	19
5ef91afb-f2a4-4ea3-86dc-be82185fc384	d1Ut07GrigwAtBCiCI53-2:APA91bHvHOAbwR3tzR7bvDF_p7kzXQh44a8gQVwoPV-pIXsAFztDj--8I4a-ToVv4M2BrwiVj3j4GTrhuPpXzcVMfe7a8n3hELqa0nC8xq2XY8EHje8cyFE	2025-04-24 10:01:29.62	7	19
24793168-0e6f-42a6-9e4c-3008a9e89188	ewYEnpAeTHlm2--a-ZQG7r:APA91bFyANASsB2XewnkMLvVX0VRbP_s6UpH_CemOd-SeVB4AvaGoZ4BEDMiLtGzLyUSBCocsXskcj6blQOK2f88xi-0uty6UpnnH4QWBVtICzAcf8tsf2g	2025-04-23 20:23:47.676	7	19
cd44c482-5d6d-4c04-9823-d4b312765920	dmMSkI8gq7hplhTzORZ9F4:APA91bEAwp_5Fz0yKg15ALxZv6LI4_KLL4Rr9UKdC8P3U3wEna6ZBsS0ZwDIp9uPx61V0PgG-hesA822APyDNi3RUZ_0BDcGXwi5K6oq89tqIur465gJda4	2025-04-24 09:49:27.044	\N	19
39e9bd97-9e72-4ba6-84d9-e8ce3c40f6a9	dMjPlPos4YA8u3_aXxAy6p:APA91bEQm_bWjnXHjtbY-NEQfhjSojv7ucrud-GWMyvPnaQKnS27QHfc9q-NzK7SAGU8HamWTd_sgkaO7jDEg1K4IAkJPPf81wq-Q0g3L67L_STXBJmBeMU	2025-04-24 06:22:37.774	1	19
d2e35bd1-8369-492a-9b1b-acae5f57007a	exRXSOTJ8tC239fsRuy-Do:APA91bEw9_MmRcENxpe8y4hL4j_lc6SVmsOu1ce5qgGKEYUeffRQdyCrbPTjOkdetxOSQTBz84zkLyAVnnww3LUOgXnGB9vI1jtR9KJJsiJuqQb4-DB9KxM	2025-04-23 21:14:37.73	\N	19
d1e208c5-8a02-4d6c-9c2a-0d3588fba399	etfFqNkS10Ocjr71Hp1VQl:APA91bFZHvxQz3LGWIgj-RgLeaSzrvCY-6IHPF_G5sYPTKeTA21FIOdxTnDTLjHL50cgefNS3J1vg0s7tl7hBxRu9jddsZUme0SNlVgA5KrM2h9QnGgmbA8	2025-04-25 06:13:19.352	1	19
df463bb2-979c-4af1-8c74-2228004bf7f9	dqIUBlYSduk2vism5R83rB:APA91bFmlgfWtykL_sOCVe0n87LBItdR0bcY1VJ6HXBrxWTK569sjlQgc7S7UO50WI0m784fUZKrmyaMXOYEA0U3mkJq9gT1uIhuJSEdO2r45vFAGU-4aRk	2025-05-12 12:06:49.031	1	\N
7e34113c-3fac-4ce4-9e30-bcaff5c93ee6	d78ceUqFXf_ObaPouWnOr7:APA91bECcPeX-L5snumzroyiqLaOL_U_SdAaHdEGon6MktTHiynt4fn4DCHEaauI1ibPJClqK7csXx172HT3XsKYgT2PnA8GWaS6fuWl2sS4Jz4aAeou2ic	2025-05-12 10:23:02.756	1	19
3a4fc2ae-bc7e-4965-8064-29ab881a2e17	f-cp7QK79tYPz8h-6SSA2d:APA91bGEYRBOwXV_548fZLHfbL7r9lnpWQd59hduk8u-GM5v166tqy0d6o0tvVFvetlRO5Rlk2S6unchRHyqDCuZ1IoXahBqPl81-DswkVEVVFguuLV889o	2025-04-24 09:03:38.535	\N	18
df7cdc0f-ddfe-4e6f-8a0d-786011c7861d	dMa6PCRF0oKpnBPUO8Tj5l:APA91bFQUE-84iduZeZG1tLnDpCZgYY4t9ksyqAcsiirJMQDNWsJvzuFGRnYD21dVuUWglByayl_L5NewtoSyuScd97EZYUwVLkqS3z78UhgKfwZgRM4wik	2025-04-23 19:51:06.682	1	18
3a133cf8-0107-49de-afe8-4cb6854735a7	eJKeGDhnd5WDXlk3kAwfrd:APA91bEyDgwzlE5X5dTu4anYEy7Hl7mpoim4f3lE2G8XYmz7hWSMBY_m-gzAZFBSi7ReQ3sP57ClqTYx9Zr3Flx77GJbMi7MnvkywokKJ1_g6UjOjybc1Lo	2025-05-13 17:48:55.94	1	\N
fd5c8764-19f4-4c36-b26a-6fd88dffa521	dZWU7IFqGxZH-tpqMJXwE7:APA91bGM38oaA-8ldLD28gDQ-YMrWtRF1bHNNFMC1SgyY_9Zk2XG6utdIr95lDC8KtKXn59GZeaZ1Z-7VGvtX0ornAwzdY98d9RmMMrTzb2uIQLIVFz7cWg	2025-04-24 09:01:37.322	\N	18
844b8430-fc24-490c-8ce9-155e587fddb8	exRXSOTJ8tC239fsRuy-Do:APA91bEz22xKsszF9LMilv1-Cr7RNabDXnh4JMFc0cPtIrhejn9skYs2i2X0JOpvyWX-dVrCKTzxUwj1jAI5ZLu2qiQ8JwgSxTabrVypWwNcaGsT021Ocl0	2025-04-24 09:58:34.935	\N	19
f8c99e7c-29a8-4fa7-a886-f17bdc46cf42	cZsdQTkAvhXZsANgV4LOY_:APA91bGI16mEoWXFcnmztPI73Bnm8K1_Br9OcTHnfUS0v-23ePUingZ3DMt9Wb0l6avrIJitsWLU7IMmUXgRI7gC0FVwL8LyDWdrmtYRZ-EwCmkjAhOmt4Y	2025-05-12 13:45:40.289	1	19
b91a0bfa-ab28-4e81-9735-d11d4c9c3152	deAbDt6pk7t9XtN4zre47S:APA91bHosHgPa1AohSOVIAXYvDNH8zVg2y3p4g1F-x6Qa18c-lJve_zVloHESmwSxNo64Cdw9TVaTBUtlctlZG9Ia5_BRXK3u3PRaFluCqDwbnXrqx0306s	2025-04-25 03:55:36.91	1	19
4394469f-fd06-4d36-9dc5-e25299d66aaf	fIjb1E7eN8DDENjC8pP3zl:APA91bGj2xRAk1nkNgDHgugzSf2z9qUdBXCQKak-zru2AFAFY2zw_3tz4Vv0jVq-9U2-IyrnzxvkKe_8zdWzic7lvOzm_mvXNAT1lKaGnc3Tj6NR2yLyc2Y	2025-04-25 07:34:30.167	1	19
741b0076-ff8e-462f-83e7-0400a0e8ee81	dorn_IDUfEjahE0SwK40Xw:APA91bF5gUtTmwJEU7c9lndsaPBN6mPCyDCPZE_-9KU5ZhM0vjj5XJpebCAJWzDwOvNjQePNuPq1aUkMg1brx96oGJd5De6SEVJkFP2f1rua3YH1fGN4r-g	2025-04-24 12:12:19.597	\N	19
aaa7ea51-2a3f-4e56-8ef6-6365481f0c89	dgnge1ixk5-d712827bZZx:APA91bH0HaviWI4JrR5ayftkyz8d_nzsUbQ4i4Vf69jMII6xEtiwltspP-imKD2Phbncbo1nyOigUlba5Xf5L9pAlbDHa5cSRyv6wmguycmt8lX78RGp7js	2025-05-12 11:53:31.309	1	19
68196e8a-d174-49a8-9329-8eae27009b0b	dtYO2gXk-oc8Gztop0DQPH:APA91bE3sNL2UfixdiPzl8WC_UuDambMKWOr-b9jpyH64UanGk7zEo4t3H1dCjnkq5qoCY6JoOM5H9rayPX5q4V8qZvgGBvllWMfiRPlDnNzUuhKtyKLoWA	2025-04-25 10:13:37.609	\N	19
d0d7b8e2-f579-4ae7-9b7e-e6aadfaeec70	dN5a1cXpvDjLH4lYrkOl69:APA91bEjxfIk4BQ50P5WZUJiV5dezGTPT6vpfWo6xCqz1uOQUfzRJ4g4EUv02PmqsYEnoIJTa8OMPTyIbFqt6VjX7gKx_x9hhTbt6trmfaYLl9ZWdu1AnHc	2025-05-13 21:11:46.752	1	\N
c2841f69-5ef6-461d-b733-41ab4ce6685f	cocLn9P4qCiWRf-PuBzErC:APA91bEOx6qgUI3-N0fAY_m5y_cGa0eNskLc9DiLCcw0lOPHt3Ae9gMQKOTj0GJn_noD0Y4ziQe1LRVr_R53KVT3uWUt04AZ6tN_UHQJoBtGxjRFtATBlzo	2025-04-24 08:35:52.191	\N	19
63bafce1-2fa7-40cc-8e1c-916047a44cb6	dmMSkI8gq7hplhTzORZ9F4:APA91bEVnxq62KO8Ia0SnkJol3ytOO2uB1iTya37_mg972N2wOaD0i0Q7_NToSG9410wJdIuTTf7ht4QV44IFNr6wFYtenwh2vyhtNXxhK8WOaYFfg7-2QQ	2025-04-24 09:54:05.313	\N	19
70799c83-d170-4be8-93c0-c10788ac3d37	e8i5NZA6wYF8I-Zg7BVLM2:APA91bF9kv1YDcgWyxeAhv6VIfpH5UlgNNPfwtKwOGiim0T83kSjeMM4u5NMgnZTmulAW34pSo6PahuweLr3Eq1668XoPPtfwVk0XSJuhWOWmGAnhTrzw_U	2025-04-23 19:38:44.865	\N	19
94667c07-3dcc-4d65-98d3-998affe5e4e1	exRXSOTJ8tC239fsRuy-Do:APA91bGl_lbREfW5n8SrB9hhWBamIfVRMcL_Xdc7QKgAray6IqBzRrS0zdvGLXyGGgI9DPUuHKpX_yjJbMrw3BwQqquv5xK35B8SoGYenKG8k4sCS_F6jqM	2025-04-23 19:56:05.621	\N	19
6fc07ba2-5b50-411d-aa06-c53e04795b80	f0Hlw1XjogfCPPu3fQc44f:APA91bGY2KZBigcUgL4hYGaI_kYAFaXoEc72zeMaHwOzWczDQrujT35S-iVG7lNNGY_WxHhyvpRfnF2285w8kQ4ikdCNfFtCigVTwVUjnaix8tSpH8qXDAM	2025-04-25 06:42:03.832	\N	19
4523104f-5227-44dc-8807-bf4c93eefe17	d3tWYajI4xJv0FGO-Xo6-Q:APA91bHpxSFqBO4GlrEBZZztYdholXaYpV_y2i7aZwpryTqJdffYuQDRyLjn5m0Ke_NOA_GT5dPlnvnShXMANI_SeP4JpcQjvaKwxjasxpeXMhaEeIy1i6E	2025-05-13 18:21:35.144	1	\N
4269b409-1180-4116-8236-5b0a7f97ec03	dorn_IDUfEjahE0SwK40Xw:APA91bHhGdNNGhiynnxY21Co8q_kCl6AeUTRwyuQLMDJyCW45r-p4J8kZqaQ1kxDOvnmoRtCmdXBRbwzsIiAhlLlI5ic1eT3ThjXjYylIy43R2zuWNDq1dc	2025-04-25 03:59:52.185	\N	19
d7fc5493-2fd5-4e6a-a054-50f38beb9652	fc6DxN9IL2HV_qLnYwmpsK:APA91bGtAfr63iEY718dXN7FtyFqAkGz22rQvkV4HiMDjYsNms1PTha-Bu1Clsa-exM4S_wrKOrpSEvy2UHR16pKBwW5b2y68ZjPtW-nTRLLyNk_cl9IqJw	2025-04-23 19:41:04.461	1	19
61e0aefc-17f5-4de1-8196-bb5e3ca3115f	eMtunNZHPvjC2gY_d_93ZP:APA91bHdnapCBF0IvbhTBnRvQmk1kwfFic6c7VZPm1uROUHISXtfPLGNrixZ0GnZVC18fAFofYbqpSkQdJ3vJxT-qNPYFj6eGOzLSQL8eugyymE9A9XRH_0	2025-04-25 07:46:55.977	\N	19
e6d1af25-3777-4a6f-bf06-53d8d976cad5	cjtkbvxsPLZXptQBh4iIuI:APA91bFU5qWduxx63ilGwF8MnHkTThaYS5gZFHhD7PM87DJSQD11M5-FZr053sVRDJJkTQwW2weypwSg0LH7wyaJuDH_8qE_D6lauGFcdBtOxtJVbXYDnwI	2025-04-25 07:29:23.349	7	\N
a8227710-753d-4700-af71-8bb7129eb787	c40u__tlSxSPvOzSk8fRPA:APA91bHAOx6WCkqz4TZisq5nEYXgC0lQA-Ng_VukWnVs-FPWSL1Gdd184_jMed3H60nGXCcE3Z06JrHbEg6t42GKPqK6ZKKYTNga3Mbzl9uEn0vUyDOm4I8	2025-05-12 11:55:12.703	1	\N
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
a9491c8f-916e-4ad0-ac6c-02b9d6900fe1	ab88e4f34c08b76e19f01337516e6da192f80c2520117506d4852a44d01e2674	2025-03-28 21:21:51.533276+00	20250324175758_edit_date_time	\N	\N	2025-03-28 21:21:50.422796+00	1
a5d904f1-77fe-4d9e-a246-3152801989fd	bfc43b063d77352cd5b493f45a9b9ee4306372ac852f41118ab50344f2207656	2025-03-28 21:21:30.458036+00	20250317150020_add_tables	\N	\N	2025-03-28 21:21:29.298264+00	1
e5e1b133-2736-4de4-b069-ef6adb7b4c06	04648c4abdbc31d5122b0b32ea431f11d0fbab43254f2d88faad3435e479f143	2025-03-28 21:21:32.066177+00	20250320083443_message_table	\N	\N	2025-03-28 21:21:30.904749+00	1
262d76c5-bffe-4163-975d-389be09efcc6	e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855	2025-03-28 21:22:06.420081+00	20250324210659_fix	\N	\N	2025-03-28 21:22:05.17705+00	1
abd3bd99-a3f6-4e78-902a-05a931809b7c	af4b721a59e196380386dea61b7d24c8eb08310e916afac35c2cdbc317dbd12b	2025-03-28 21:21:33.786169+00	20250320084833_add_public_key	\N	\N	2025-03-28 21:21:32.651115+00	1
08a4e253-eaa6-4790-b9bb-1671cb600ca0	854baf8e3aedb470b3bbe0ebd91a36a2d669ac18607d4ce814f6b5d7a57f8d7f	2025-03-28 21:21:53.256421+00	20250324181453_edit_doc	\N	\N	2025-03-28 21:21:51.975992+00	1
684f87dc-2234-4554-99ea-574729b09d3b	155ee30063fb05af8590b553123a944cc1a127e235af03a0fed1e51fd054eb93	2025-03-28 21:21:35.376226+00	20250320085256_change_to_string	\N	\N	2025-03-28 21:21:34.227589+00	1
95476b25-c3a6-43b0-821e-76b4e5abfcc3	89ec18671d19b751420dec285a3b83b9f6b06c814575eca18d48a88e6d0cd8cc	2025-03-28 21:21:36.931196+00	20250320093200_add_aes_key	\N	\N	2025-03-28 21:21:35.817852+00	1
30380d40-2bce-4369-9158-81aa60561464	83091aea663bf623b8db20aac54f3cd3b18788f2e24046818f59c87213f32661	2025-03-28 21:21:38.606734+00	20250320095113_add_auth_tag	\N	\N	2025-03-28 21:21:37.374448+00	1
29570e9d-0055-403a-9dec-750cf9bc5f9a	59fbee389049cf983536a93a8dd47ecf134a3795841c3e51be624569ff8eaee5	2025-03-28 21:21:54.821673+00	20250324182312_edit_req	\N	\N	2025-03-28 21:21:53.697922+00	1
4cc62fd6-eeb8-4e44-85bd-fdd04692660b	664f1823d241bec1fd4d0cbb3c27a2fe97d4cbedca69150507b99091c0a5b67c	2025-03-28 21:21:40.273066+00	20250320122109_app_events	\N	\N	2025-03-28 21:21:39.140559+00	1
5380626d-ffe8-422f-b02a-91137a93c5a8	ae67c7ed1abfb552c86834257489841b849ef5a7449095c14ea2d1e82caf7ebd	2025-03-28 21:21:41.884628+00	20250321121458_add_appntmnt_datetime	\N	\N	2025-03-28 21:21:40.715254+00	1
3200e968-d559-4f78-a12e-5a5b64e14797	ab7f1d8f38d16c6c49d95c806d57a9bb42fe56937f4a947e88a80cef098bb052	2025-03-28 21:21:43.44661+00	20250324111617_adding_reason	\N	\N	2025-03-28 21:21:42.325359+00	1
de14ca88-32c9-4b74-9553-e68d46719688	251990a8f7a244548d07de798cd7a88b1bec392468c2509cc0f0026f9c04da34	2025-03-28 21:21:56.373479+00	20250324190238_edit_past_app	\N	\N	2025-03-28 21:21:55.264491+00	1
0e0f32ad-6acd-45e3-81b2-1e68ced83bc7	68df705d7cfe12715a7d03752e49df691061762297120ff9bf92df95c77bb3b0	2025-03-28 21:21:45.100827+00	20250324140144_edits	\N	\N	2025-03-28 21:21:43.889025+00	1
f19529bd-7f0c-458b-9ba3-0154b1b3e1d1	081d249e69d53f3cd4a8b6a1d86872cc0b5c07e7b1d4bafa76493711f316463f	2025-03-28 21:21:46.763349+00	20250324142455_notifications	\N	\N	2025-03-28 21:21:45.646264+00	1
9feeb4a2-f5f2-4d11-8431-c6169b60a19e	9deb3a9c8388c2a5249abd930b47533958b13fbf0c4662f1038eb1016a45cbc5	2025-03-28 21:22:08.109619+00	20250326204454_password_reset	\N	\N	2025-03-28 21:22:06.861126+00	1
c3de2c45-dca8-460d-b749-d3744b512a7a	9a6135fab765db02aebe09e27af2274b443ab25a4dcd7bdc8035e9b48a196efb	2025-03-28 21:21:48.375598+00	20250324175226_add_past_app	\N	\N	2025-03-28 21:21:47.20564+00	1
296d91ca-4b53-4ad4-9285-cb7f3c7f5f4a	3e9865a16b18a1d6e7033ffd7286594576edfaa34164c02494aaf12fca999dba	2025-03-28 21:21:58.147185+00	20250324191413_edit	\N	\N	2025-03-28 21:21:56.900034+00	1
c52ec6f2-25b8-4fb7-8a1b-022f8727c2c1	d27fe3a0e7764f322297985d24c28f62681128bb366629655701556840d63b37	2025-03-28 21:21:49.926797+00	20250324175630_add_date_time	\N	\N	2025-03-28 21:21:48.819395+00	1
ac99c19e-e761-4d27-98ac-e11cfbc608b9	829a667f3662c6d8b33828427a87e437d4954201203cf5967c4b73ffb35fb2cd	2025-03-28 21:21:59.803074+00	20250324191703_edit	\N	\N	2025-03-28 21:21:58.589494+00	1
0da34457-780b-47cd-a38a-505d26b3f25a	2b0f01dec1ea9debc624f3fbfd9c33a59fb29b507c206c40fe239a070f8169f0	2025-03-28 23:01:43.401553+00	20250328230140_admin_changes	\N	\N	2025-03-28 23:01:42.007884+00	1
b757e17f-79ea-448a-9c3f-36bdcc221522	42eb0883517d0ad527ddbb440970dd5ad74f6ad511c7e2aa767ae15bd83a054f	2025-03-28 21:22:01.355094+00	20250324201639_edit_pastapp	\N	\N	2025-03-28 21:22:00.243988+00	1
3b1cd5ca-6799-4879-b6c6-bfa6f8cc84b9	4246b2d2983f1fdb80ab601c25a7b818ca97998d6b8f4c6c86c033c12698d4d3	2025-03-28 21:22:03.147256+00	20250324202209_edit_pastapp	\N	\N	2025-03-28 21:22:01.925631+00	1
fd0eacc5-c164-488f-998d-c80c2e75a938	17d827ebf392399c914fa0b236fd9739384032eb98f9e9a0be1dec78abba06ae	2025-03-28 21:22:04.735309+00	20250324202838_edit_pastapp	\N	\N	2025-03-28 21:22:03.589621+00	1
42e2d48f-0d65-4a80-9e97-c68b97213ffb	45b725c36ca90b8ef5490c1069a3f017f4a2492560a90a977a91e328978501b7	2025-03-30 18:28:24.896816+00	20250330182822_edit_user	\N	\N	2025-03-30 18:28:23.749645+00	1
5ed3ef06-1138-4546-b74c-c299e232022f	72b91f41fc43af16aec6c2b4359a3e9c44d190aef32ba9fd192abca2b5c679b9	2025-03-30 18:44:30.474378+00	20250330184428_edits	\N	\N	2025-03-30 18:44:29.255684+00	1
3fe17328-e114-485a-9374-e422887bc883	2d77b35139c7c19493359f4deb225da544f337cc79426d17716dbc746f317740	2025-03-30 21:25:19.339532+00	20250330212516_subscriptions	\N	\N	2025-03-30 21:25:17.82434+00	1
4202c3f0-d129-44bd-87f3-c92affc09de1	65ac140da511e2652f6a49c2d782e242b4ec61c245494251421a145077ec0944	2025-03-30 22:43:19.584066+00	20250330224317_changes	\N	\N	2025-03-30 22:43:18.465432+00	1
7ce645f1-7f60-4127-9b63-1626b0480c6a	71774bdee1039f6a3e0f6e6a9934fab3fb4a8d821a7ff8253a4eb5d6450f47c1	2025-04-04 18:16:19.659776+00	20250404181320_referrals	\N	\N	2025-04-04 18:16:18.382589+00	1
808d0fa1-ae3a-438f-8836-3b6d031baeb4	0dea32fe2fb1a4b91ae31a71083e83971f0c9ae746b72005e12c401eae494268	2025-03-30 22:46:32.887418+00	20250330224629_change	\N	\N	2025-03-30 22:46:31.369898+00	1
3195942f-bdfc-47ef-be99-67d828a7628b	12f95fe0f603f4ea3e2ea7b1b495f080ffc2aea7758236f45a815e1a2d53212f	2025-03-30 22:51:23.347507+00	20250330225120_edit_token	\N	\N	2025-03-30 22:51:22.248478+00	1
da0bc510-83bb-4efc-b7d1-8fe5ad05b9d9	cd1887b5193e67d46e40fa95c8325cb5e0706963f2ec72c76eb6ed3073035b4a	2025-04-23 17:39:57.371033+00	20250423173954_change_subs	\N	\N	2025-04-23 17:39:56.166622+00	1
638dbff6-7469-463a-a16f-3165f893db57	df88f85a64594a3d0f6b36c750a483d73d71f5ddab742bf27be573fd68e54fa9	2025-03-31 12:46:18.291752+00	20250331124615_edit_slots	\N	\N	2025-03-31 12:46:17.07414+00	1
725bcd41-5b89-43d1-8a75-1c5626b539da	9c62c07d085d74d634315eb6b6aa163eb8cc01f9d045fb442939b6e784e1bc41	2025-04-04 18:25:37.64879+00	20250404182535_edits	\N	\N	2025-04-04 18:25:36.434097+00	1
2e0e4975-4f72-4ad1-aeff-cff6405b93db	bc13d13cf8111da040d6716b85fa26493c008506863909ce24019f856a2b3e7d	2025-04-06 17:09:04.784929+00	20250406170902_edit_messages	\N	\N	2025-04-06 17:09:03.690199+00	1
eacd3088-b411-4d5a-9626-6b58c743a276	ccf1ffc536d9150ed58eb354e649c7b16f8bd4163d3f2867aeb989dd078ee423	2025-04-01 09:58:38.353187+00	20250401095835_emergency_app	\N	\N	2025-04-01 09:58:36.962628+00	1
9b955e07-4936-4779-aaf4-5b1133943e37	b610586f8eff5144105f8f591c7c2c2b7eeb7151074c308784a10361f63fa5db	2025-04-04 19:06:08.999572+00	20250404190451_added_doctor_bool	\N	\N	2025-04-04 19:06:07.84638+00	1
2a380d93-801f-42eb-adf1-1c1a5134881f	c88d8595cd2723e2977355861c3410506581714d95de5136c965a9274bbbeb69	2025-04-02 10:13:11.693127+00	20250402101305_add_doctor_details	\N	\N	2025-04-02 10:13:07.515224+00	1
c9bac8f5-a3b3-4abe-a240-adc2940460dc	e2f29eea876b57890983da4e5d2130b16b8da78e17ca656dbd3528b9ed5e1e98	2025-04-03 19:20:37.949266+00	20250403192035_added_gender	\N	\N	2025-04-03 19:20:36.84667+00	1
4213f0b1-e31c-491e-b62a-bf015800670c	a692cd8991c0597e1e9205fd041ceb9d45582565ebe820916d68a8b66a227afb	2025-04-03 19:25:27.05017+00	20250403192524_removednb	\N	\N	2025-04-03 19:25:25.828442+00	1
c05cf00f-56cc-4940-a5b9-d9fdcff78c22	b2055709633c66f1a85576600aa607ca80704f3ce138817785a841c3e155b576	2025-04-04 20:02:34.211459+00	20250404200231_edit_subscription	\N	\N	2025-04-04 20:02:32.88647+00	1
e0f8cceb-94da-4ac6-a920-1cd5a4f495f0	b5450e00317459762f108d34d1e2de283b1a1f8de96a152b14aabd15267f5b77	2025-04-04 16:30:08.399803+00	20250404163006_added_isdoc_to_appointments	\N	\N	2025-04-04 16:30:07.129566+00	1
f4f61fdf-0466-4e1c-be38-2a8a04656458	40e87a527f5636af230d6195ee37648b86b83e6228dd0f2e440599790b5085c2	2025-04-04 20:08:04.84678+00	20250404200653_url_events	\N	\N	2025-04-04 20:08:03.709893+00	1
c2251ce9-693a-460e-981f-3c8394a3451f	71a7c4ac53c9492465e5d19569d7f21c34e41954da644db7510753e667cf8f67	2025-04-06 18:25:42.741448+00	20250406182540_avg_rating	\N	\N	2025-04-06 18:25:41.568508+00	1
9b0f3476-3823-4932-8bfb-c4a6d1c62dc2	fcf24b62bd9f75717934cc1511e432abead6b0b2367d93d0b2e07d5c2fc4d6f8	2025-04-04 20:28:24.666942+00	20250404202821_unique_userid	\N	\N	2025-04-04 20:28:23.239409+00	1
904451f0-c202-4306-86cc-0b651671e1d0	2ef27353d6e8cf639d0d35a4a1401eb7062423bc6056939101e0711ddbc5ff5b	2025-04-04 20:43:03.215883+00	20250404204300_added_stars	\N	\N	2025-04-04 20:43:01.875098+00	1
9088110c-77be-40b2-943d-096fc04fcaed	75e4b7b0810f84d82ec6f194dd34f880ffd50a4fa8e31f19f7cf2e2d37053edb	2025-05-13 17:47:54.308612+00	20250513174748_add_room_no	\N	\N	2025-05-13 17:47:51.301234+00	1
1b756f34-df6c-4b02-a825-83053fd09ca2	a8ae4d5517dcd9897ceb9fcb5b7b1989de4e2c439d1fd869411780b44cf8305c	2025-04-05 21:38:25.935263+00	20250405213823_edit_subscription	\N	\N	2025-04-05 21:38:24.747412+00	1
db79e760-5031-4994-a269-ea09c8a890d8	ebdfdeffa00e757dc4df7dd7eed51ba1fff453ad0c9ecadd3e0aa03472e181ea	2025-04-06 18:35:30.779198+00	20250406183528_num_rated	\N	\N	2025-04-06 18:35:29.684748+00	1
e62074b3-69ef-4eee-8552-3345179af239	64b7f22ea69849feb3279ca007abd6284c616dc477b9ba40ea46d76f28980de6	2025-04-05 21:53:20.898931+00	20250405215317_edit_subs	\N	\N	2025-04-05 21:53:19.666874+00	1
7067ff33-0cc5-475c-b756-24060b3acf08	af2ad6e2849631c492fa30cebb4e1a48fb4b039faf3a22db9c08ea6e461dfd03	2025-04-06 00:49:14.615772+00	20250406004912_string_roll_no	\N	\N	2025-04-06 00:49:13.428858+00	1
aedeef49-6ad9-44fe-96ac-4d4ad1a35db9	a95cb617bc2324b6e732040a0e910031050b88453e7a10c982388faf384b5392	2025-04-25 06:19:15.382595+00	20250425061912_username_referral	\N	\N	2025-04-25 06:19:14.116832+00	1
274154a7-4931-42e1-9938-ed6a07ea21ee	c8d97486c0425001e3385fc9abb4b31da25f88fef9b433de5bc6fd0d87a20431	2025-04-07 16:38:35.246244+00	20250407163832_remove_num_rated	\N	\N	2025-04-07 16:38:33.891506+00	1
9da5d09e-0d70-4a59-967c-bf3a37ad6b69	07779e30ed39b50be9eb50c2f4b4369ea3c03aceb0b815592ded52689d1a3a84	2025-04-07 18:49:52.090827+00	20250407184949_read_messages	\N	\N	2025-04-07 18:49:50.86254+00	1
743a1c9c-cf84-496c-9a24-b3cbed94aa44	3bcbe36dad24994d1b7e33273a62d16993aeb0c6261fbd38de2d1dd8ab2a8274	2025-04-10 14:19:52.84998+00	20250410141841_password_reset	\N	\N	2025-04-10 14:19:51.659782+00	1
5b589058-cb16-4b13-a243-87c1686098a9	30b64ddcab3b438f9b9554a776d30ce0f1dab42295164afca91bac0a5c7a5b68	2025-05-13 11:54:47.631927+00	20250513115445_add_inactive_column	\N	\N	2025-05-13 11:54:46.439334+00	1
5c7654b6-a1ea-4daf-b64e-77480b2e4acf	b776208ef2f1b5d9eaca64ad8e96e21cd04af439215af4e53e7413302f94a8cd	2025-05-13 13:09:53.082903+00	20250513130949_change_messages	\N	\N	2025-05-13 13:09:51.432177+00	1
\.


--
-- Data for Name: admin; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.admin (id, email, mobile, password, name) FROM stdin;
4	cse230001075@iiti.ac.in	9027906684	$2b$10$wWGcQ0/UH3pMwdFQ9wz/leN9gXVQwlt.kcvYMLLAOoEyb6Ijc6Gb6	tanvi
\.


--
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.appointments (id, user_id, doctor_id, "dateTime", reason, "isDoctor", stars) FROM stdin;
104	19	2	2025-05-03 10:00:00	just want to call for a regular checkup	t	\N
120	19	7	2025-04-28 08:45:00	aise hi	f	\N
123	24	1	2025-05-18 12:40:00	Hello	f	\N
\.


--
-- Data for Name: chatbot; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.chatbot (id, user_id, "isBot", message, "sentAt") FROM stdin;
\.


--
-- Data for Name: doctor; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.doctor (name, mobile, email, password, reg_id, "desc", img, id, address, city, experience, "avgRating", "isInactive") FROM stdin;
Anushka	9113986886	anushkak8107@gmail.com	$2b$10$9WTK7SBDACcevKaw0gVuseNDoZB5.ysTANag7Fq8B/mw1gpUXONDG	13369872	Experienced Therapist	https://res.cloudinary.com/dt7a9meug/image/upload/v1744689562/usplohclssviih9o41av.png	1	DA Hostel	IIT Indore	10 years	2.814814814814815000000000000000	t
manan	777777777777	cse230001049@iiti.ac.in	$2b$10$.b5QI8P68ZHuhnb0UbZb6eWeVK7WCAMgzjVz/oDA80U2NUGMsgT1m	696969696969	mai cse mei hu		8	<Please Change>	<Please Change>	\N	0.000000000000000000000000000000	f
Suryansh Nagar	9082388554	me230003077@iiti.ac.in	$2b$10$uRN3NKN34sgQqq.S2W4SueC5lz/QebIem5FWFIdzaqcaLxHKyCAAm	12345678	Experienced Counselor		2	agra	agra	none 	0.000000000000000000000000000000	f
Tanvi 	9082388553	cse230001075@iiti.ac.in	$2b$10$DlpT0G.J5xhNxJFM6.uit.xx0PyEGgQfAeSUUWwDXxsBlppSIIUVS	1507	vadiya	https://res.cloudinary.com/dt7a9meug/image/upload/v1744296919/b4g5gb4xwtdkayqxstot.png	7	17, inner city ringroad, vijay nagar 	Agra, 282004	2 years counselling experience at IIT Delhi	2.500000000000000000000000000000	f
\.


--
-- Data for Name: doctor_leave; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.doctor_leave (id, doctor_id, date_start, date_end) FROM stdin;
2	1	2025-03-31 15:00:00	2025-04-01 12:00:00
4	1	2025-04-19 12:00:00	2025-04-19 12:00:00
5	1	2025-04-08 13:30:00	2025-04-09 12:00:00
6	7	2025-04-12 12:00:00	2025-04-14 16:30:00
1	1	2025-04-14 12:00:00	2025-04-14 12:00:00
7	1	2025-04-17 13:30:00	2025-04-19 13:30:00
8	1	2025-04-21 12:30:00	2025-04-21 12:30:00
9	2	2025-05-05 15:00:00	2025-05-09 16:00:00
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.events (id, title, description, "dateTime", venue, url) FROM stdin;
6	Faculty Advisor-Student Meet	Mandatory for all students. Pizza will be provided	2025-04-04 11:00:00	Gargi Seminar Hall	\N
2	Meet with DOSA sir	Meet with DOSA	2025-03-20 06:30:00	VSB Common Hall	\N
5	Stress Relief Workshop	Have fun	2025-04-02 06:30:00	Kalidas Seminar Hall	https://www.google.com
7	Counselor Speaker Session	A very renowned speaker will be taking a session	2025-04-07 09:00:00	Kalidas Seminar Hall	https://drive.google.com/file/d/1B3U16Pml8iJbR8mXgGNsYX-CfUrmwMBM/view?usp=sharing
22	Navigating your career path	expert counseling session	2025-04-29 11:00:00	Gargi Seminar Hall	\N
23	Mental Health Mastery	building resilience and wellbeing	2025-05-05 14:30:00	VCR (1D-105)	\N
\.


--
-- Data for Name: feelings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.feelings (user_id, mental_peace, sleep_quality, passion, less_stress_score, happiness_score, social_life) FROM stdin;
16	3	2	3	2	1	5
\.


--
-- Data for Name: notif; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.notif (id, user_id, chat_user, created_at) FROM stdin;
\.


--
-- Data for Name: otpverif; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.otpverif (id, "expiresAt", useremail, token) FROM stdin;
1	2025-03-30 23:06:34.206	cse230001075@iiti.ac.in	202779
2	2025-03-30 23:07:23.061	cse230001075@iiti.ac.in	988709
3	2025-03-30 23:10:40.006	cse230001075@iiti.ac.in	650934
4	2025-03-30 23:28:50.584	me230003077@iiti.ac.in	834072
22	2025-04-06 01:30:59.079	cse230001049@iiti.ac.in	144941
\.


--
-- Data for Name: passwordResetToken; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."passwordResetToken" (id, token, "expiresAt", "userId") FROM stdin;
21	4e60e767-8d8b-412d-bfcb-bcdb5acd6bfb	2025-04-10 14:37:22.836	7
22	19b21781-3956-47fe-9a7b-109dd6dc00ed	2025-04-10 14:38:21.53	7
\.


--
-- Data for Name: pastApp; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."pastApp" (id, note, doc_id, user_id, "createdAt", "isDoctor", stars) FROM stdin;
66		1	19	2025-05-12 09:57:47.827	f	\N
69	Doneeeeeeeee	1	24	2025-05-13 12:11:52.301	f	\N
\.


--
-- Data for Name: pastEvents; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."pastEvents" (id, title, description, "dateTime", venue) FROM stdin;
\.


--
-- Data for Name: referrals; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.referrals (id, user_id, doctor_id, referred_by, reason, username) FROM stdin;
8	19	1	Tanvi	Bad marks	Hello
9	19	1	Yatharth	Broken ankle and depression	manan
10	19	8	faculty advisor	test	manan
11	19	1	faculty advisor	test	manan
\.


--
-- Data for Name: requests; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.requests (id, user_id, doctor_id, "dateTime", reason, "forDoctor") FROM stdin;
88	19	8	2025-04-13 03:30:00		t
90	16	1	2025-04-20 10:30:00	aise hi	f
91	16	1	2025-04-20 12:00:00	hello	f
126	19	2	2025-04-28 15:30:00	i am having a migraine issue from past few days 	t
129	19	7	2025-05-06 16:30:00	heyy	t
134	19	1	2025-05-14 12:40:00	hello	f
135	19	1	2025-05-14 12:40:00	hello	f
\.


--
-- Data for Name: slots; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.slots (id, doctor_id, starting_time) FROM stdin;
159	1	12:40:00
160	1	13:00:00
161	1	13:20:00
165	2	15:00:00
166	2	15:30:00
167	2	16:00:00
53	7	12:00:00
54	7	14:15:00
55	7	16:30:00
56	7	17:45:00
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."user" (id, username, mobile, email, password, alt_mobile, "publicKey", department, "rollNo", "acadProg", gender, "roomNo") FROM stdin;
17	Yatharth	7123563796	mt2345678912@iiti.ac.in	$2b$10$9Nuyhx9DK1PbhIfEgR/I..Chyh.8NxFRIgL7ZmvrXd8SlEweWSYcu	9123781027		Space Science	2345678912	PG	Female	
20	Vighnesh	6376436983	che230008039@iiti.ac.in	$2b$10$IJajlaACdVa1.7klNrgC9u3bWgj6jhE6eFi6pxWLrRD8/Ot.rysQK	9368775203	MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2oajvI6Lcfm9Ghve1P9t\nyl75fPHgJKEy3M6Iz2TLrVaocHJ/DMVv8aUvQc/yFib84TknbAzzmSZVg830uOIr\n0KNIzXVNlhZTuHwEaSJA5nuu5gZDaGfu8+4l6i6vZ4s6eOSx9tUpjB22jwb4nHsy\nDXB2pJx2KStSjKTSlZSFRpHVJ49u9C4MQuP17iTPv+5FR65i6eVkBYK9hlgYRTq5\nBzxMUOCJCm5wtMyJB7JLUjYr8WUBm6yaDur5MgxDjxwevU6ATGYuqmtLLv/idZgs\nGBh4oiGXXrwO5dNNyW5SizVaecZcSp8+aKIUTmeE7FXfBT35fBBUmreuDnBSKJRz\nzwIDAQAB	Chemical	230008039	UG	Male	
16	Shreya	7123563790	phd2345678910@iiti.ac.in	$2b$10$xzCeo0Q0j/ZJNOktPKPyh.iarr5oDHzUL5LG4/VWA/ij/r50O7MyW	9123781027		Mechanical	2345678910	PHD	Female	
22	tanveeiii	9027906684	cse230001075@iiti.ac.in	$2b$10$5rZzQhaNTy1UiF2/TK1e4OUONEUJ5h9a12bOKHdL8ihkR9GmAi/gC	9368775203	MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhh1fjx9AlshbHkoZdIQ3\nvbPuLh3SDFY0aRfHlTOxnbcRrnS3X7N3lGvPWtYnlvc5Yvdg956WQ9KfwpNU9OVN\nUwNoFnvrj53bin00XN8IPMn0wgHjI0ba/RXyp1trLTO3Ne47rBlriG1agCr9sEi+\n3bHCCLqmGWAoxTYsbMaIHUpPeTB45emsevjKqG7fuyFXwPmJezjs0niT800P8MrR\nbOLRhVYkZWA3pk+BlnrToBvvxQBu+BCAFakR8wyiPyejT7+NGTS9R5XBiW68q0aP\nz5OePkNypIXffx/So7LzT1rLma4NdJMpZCUkCtwiuFYHSNCeRbVBr39oo3BxivgE\ndwIDAQAB	Computer Science	230001075	UG	Female	
23	xtyz	9082388554	ce220004045@iiti.ac.in	$2b$10$GGCCBPerPXAu/7qhOZiBju5aygaPhNd8WVQk8KeJcCdNowyv1LvJS	9930981686	MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvpxMikoj/2aoyVZQ3QI5\n4Ofi8Q5cNSKNb+O6NplDMAFbBZmQtEre7nFZadCxurqtZCtJaFeVXLCJHRGnTrRR\nYCYzPSEbM7h4ux8tedhi+gYx9Lubfmufunq68gVZPcRMD+pC/zhXG+2u8wi1KBIU\nq5hJd4L4XL1twMHUy2UQ9uJvvNI54AwPP2XLlSH8VxzJ1IoEXvtZ8kHoFRToVYgP\ngh1BvrwHDy0s5clQqH8um0M+aC682v+UryAK5kiHUae6Keo60RtyXU3kEfoTt8Vn\nuYjUfjfBvC6hD9XnMICxlq3i7/gxMm7A+bMhODSqQkPOErgzj3EABpiUknj50ia8\nDQIDAQAB	Civil	220004045	UG	Male	
19	manan	7014649539	cse230001049@iiti.ac.in	$2b$10$lva7FMmJkKUyN6yTdEV/JOQlSlDrUa541Vu6mUt0k6tavpZd2tNQ2	7870690030	MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqnb/frugThTtLs+wU1Oc\nyCQTzyBaF3aDoNl38PUMkXWfBdhxZxHR+F5AgkCIiIxkqRpEYPxqCcgZ5EKSIoCO\nCJyqWU+ni6bATQ821mgVNMfr9pPGEiz9tDW+pkfNGhTLOamQsqTrnRuyKYkgDoIF\nYNXts19Y4hiwAIxTLCiKb+kGTmf9zG9bQBX6H+xshHUIwiKDy1YXma0gtf3fiixJ\niyIJ5GTkWbLXzSI+bgeWZy+YgKNz7MvX+no9F8t77NT67xEP3kFGNrQD/A05xfNi\nm3H1/Od1Yd/m8WUvEI2vtKrSyRzfC+Mb+j6hBLuO9asFNSvukwSss5eaVZAzWaQu\nCwIDAQAB	Computer Science	230001049	UG	Male	301 A2
24	Kartikey	9711249305	sse240021008@iiti.ac.in	$2b$10$eLSugEPdXJ2RxJpf.CXxNO/APc0qw4FFa.Mos2/2Mg3ERubKNvGzS	1234567890	MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxHLSYx84erM1hhxL/aN9\nPEf12atYf+D7In23SROX803vBqqug9VSvuXfwJAohmRdMW4dXW1upVMuFm2kg317\nsPQzfv6H1RRHElkpzXSC57Jlwrcb8w7DZYOYL/gS94tE000jeqBUGBsYM3/0d56Z\nwYJzkLICI7aB2j2pgUPLtBmfrI30ecYFlLj2HKSlvBjBM9GPu9HHeS9ff3p/T+1J\nHqAKqEO3bb7lNapLlofgPtDAh6Xq6Y02r9Aaa9wpQplVHkNiQTwHJnWB5EVwpwMH\n+xmN2q8j4ix13snjkJ687G5tkB/GAhnLtC/TzqK23wUjP31i69Jmlb2JCCQA8lZ7\n+QIDAQAB	Astronomy, Astrophysics and Space	240021008	UG	Male	402-A1
\.


--
-- Name: DocCertification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public."DocCertification_id_seq"', 255, true);


--
-- Name: DocEducation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public."DocEducation_id_seq"', 136, true);


--
-- Name: EmergencyApp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public."EmergencyApp_id_seq"', 1, true);


--
-- Name: admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.admin_id_seq', 4, true);


--
-- Name: appointments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.appointments_id_seq', 134, true);


--
-- Name: chatbot_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.chatbot_id_seq', 1, false);


--
-- Name: doctor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.doctor_id_seq', 10, true);


--
-- Name: doctor_leave_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.doctor_leave_id_seq', 9, true);


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.events_id_seq', 23, true);


--
-- Name: notif_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.notif_id_seq', 1, false);


--
-- Name: otpverif_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.otpverif_id_seq', 34, true);


--
-- Name: passwordResetToken_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public."passwordResetToken_id_seq"', 23, true);


--
-- Name: pastApp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public."pastApp_id_seq"', 69, true);


--
-- Name: pastEvents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public."pastEvents_id_seq"', 1, false);


--
-- Name: referrals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.referrals_id_seq', 11, true);


--
-- Name: requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.requests_id_seq', 135, true);


--
-- Name: slots_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.slots_id_seq', 167, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.user_id_seq', 24, true);


--
-- Name: DocCertification DocCertification_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."DocCertification"
    ADD CONSTRAINT "DocCertification_pkey" PRIMARY KEY (id);


--
-- Name: DocEducation DocEducation_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."DocEducation"
    ADD CONSTRAINT "DocEducation_pkey" PRIMARY KEY (id);


--
-- Name: EmergencyApp EmergencyApp_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."EmergencyApp"
    ADD CONSTRAINT "EmergencyApp_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: Subscription Subscription_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id);


--
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);


--
-- Name: chatbot chatbot_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.chatbot
    ADD CONSTRAINT chatbot_pkey PRIMARY KEY (id);


--
-- Name: doctor_leave doctor_leave_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.doctor_leave
    ADD CONSTRAINT doctor_leave_pkey PRIMARY KEY (id);


--
-- Name: doctor doctor_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.doctor
    ADD CONSTRAINT doctor_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: feelings feelings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.feelings
    ADD CONSTRAINT feelings_pkey PRIMARY KEY (user_id);


--
-- Name: notif notif_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notif
    ADD CONSTRAINT notif_pkey PRIMARY KEY (id);


--
-- Name: otpverif otpverif_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.otpverif
    ADD CONSTRAINT otpverif_pkey PRIMARY KEY (id);


--
-- Name: passwordResetToken passwordResetToken_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."passwordResetToken"
    ADD CONSTRAINT "passwordResetToken_pkey" PRIMARY KEY (id);


--
-- Name: pastApp pastApp_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."pastApp"
    ADD CONSTRAINT "pastApp_pkey" PRIMARY KEY (id);


--
-- Name: pastEvents pastEvents_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."pastEvents"
    ADD CONSTRAINT "pastEvents_pkey" PRIMARY KEY (id);


--
-- Name: referrals referrals_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.referrals
    ADD CONSTRAINT referrals_pkey PRIMARY KEY (id);


--
-- Name: requests requests_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (id);


--
-- Name: slots slots_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.slots
    ADD CONSTRAINT slots_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: EmergencyApp_email_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "EmergencyApp_email_key" ON public."EmergencyApp" USING btree (email);


--
-- Name: Subscription_endpoint_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "Subscription_endpoint_key" ON public."Subscription" USING btree (endpoint);


--
-- Name: admin_email_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX admin_email_key ON public.admin USING btree (email);


--
-- Name: admin_mobile_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX admin_mobile_key ON public.admin USING btree (mobile);


--
-- Name: doctor_email_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX doctor_email_key ON public.doctor USING btree (email);


--
-- Name: doctor_mobile_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX doctor_mobile_key ON public.doctor USING btree (mobile);


--
-- Name: doctor_reg_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX doctor_reg_id_key ON public.doctor USING btree (reg_id);


--
-- Name: passwordResetToken_token_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "passwordResetToken_token_key" ON public."passwordResetToken" USING btree (token);


--
-- Name: user_email_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX user_email_key ON public."user" USING btree (email);


--
-- Name: user_mobile_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX user_mobile_key ON public."user" USING btree (mobile);


--
-- Name: user_rollNo_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "user_rollNo_key" ON public."user" USING btree ("rollNo");


--
-- Name: user_username_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX user_username_key ON public."user" USING btree (username);


--
-- Name: DocCertification DocCertification_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."DocCertification"
    ADD CONSTRAINT "DocCertification_doctor_id_fkey" FOREIGN KEY (doctor_id) REFERENCES public.doctor(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DocEducation DocEducation_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."DocEducation"
    ADD CONSTRAINT "DocEducation_doctor_id_fkey" FOREIGN KEY (doctor_id) REFERENCES public.doctor(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: EmergencyApp EmergencyApp_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."EmergencyApp"
    ADD CONSTRAINT "EmergencyApp_doctor_id_fkey" FOREIGN KEY (doctor_id) REFERENCES public.doctor(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_doctorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES public.doctor(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: appointments appointments_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: appointments appointments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chatbot chatbot_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.chatbot
    ADD CONSTRAINT chatbot_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: doctor_leave doctor_leave_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.doctor_leave
    ADD CONSTRAINT doctor_leave_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: feelings feelings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.feelings
    ADD CONSTRAINT feelings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notif notif_chat_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notif
    ADD CONSTRAINT notif_chat_user_fkey FOREIGN KEY (chat_user) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: notif notif_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notif
    ADD CONSTRAINT notif_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: pastApp pastApp_doc_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."pastApp"
    ADD CONSTRAINT "pastApp_doc_id_fkey" FOREIGN KEY (doc_id) REFERENCES public.doctor(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: pastApp pastApp_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."pastApp"
    ADD CONSTRAINT "pastApp_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: referrals referrals_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.referrals
    ADD CONSTRAINT referrals_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: referrals referrals_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.referrals
    ADD CONSTRAINT referrals_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: requests requests_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: requests requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: slots slots_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.slots
    ADD CONSTRAINT slots_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: neondb_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

