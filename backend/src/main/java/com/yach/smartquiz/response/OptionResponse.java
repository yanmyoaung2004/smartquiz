package com.yach.smartquiz.response;

public record OptionResponse(Long id, String text, Boolean hasImage, String imageUrl, String imageAlt, Boolean isCorrect) {

}
