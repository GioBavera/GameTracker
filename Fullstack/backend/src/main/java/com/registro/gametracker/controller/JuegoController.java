package com.registro.gametracker.controller;

import com.registro.gametracker.models.EstadisticasJuego;
import com.registro.gametracker.models.Juego;
import com.registro.gametracker.service.JuegoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    }
}
