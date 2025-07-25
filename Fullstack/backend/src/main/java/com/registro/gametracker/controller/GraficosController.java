package com.registro.gametracker.controller;

import com.registro.gametracker.models.GraficoPlataformas;
import com.registro.gametracker.service.JuegoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/graficos")
public class GraficosController {

    @Autowired
    private JuegoService juegoService;

    @GetMapping("/{campo}")
    public GraficoPlataformas getChartData(
            @PathVariable String campo,
            @RequestParam(required = false) String genero) {

        if (genero != null) {
            return juegoService.obtenerChartDataPorCampoYGenero(campo, genero);
        } else {
            return juegoService.obtenerChartDataAgrupadoPor(campo);
        }
    }



}