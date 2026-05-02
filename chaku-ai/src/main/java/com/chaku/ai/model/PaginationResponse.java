package com.chaku.ai.model;

import java.util.List;

public record PaginationResponse<T>(long totalCount, List<T> data) {}
