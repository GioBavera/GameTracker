package com.registro.gametracker.service;

import com.registro.gametracker.models.EstadisticasGenerales;
import com.registro.gametracker.models.Juego;
import com.registro.gametracker.repository.JuegoRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class EstadisticasService {

    private final JuegoRepository juegoRepository;

    public EstadisticasService(JuegoRepository juegoRepository) {
        this.juegoRepository = juegoRepository;
    }

    public EstadisticasGenerales obtenerEstadisticas() {
        List<Juego> juegos = juegoRepository.findAll();

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

        // Se busca la calificacion que mas aparece
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
