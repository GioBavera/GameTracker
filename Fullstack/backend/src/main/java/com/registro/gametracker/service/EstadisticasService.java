package com.registro.gametracker.service;

import com.registro.gametracker.models.EstadisticasGenerales;
import com.registro.gametracker.models.Juego;
import com.registro.gametracker.models.User;
import com.registro.gametracker.repository.JuegoRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class EstadisticasService {

    private final JuegoRepository juegoRepository;
    private final UsuarioAutenticadoService usuarioAutenticadoService;

    public EstadisticasService(JuegoRepository juegoRepository, UsuarioAutenticadoService usuarioAutenticadoService) {
        this.juegoRepository = juegoRepository;
        this.usuarioAutenticadoService = usuarioAutenticadoService;
    }

    public EstadisticasGenerales obtenerEstadisticas() {
        User user = usuarioAutenticadoService.getUsuarioActual();
        List<Juego> juegos = juegoRepository.findByUser(user);

        int total = juegos.size();
        int completados = (int) juegos.stream()
                .filter(j -> "si".equalsIgnoreCase(j.getCompletado()))
                .count();

        int horasTotales = juegos.stream()
                .map(Juego::getHoras)
                .filter(Objects::nonNull)
                .mapToInt(h -> {
                    try {
                        return Integer.parseInt(h);
                    } catch (NumberFormatException e) {
                        return 0;
                    }
                })
                .sum();

        String puntajePromedio = juegos.stream()
                .map(Juego::getPuntaje)
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(p -> p, Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");

        String plataformaPopular = juegos.stream()
                .map(Juego::getPlataforma)
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(p -> p, Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("Desconocido");

        int annoMasActivo = juegos.stream()
                .map(Juego::getAnno)
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(a -> a, Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(e -> {
                    try {
                        return Integer.parseInt(e.getKey());
                    } catch (NumberFormatException ex) {
                        return 0;
                    }
                })
                .orElse(0);

        float porcentajeTerminado = total == 0 ? 0 : Math.round((completados * 1000f) / total) / 10f;
        int promedioHoras = total == 0 ? 0 : horasTotales / total;

        EstadisticasGenerales estadisticas = new EstadisticasGenerales();
        estadisticas.setTotalJuegos(total);
        estadisticas.setCompletadosJuegos(completados);
        estadisticas.setHoras(horasTotales);
        estadisticas.setPuntajePromedio(puntajePromedio);
        estadisticas.setPlataformaPopular(plataformaPopular);
        estadisticas.setAnnoActivo(annoMasActivo);
        estadisticas.setPorcentajeTerminado(porcentajeTerminado);
        estadisticas.setPromedioHoras(promedioHoras);

        return estadisticas;
    }
}
