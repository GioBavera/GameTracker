CREATE TABLE public.historial (
    id BIGINT PRIMARY KEY DEFAULT nextval('public.historial_id_seq1'::regclass),
    nombre VARCHAR(255),
    plataforma VARCHAR(255),
    genero VARCHAR(255),
    anno VARCHAR(255),
    puntaje VARCHAR(255),
    completado VARCHAR(255),
    horas VARCHAR(255)
);

CREATE SEQUENCE public.historial_id_seq1
    START WITH 1
    INCREMENT BY 1
    OWNED BY public.historial.id;

