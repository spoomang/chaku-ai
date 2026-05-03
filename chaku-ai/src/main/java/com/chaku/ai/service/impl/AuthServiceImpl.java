package com.chaku.ai.service.impl;

import com.chaku.ai.service.AuthService;

import com.chaku.ai.model.auth.AuthRequest;
import com.chaku.ai.model.auth.AuthResponse;
import com.chaku.ai.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Base64;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    public AuthServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public AuthResponse authenticate(AuthRequest request) {
        boolean authenticated = switch (request.type()) {
            case "email" -> userRepository.findByEmailAndPassword(request.userId(), request.password()).isPresent();
            case "mobile" -> userRepository.findByMobileAndPassword(request.userId(), request.password()).isPresent();
            default -> throw new IllegalArgumentException("Invalid auth type: must be 'email' or 'mobile'");
        };
        if (!authenticated) {
            throw new IllegalArgumentException("Authentication failed");
        }
        String tokenData = request.userId() + "|" + System.currentTimeMillis();
        String token = Base64.getEncoder().encodeToString(tokenData.getBytes());
        return new AuthResponse(token);
    }
}
