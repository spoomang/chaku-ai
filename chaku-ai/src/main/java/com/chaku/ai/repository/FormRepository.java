package com.chaku.ai.repository;

import com.chaku.ai.entity.FormEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FormRepository extends JpaRepository<FormEntity, Long> {
}
