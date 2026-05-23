package com.chaku.ai.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "form_field_options")
@Getter
@Setter
@NoArgsConstructor
public class FormFieldOptionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "field_id", nullable = false)
    private Long fieldId;

    @Column(nullable = false)
    private String label;

    @Column(name = "option_value", nullable = false)
    private String value;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;
}
