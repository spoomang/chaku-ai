package com.chaku.ai.service;

import com.chaku.ai.model.form.CreateFormRequest;
import com.chaku.ai.model.form.FormDetailResponse;
import com.chaku.ai.model.form.FormSummaryResponse;

import java.util.List;

public interface FormService {

    Long createForm(CreateFormRequest request);

    List<FormSummaryResponse> listForms();

    FormDetailResponse getFormById(Long formId);
}
