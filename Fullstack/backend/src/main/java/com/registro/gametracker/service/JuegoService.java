package com.registro.gametracker.service;

import com.registro.gametracker.models.EstadisticasJuego;
import com.registro.gametracker.models.GraficoPlataformas;
import com.registro.gametracker.models.Juego;
import com.registro.gametracker.models.User;
import com.registro.gametracker.repository.JuegoRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class JuegoService {

    @PersistenceContext
    private EntityManager entityManager;

    private final JuegoRepository juegoRepository;
    private final UsuarioAutenticadoService usuarioAutenticadoService;

    public JuegoService(JuegoRepository juegoRepository, UsuarioAutenticadoService usuarioAutenticadoService) {
        this.juegoRepository = juegoRepository;
        this.usuarioAutenticadoService = usuarioAutenticadoService;
    }

    public List<Juego> obtenerDelUsuarioActual() {
        User user = usuarioAutenticadoService.getUsuarioActual();
        return juegoRepository.findByUser(user);
    }

    public Optional<Juego> obtenerPorIdDelUsuario(Long id) {
        User user = usuarioAutenticadoService.getUsuarioActual();
        return juegoRepository.findByIdAndUser(id, user);
    }

    public Juego guardarParaUsuario(Juego juego) {
        User user = usuarioAutenticadoService.getUsuarioActual();
        juego.setUser(user);
        return juegoRepository.save(juego);
    }

    public void eliminarSiEsDelUsuario(Long id) throws AccessDeniedException {
        User user = usuarioAutenticadoService.getUsuarioActual();
        Juego juego = juegoRepository.findById(id).orElseThrow();

        if (!juego.getUser().equals(user)) {
            throw new AccessDeniedException("No puedes eliminar este juego.");
        }

        juegoRepository.delete(juego);
    }

    public EstadisticasJuego calcularEstadisticasPorGenero(String genero) {
        User user = usuarioAutenticadoService.getUsuarioActual();
        List<Juego> juegos = juegoRepository.findByUser(user).stream()
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
        User user = usuarioAutenticadoService.getUsuarioActual();
        List<Juego> juegos = juegoRepository.findByUser(user);

        Map<String, Long> agrupado = juegos.stream()
                .collect(Collectors.groupingBy(j -> {
                    switch (campo) {
                        case "anno": return j.getAnno();
                        case "plataforma": return j.getPlataforma();
                        case "puntaje": return j.getPuntaje();
                        case "genero": return j.getGenero();
                        default: throw new IllegalArgumentException("Campo no soportado: " + campo);
                    }
                }, Collectors.counting()));

        List<String> labels = new ArrayList<>(agrupado.keySet());
        List<Long> data = labels.stream().map(agrupado::get).toList();

        return new GraficoPlataformas(labels, data);
    }

    public GraficoPlataformas obtenerChartDataPorCampoYGenero(String campoAgrupacion, String generoFiltro) {
        User user = usuarioAutenticadoService.getUsuarioActual();
        List<Juego> juegos = juegoRepository.findByUser(user).stream()
                .filter(j -> generoFiltro.equalsIgnoreCase(j.getGenero()))
                .toList();

        Map<String, Long> agrupado = juegos.stream()
                .collect(Collectors.groupingBy(j -> {
                    switch (campoAgrupacion) {
                        case "anno": return j.getAnno();
                        case "plataforma": return j.getPlataforma();
                        default: throw new IllegalArgumentException("Campo no soportado: " + campoAgrupacion);
                    }
                }, Collectors.counting()));

        List<String> labels = new ArrayList<>(agrupado.keySet());
        List<Long> data = labels.stream().map(agrupado::get).toList();

        return new GraficoPlataformas(labels, data);
    }
}