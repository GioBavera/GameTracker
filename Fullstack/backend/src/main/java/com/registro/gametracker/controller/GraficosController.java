package com.registro.gametracker.controller;

import com.registro.gametracker.models.dto.juego.Grafico;
import com.registro.gametracker.service.JuegoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/graficos")
public class GraficosController {

    @Autowired
    private JuegoService juegoService;

    @GetMapping("/{campo}")
    public Grafico getChartData(
            @PathVariable String campo,
            @RequestParam(required = false) String genero) {

        if (genero != null) {
            return juegoService.obtenerChartDataPorCampoYGenero(campo, genero);
        } else {
            return juegoService.obtenerChartDataAgrupadoPor(campo);
        }
    }

}