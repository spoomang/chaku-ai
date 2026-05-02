package com.chaku.ai.repository;

import com.chaku.ai.entity.GroupEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface GroupRepository extends JpaRepository<GroupEntity, Long> {

    Optional<GroupEntity> findByGroupId(UUID groupId);

    Page<GroupEntity> findByNameContainingIgnoreCase(String name, Pageable pageable);

    @Query("SELECT gm.group FROM GroupMemberEntity gm WHERE gm.memberId = :memberId")
    List<GroupEntity> findGroupsByMemberId(@Param("memberId") UUID memberId);
}
