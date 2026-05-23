package com.chaku.ai.model.form;

import java.util.List;

public record CreateFormRequest(
        Long userId,
        String title,
        String description,
        List<FormFieldInput> fields
) {}
