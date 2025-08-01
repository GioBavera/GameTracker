package com.registro.gametracker.service.auth;

import com.registro.gametracker.models.dto.auth.AuthResponse;
import com.registro.gametracker.models.dto.auth.AuthenticationRequest;
import com.registro.gametracker.models.dto.auth.RegisterRequest;
import com.registro.gametracker.models.entity.User;
import com.registro.gametracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService{

    // Guarda o buscar usuarios en la base de datos
    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    // Servicio que genera tokens JWT
    private final JwtService jwtService;

    // Se encarga de autentificar los usuarios
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse register(RegisterRequest request) {
        var user = User.builder()
                .firstName(request.getFirstName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        userRepository.save(user);  // Guarda el usuario en la base
        var jwtToken = jwtService.generateToken(user);  // Crea el JWT
        return AuthResponse.builder().token(jwtToken).build();  // Devuelve el token
    }

    @Override
    public AuthResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = userRepository.findUserByEmail(request.getEmail()).orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder().token(jwtToken).build();
    }
}
