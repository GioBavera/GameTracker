package com.registro.gametracker.models.dto.juego;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EstadisticasGenerales {
    private int totalJuegos;
    private int completadosJuegos;
    private int horas;
    private String puntajePromedio;
    private String plataformaPopular;
    private int annoActivo;
    private float porcentajeTerminado;
    private int promedioHoras;

}
