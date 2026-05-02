package com.chaku.ai.repository;

import com.chaku.ai.entity.GroupMemberEntity;
import com.chaku.ai.model.group.GroupMemberResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface GroupMemberRepository extends JpaRepository<GroupMemberEntity, Long> {

    List<GroupMemberEntity> findByGroupId(UUID groupId);

    @Query("SELECT new com.chaku.ai.model.group.GroupMemberResponse(" +
           "gm.user.memberId, gm.user.name, gm.user.shortName, gm.user.email, gm.user.mobile, gm.status, gm.isAdmin) " +
           "FROM GroupMemberEntity gm WHERE gm.groupId = :groupId")
    List<GroupMemberResponse> findMemberDetailsByGroupId(@Param("groupId") UUID groupId);
}
