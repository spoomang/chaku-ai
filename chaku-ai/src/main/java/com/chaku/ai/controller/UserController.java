package com.chaku.ai.controller;

import com.chaku.ai.model.PaginationResponse;
import com.chaku.ai.model.user.CreateUserRequest;
import com.chaku.ai.model.user.SearchUsersRequest;
import com.chaku.ai.model.user.UserResponse;
import com.chaku.ai.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/user")
    public ResponseEntity<UserResponse> createUser(@RequestBody CreateUserRequest request) {
        return ResponseEntity.ok(userService.createUser(request));
    }

    @GetMapping("/user")
    public ResponseEntity<UserResponse> getUser(@RequestParam String memberId) {
        return ResponseEntity.ok(userService.getUserByMemberId(memberId));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int perPage) {
        return ResponseEntity.ok(userService.getUsers(page, perPage));
    }

    @PostMapping("/users/search")
    public ResponseEntity<PaginationResponse<UserResponse>> searchUsers(@RequestBody SearchUsersRequest request) {
        return ResponseEntity.ok(userService.searchUsers(request));
    }
}
