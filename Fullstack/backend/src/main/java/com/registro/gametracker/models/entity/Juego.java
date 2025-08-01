package com.registro.gametracker.models.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "historial")
public class Juego {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private String nombre;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String plataforma;
    private String genero;
    private String anno;
    private String puntaje;
    private String completado;
    private String horas;

}