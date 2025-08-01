package com.registro.gametracker.service.auth;

import com.registro.gametracker.models.dto.auth.AuthResponse;
import com.registro.gametracker.models.dto.auth.AuthenticationRequest;
import com.registro.gametracker.models.dto.auth.RegisterRequest;

public interface AuthService {

    AuthResponse register (RegisterRequest request);

    AuthResponse authenticate (AuthenticationRequest request);
}
