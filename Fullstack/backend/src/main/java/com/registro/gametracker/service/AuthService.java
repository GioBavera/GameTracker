package com.registro.gametracker.service;

import com.registro.gametracker.models.AuthResponse;
import com.registro.gametracker.models.AuthenticationRequest;
import com.registro.gametracker.models.RegisterRequest;

public interface AuthService {

    AuthResponse register (RegisterRequest request);

    AuthResponse authenticate (AuthenticationRequest request);
}
