package com.chaku.ai.model.user;

public record CreateUserRequest(String name, String shortName, String email, String mobile, String password) {}
