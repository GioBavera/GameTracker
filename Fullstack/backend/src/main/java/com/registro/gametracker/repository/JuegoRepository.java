package com.registro.gametracker.repository;

import com.registro.gametracker.models.Juego;
import com.registro.gametracker.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface JuegoRepository extends JpaRepository<Juego, Long> {
    List<Juego> findByUser(User user);
    Optional<Juego> findByIdAndUser(Long id, User user);
}
