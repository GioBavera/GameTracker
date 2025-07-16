package com.registro.gametracker.controller;

import com.registro.gametracker.models.EstadisticasGenerales;
import com.registro.gametracker.service.EstadisticasService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/estadisticas")
@CrossOrigin(origins = "*") // o limita a tu frontend (ej: http://localhost:4200)
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
