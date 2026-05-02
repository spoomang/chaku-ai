package com.chaku.ai.controller;

import com.chaku.ai.model.ApiResponse;
import com.chaku.ai.model.auth.AuthRequest;
import com.chaku.ai.model.auth.AuthResponse;
import com.chaku.ai.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/authenticate")
    public ResponseEntity<ApiResponse<AuthResponse>> authenticate(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(authService.authenticate(request)));
    }
}
