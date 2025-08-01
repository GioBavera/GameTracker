package com.registro.gametracker.controller;

import com.registro.gametracker.models.dto.juego.EstadisticasJuego;
import com.registro.gametracker.models.entity.Juego;
import com.registro.gametracker.service.JuegoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/juegos")
public class JuegoController {

    private final JuegoService juegoService;

    public JuegoController(JuegoService juegoService) {
        this.juegoService = juegoService;
    }

    @GetMapping
    public List<Juego> listar() {
        return juegoService.listarJuegos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Juego> obtener(@PathVariable Long id) {
        return juegoService.obtenerJuego(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/adicionar")
    public Juego crear(@RequestBody Juego juego) {
        return juegoService.guardar(juego);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Juego> actualizar(@PathVariable Long id, @RequestBody Juego juego) {
        Optional<Juego> existente = juegoService.obtenerJuego(id);
        if (existente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        juego.setId(id);
        return ResponseEntity.ok(juegoService.guardar(juego));
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        try {
            juegoService.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(403).build();
        }
    }

    @GetMapping("/stats/genero/{genero}")
    public ResponseEntity<EstadisticasJuego> getStatsPorGenero(@PathVariable String genero) {
        return ResponseEntity.ok(juegoService.calcularEstadisticasPorGenero(genero));
    }
}
