package com.chaku.ai.model.form;

public record FormFieldOptionResponse(
        Long id,
        String label,
        String value,
        Integer displayOrder
) {}
