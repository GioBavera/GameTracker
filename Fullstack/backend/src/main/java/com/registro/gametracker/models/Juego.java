package com.registro.gametracker.models;

import jakarta.persistence.*;

@Entity
@Table(name = "historial") // Tabla de la base de datos
public class Juego {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private String nombre;
    private String plataforma;
    private String genero;
    private String anno;
    private String puntaje;
    private String completado;
    private String horas;

    public void setId(Long id) {
        this.id = id;
    }

    public String getAnno() {
        return anno;
    }

    public String getPlataforma() {
        return plataforma;
    }

    public String getPuntaje() {
        return puntaje;
    }

    public String getCompletado() {
        return completado;
    }

    public String getHoras() {
        return horas;
    }

    public String getGenero() {
        return genero;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setPlataforma(String plataforma) {
        this.plataforma = plataforma;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public void setAnno(String anno) {
        this.anno = anno;
    }

    public void setPuntaje(String puntaje) {
        this.puntaje = puntaje;
    }

    public void setCompletado(String completado) {
        this.completado = completado;
    }

    public void setHoras(String horas) {
        this.horas = horas;
    }
}