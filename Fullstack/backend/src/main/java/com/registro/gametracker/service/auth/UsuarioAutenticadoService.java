package com.registro.gametracker.service.auth;

import com.registro.gametracker.models.entity.User;
import com.registro.gametracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsuarioAutenticadoService {

    private final UserRepository userRepository;

    public User getUsuarioActual() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findUserByEmail(email).orElseThrow();
    }
}
