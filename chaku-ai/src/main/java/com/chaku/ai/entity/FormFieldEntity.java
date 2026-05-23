package com.chaku.ai.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "form_fields")
@Getter
@Setter
@NoArgsConstructor
public class FormFieldEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "form_id", nullable = false)
    private Long formId;

    @Column(nullable = false)
    private String label;

    @Column(name = "field_key", nullable = false)
    private String fieldKey;

    @Column(name = "field_type", nullable = false)
    private String fieldType;

    @Column
    private String placeholder;

    @Column(name = "is_required", nullable = false)
    private Boolean isRequired = false;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    void prePersist() {
        createdAt = LocalDateTime.now();
    }
}
