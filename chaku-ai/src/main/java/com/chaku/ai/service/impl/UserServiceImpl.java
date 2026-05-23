package com.chaku.ai.service.impl;

import com.chaku.ai.service.UserService;

import com.chaku.ai.entity.UserEntity;
import com.chaku.ai.model.PaginationResponse;
import com.chaku.ai.model.user.CreateUserRequest;
import com.chaku.ai.model.user.SearchUsersRequest;
import com.chaku.ai.model.user.UserResponse;
import com.chaku.ai.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserResponse createUser(CreateUserRequest request) {
        UserEntity user = new UserEntity();
        user.setName(request.name());
        user.setShortName(request.shortName());
        user.setEmail(request.email());
        user.setMobile(request.mobile());
        user.setPassword(request.password());
        UserEntity saved = userRepository.save(user);
        return toResponse(saved);
    }

    @Override
    public UserResponse getUserByMemberId(String memberId) {
        return userRepository.findByMemberId(UUID.fromString(memberId))
                .map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Override
    public List<UserResponse> getUsers(int page, int perPage) {
        int safePage = Math.max(page - 1, 0);
        int safePerPage = perPage == 0 ? 10 : perPage;
        return userRepository.findAll(PageRequest.of(safePage, safePerPage))
                .map(this::toResponse)
                .toList();
    }

    @Override
    public PaginationResponse<UserResponse> searchUsers(SearchUsersRequest request) {
        int page = Math.max(request.pageNumber() - 1, 0);
        int size = request.pageSize() == 0 ? 10 : request.pageSize();
        PageRequest pageable = PageRequest.of(page, size);

        Page<UserEntity> result;
        if (request.excludeUserByGroupId() && request.groupId() != null) {
            result = userRepository.findUsersNotInGroup(request.groupId(), pageable);
        } else {
            result = userRepository.findAll(pageable);
        }
        List<UserResponse> data = result.map(this::toResponse).toList();
        return new PaginationResponse<>(result.getTotalElements(), data);
    }

    private UserResponse toResponse(UserEntity u) {
        return new UserResponse(u.getId(), u.getMemberId(), u.getName(), u.getShortName(), u.getEmail(), u.getMobile(), u.getStatus());
    }
}
