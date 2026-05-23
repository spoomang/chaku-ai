package com.chaku.ai.model.form;

import java.util.List;

public record FormDetailResponse(
        Long id,
        String title,
        String description,
        List<FormFieldResponse> fields
) {}
