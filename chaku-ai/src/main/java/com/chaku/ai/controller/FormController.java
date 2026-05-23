package com.chaku.ai.controller;

import com.chaku.ai.model.ApiResponse;
import com.chaku.ai.model.form.CreateFormRequest;
import com.chaku.ai.model.form.FormDetailResponse;
import com.chaku.ai.model.form.FormSummaryResponse;
import com.chaku.ai.service.FormService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class FormController {

    private final FormService formService;

    public FormController(FormService formService) {
        this.formService = formService;
    }

    @PostMapping("/forms")
    public ResponseEntity<ApiResponse<Map<String, Long>>> createForm(@RequestBody CreateFormRequest request) {
        Long formId = formService.createForm(request);
        return ResponseEntity.ok(new ApiResponse<>(Map.of("formId", formId)));
    }

    @GetMapping("/forms")
    public ResponseEntity<ApiResponse<List<FormSummaryResponse>>> listForms() {
        return ResponseEntity.ok(new ApiResponse<>(formService.listForms()));
    }

    @GetMapping("/forms/{id}")
    public ResponseEntity<ApiResponse<FormDetailResponse>> getForm(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(formService.getFormById(id)));
    }
}
