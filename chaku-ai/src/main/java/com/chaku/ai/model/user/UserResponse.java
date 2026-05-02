package com.chaku.ai.model.user;

import java.util.UUID;

public record UserResponse(UUID memberId, String name, String shortName, String email, String mobile, String status) {}
