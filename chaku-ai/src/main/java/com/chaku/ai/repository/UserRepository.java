package com.chaku.ai.repository;

import com.chaku.ai.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByMemberId(UUID memberId);

    Optional<UserEntity> findByEmailAndPassword(String email, String password);

    Optional<UserEntity> findByMobileAndPassword(String mobile, String password);

    @Query("SELECT u FROM UserEntity u WHERE u.memberId NOT IN " +
           "(SELECT gm.memberId FROM GroupMemberEntity gm WHERE gm.groupId = :groupId)")
    Page<UserEntity> findUsersNotInGroup(@Param("groupId") UUID groupId, Pageable pageable);
}
