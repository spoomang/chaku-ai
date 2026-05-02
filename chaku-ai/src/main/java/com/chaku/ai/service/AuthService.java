package com.chaku.ai.service;

import com.chaku.ai.model.auth.AuthRequest;
import com.chaku.ai.model.auth.AuthResponse;

public interface AuthService {
    AuthResponse authenticate(AuthRequest request);
}
