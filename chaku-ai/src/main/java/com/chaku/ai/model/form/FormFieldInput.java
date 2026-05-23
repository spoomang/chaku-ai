package com.chaku.ai.model.form;

import java.util.List;

public record FormFieldInput(
        String label,
        String fieldKey,
        String fieldType,
        String placeholder,
        Boolean required,
        Integer displayOrder,
        List<FormFieldOptionInput> options
) {}
