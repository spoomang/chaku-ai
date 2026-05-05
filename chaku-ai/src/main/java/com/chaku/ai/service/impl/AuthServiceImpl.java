package com.chaku.ai.service.impl;

import com.chaku.ai.model.auth.AuthRequest;
import com.chaku.ai.model.auth.AuthResponse;
import com.chaku.ai.repository.UserRepository;
import com.chaku.ai.security.JwtUtil;
import com.chaku.ai.service.AuthService;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public AuthResponse authenticate(AuthRequest request) {
        boolean authenticated = switch (request.type()) {
            case "email" -> userRepository.findByEmailAndPassword(request.userId(), request.password()).isPresent();
            case "mobile" -> userRepository.findByMobileAndPassword(request.userId(), request.password()).isPresent();
            default -> throw new IllegalArgumentException("Invalid auth type");
        };
        if (!authenticated) {
            throw new IllegalArgumentException("Authentication failed");
        }
        return new AuthResponse(jwtUtil.generateToken(request.userId()));
    }
}
