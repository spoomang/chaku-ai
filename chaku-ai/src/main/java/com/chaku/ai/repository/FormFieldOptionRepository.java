package com.chaku.ai.repository;

import com.chaku.ai.entity.FormFieldOptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FormFieldOptionRepository extends JpaRepository<FormFieldOptionEntity, Long> {

    List<FormFieldOptionEntity> findByFieldIdInOrderByDisplayOrder(List<Long> fieldIds);
}
