package com.chaku.ai.service;

import com.chaku.ai.model.PaginationResponse;
import com.chaku.ai.model.user.CreateUserRequest;
import com.chaku.ai.model.user.SearchUsersRequest;
import com.chaku.ai.model.user.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse createUser(CreateUserRequest request);
    UserResponse getUserByMemberId(String memberId);
    List<UserResponse> getUsers(int page, int perPage);
    PaginationResponse<UserResponse> searchUsers(SearchUsersRequest request);
}
