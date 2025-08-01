package com.registro.gametracker.controller;

import com.registro.gametracker.models.dto.juego.EstadisticasGenerales;
import com.registro.gametracker.service.EstadisticasService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/estadisticas")
@CrossOrigin(origins = "*")
public class EstadisticasController {

    private final EstadisticasService estadisticasService;

    public EstadisticasController(EstadisticasService estadisticasService) {
        this.estadisticasService = estadisticasService;
    }

    @GetMapping("/generales")
    public EstadisticasGenerales obtenerEstadisticasGenerales() {
        return estadisticasService.obtenerEstadisticas();
    }
}
