package com.yach.smartquiz.response;

import java.util.List;
import java.util.Map;

public record PaginatedResponse<T>(
    List<T> content,
    Map<String, Object> credential,
    int pageNumber,
    int pageSize,
    long totalElements,
    int totalPages,
    boolean last
) {
    public PaginatedResponse(List<T> content, int pageNumber, int pageSize, long totalElements) {
        this(
            content,
            null,
            pageNumber,
            pageSize,
            totalElements,
            (int) Math.ceil((double) totalElements / pageSize),
            pageNumber >= (int) Math.ceil((double) totalElements / pageSize) - 1
        );
    }

    public PaginatedResponse(List<T> content, Map<String, Object> credential, int pageNumber, int pageSize, long totalElements) {
        this(
            content,
            credential,
            pageNumber,
            pageSize,
            totalElements,
            (int) Math.ceil((double) totalElements / pageSize),
            pageNumber >= (int) Math.ceil((double) totalElements / pageSize) - 1
        );
    }
}
