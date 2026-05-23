package com.chaku.ai.repository;

import com.chaku.ai.entity.FormFieldEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FormFieldRepository extends JpaRepository<FormFieldEntity, Long> {

    List<FormFieldEntity> findByFormIdOrderByDisplayOrder(Long formId);
}
