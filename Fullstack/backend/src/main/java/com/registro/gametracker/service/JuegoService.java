package com.registro.gametracker.service;

import com.registro.gametracker.models.EstadisticasJuego;
import com.registro.gametracker.models.GraficoPlataformas;
import com.registro.gametracker.models.Juego;
import com.registro.gametracker.repository.JuegoRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class JuegoService {

    private final JuegoRepository juegoRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public JuegoService(JuegoRepository juegoRepository) {
        this.juegoRepository = juegoRepository;
    }

    public List<Juego> obtenerTodos() {
        return juegoRepository.findAll();
    }

    public Optional<Juego> obtenerPorId(Long id) {
        return juegoRepository.findById(id);
    }

    public Juego guardar(Juego juego) {
        return juegoRepository.save(juego);
    }

    public void eliminar(Long id) {
        juegoRepository.deleteById(id);
    }

    public EstadisticasJuego calcularEstadisticasPorGenero(String genero) {
        List<Juego> juegos = juegoRepository.findAll().stream()
                .filter(j -> genero.equalsIgnoreCase(j.getGenero()))
                .toList();

        EstadisticasJuego stats = new EstadisticasJuego();
        stats.totalJuegos = juegos.size();

        stats.juegosCompletados = (int) juegos.stream()
                .filter(j -> j.getCompletado().equalsIgnoreCase("si"))
                .count();

        stats.horasTotales = (int) juegos.stream()
                .mapToDouble(j -> {
                    try {
                        return Double.parseDouble(j.getHoras().replace(",", "."));
                    } catch (NumberFormatException e) {
                        return 0.0;
                    }
                })
                .sum();

        stats.puntajePromedio = juegos.isEmpty()
                ? "N/A"
                : juegos.stream()
                .collect(Collectors.groupingBy(Juego::getPuntaje, Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");

        stats.plataformaPopular = juegos.stream()
                .collect(Collectors.groupingBy(Juego::getPlataforma, Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey).orElse("");

        stats.annoMasActivo = Integer.parseInt(juegos.stream()
                .collect(Collectors.groupingBy(Juego::getAnno, Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey).orElse(String.valueOf(0)));

        stats.porcentajeCompletado = stats.totalJuegos > 0
                ? Math.round((stats.juegosCompletados * 100f) / stats.totalJuegos)
                : 0;

        stats.promedioHorasPorJuego = stats.totalJuegos > 0
                ? Math.round(stats.horasTotales / (float) stats.totalJuegos)
                : 0;

        return stats;
    }

    public GraficoPlataformas obtenerChartDataAgrupadoPor(String campo) {
        String jpql = "SELECT j." + campo + ", COUNT(j) FROM Juego j GROUP BY j." + campo + " ORDER BY j." + campo;
        List<Object[]> resultados = entityManager.createQuery(jpql, Object[].class).getResultList();

        List<String> labels = new ArrayList<>();
        List<Long> data = new ArrayList<>();

        for (Object[] row : resultados) {
            labels.add((String) row[0]);
            data.add(((Number) row[1]).longValue());
        }

        return new GraficoPlataformas(labels, data);
    }

}
