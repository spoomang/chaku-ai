package com.chaku.ai.service.impl;

import com.chaku.ai.entity.FormEntity;
import com.chaku.ai.entity.FormFieldEntity;
import com.chaku.ai.entity.FormFieldOptionEntity;
import com.chaku.ai.model.form.*;
import com.chaku.ai.repository.FormFieldOptionRepository;
import com.chaku.ai.repository.FormFieldRepository;
import com.chaku.ai.repository.FormRepository;
import com.chaku.ai.service.FormService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FormServiceImpl implements FormService {

    private final FormRepository formRepository;
    private final FormFieldRepository formFieldRepository;
    private final FormFieldOptionRepository formFieldOptionRepository;

    public FormServiceImpl(FormRepository formRepository,
                           FormFieldRepository formFieldRepository,
                           FormFieldOptionRepository formFieldOptionRepository) {
        this.formRepository = formRepository;
        this.formFieldRepository = formFieldRepository;
        this.formFieldOptionRepository = formFieldOptionRepository;
    }

    @Override
    @Transactional
    public Long createForm(CreateFormRequest request) {
        FormEntity form = new FormEntity();
        form.setUserId(request.userId());
        form.setTitle(request.title());
        form.setDescription(request.description());
        Long formId = formRepository.save(form).getId();

        List<FormFieldInput> fields = request.fields() != null ? request.fields() : Collections.emptyList();
        for (FormFieldInput fieldInput : fields) {
            FormFieldEntity field = new FormFieldEntity();
            field.setFormId(formId);
            field.setLabel(fieldInput.label());
            field.setFieldKey(fieldInput.fieldKey());
            field.setFieldType(fieldInput.fieldType());
            field.setPlaceholder(fieldInput.placeholder());
            field.setIsRequired(Boolean.TRUE.equals(fieldInput.required()));
            field.setDisplayOrder(fieldInput.displayOrder() != null ? fieldInput.displayOrder() : 0);
            Long fieldId = formFieldRepository.save(field).getId();

            List<FormFieldOptionInput> options = fieldInput.options() != null ? fieldInput.options() : Collections.emptyList();
            for (FormFieldOptionInput optionInput : options) {
                FormFieldOptionEntity option = new FormFieldOptionEntity();
                option.setFieldId(fieldId);
                option.setLabel(optionInput.label());
                option.setValue(optionInput.value());
                option.setDisplayOrder(optionInput.displayOrder() != null ? optionInput.displayOrder() : 0);
                formFieldOptionRepository.save(option);
            }
        }

        return formId;
    }

    @Override
    public List<FormSummaryResponse> listForms() {
        return formRepository.findAll().stream()
                .map(f -> new FormSummaryResponse(f.getId(), f.getTitle(), f.getDescription()))
                .toList();
    }

    @Override
    public FormDetailResponse getFormById(Long formId) {
        FormEntity form = formRepository.findById(formId)
                .orElseThrow(() -> new IllegalArgumentException("Form not found: " + formId));

        List<FormFieldEntity> fields = formFieldRepository.findByFormIdOrderByDisplayOrder(formId);

        Map<Long, List<FormFieldOptionResponse>> optionsByFieldId = Collections.emptyMap();
        if (!fields.isEmpty()) {
            List<Long> fieldIds = fields.stream().map(FormFieldEntity::getId).toList();
            optionsByFieldId = formFieldOptionRepository
                    .findByFieldIdInOrderByDisplayOrder(fieldIds)
                    .stream()
                    .map(o -> Map.entry(o.getFieldId(),
                            new FormFieldOptionResponse(o.getId(), o.getLabel(), o.getValue(), o.getDisplayOrder())))
                    .collect(Collectors.groupingBy(
                            Map.Entry::getKey,
                            Collectors.mapping(Map.Entry::getValue, Collectors.toList())));
        }

        Map<Long, List<FormFieldOptionResponse>> finalOptionsByFieldId = optionsByFieldId;
        List<FormFieldResponse> fieldResponses = fields.stream()
                .map(f -> new FormFieldResponse(
                        f.getId(),
                        f.getLabel(),
                        f.getFieldKey(),
                        f.getFieldType(),
                        f.getPlaceholder(),
                        f.getIsRequired(),
                        f.getDisplayOrder(),
                        finalOptionsByFieldId.getOrDefault(f.getId(), Collections.emptyList())))
                .toList();

        return new FormDetailResponse(form.getId(), form.getTitle(), form.getDescription(), fieldResponses);
    }
}
