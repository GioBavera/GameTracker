package com.registro.gametracker.controller;

import com.registro.gametracker.models.EstadisticasJuego;
import com.registro.gametracker.models.Juego;
import com.registro.gametracker.service.JuegoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/juegos")
public class JuegoController {

    /*
    private final JuegoService juegoService;

    public JuegoController(JuegoService juegoService) {
        this.juegoService = juegoService;
    }

    @GetMapping
    public List<Juego> listar() {
        return juegoService.obtenerTodos();
    }

    @GetMapping("/{id}")
    public Optional<Juego> obtener(@PathVariable Long id) {
        return juegoService.obtenerPorId(id);
    }

    @PostMapping("/adicionar")
    public Juego crear(@RequestBody Juego juego) {

        return juegoService.guardar(juego);
    }

    @PutMapping("/{id}")
    public Juego actualizar(@PathVariable Long id, @RequestBody Juego juego) {
        juego.setId(id);
        return juegoService.guardar(juego);
    }

    @DeleteMapping("/eliminar/{id}")
    public void eliminar(@PathVariable Long id) {
        juegoService.eliminar(id);
    }

    @GetMapping("/stats/genero/{genero}")
    public ResponseEntity<EstadisticasJuego> getStatsPorGenero(@PathVariable String genero) {
        return ResponseEntity.ok(juegoService.calcularEstadisticasPorGenero(genero));
    }*/

    private final JuegoService juegoService;

    public JuegoController(JuegoService juegoService) {
        this.juegoService = juegoService;
    }

    // 🔹 Listar solo mis juegos
    @GetMapping
    public List<Juego> listar() {
        return juegoService.obtenerDelUsuarioActual();
    }

    // 🔹 Obtener solo si es mío
    @GetMapping("/{id}")
    public ResponseEntity<Juego> obtener(@PathVariable Long id) {
        return juegoService.obtenerPorIdDelUsuario(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔹 Crear asociado a mi usuario
    @PostMapping("/adicionar")
    public Juego crear(@RequestBody Juego juego) {
        return juegoService.guardarParaUsuario(juego);
    }

    // 🔹 Actualizar solo si es mío
    @PutMapping("/{id}")
    public ResponseEntity<Juego> actualizar(@PathVariable Long id, @RequestBody Juego juego) {
        Optional<Juego> existente = juegoService.obtenerPorIdDelUsuario(id);
        if (existente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        juego.setId(id);
        return ResponseEntity.ok(juegoService.guardarParaUsuario(juego));
    }

    // 🔹 Eliminar solo si es mío
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        try {
            juegoService.eliminarSiEsDelUsuario(id);
            return ResponseEntity.noContent().build();
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(403).build();
        }
    }

    // 🔹 Estadísticas (si querés filtrar solo mis juegos, avisame)
    @GetMapping("/stats/genero/{genero}")
    public ResponseEntity<EstadisticasJuego> getStatsPorGenero(@PathVariable String genero) {
        return ResponseEntity.ok(juegoService.calcularEstadisticasPorGenero(genero));
    }

}
