package com.chaku.ai.model.user;

import java.util.UUID;

public record UserResponse(Long id, UUID memberId, String name, String shortName, String email, String mobile, String status) {}
