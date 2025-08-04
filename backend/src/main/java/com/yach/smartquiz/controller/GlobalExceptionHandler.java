package com.yach.smartquiz.controller;

import java.sql.SQLException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.yach.smartquiz.custom_exception.AlreadyExistedException;
import com.yach.smartquiz.custom_exception.BadRequestException;
import com.yach.smartquiz.custom_exception.ForbiddenAccessException;
import com.yach.smartquiz.custom_exception.NotFoundException;
import com.yach.smartquiz.custom_exception.TakingExamCustomException;
import com.yach.smartquiz.response.CustomResponse;
import com.yach.smartquiz.response.ExamCustomErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<CustomResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
		CustomResponse error = new CustomResponse(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value());
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
	}

	@ExceptionHandler(ForbiddenAccessException.class)
	public ResponseEntity<CustomResponse> handleIllegalArgumentException(ForbiddenAccessException ex) {
		CustomResponse error = new CustomResponse(ex.getMessage(), HttpStatus.FORBIDDEN.value());
		return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
	}

	@ExceptionHandler(NotFoundException.class)
	public ResponseEntity<CustomResponse> handleNotFoundException(NotFoundException ex) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND)
				.body(new CustomResponse(ex.getMessage(), HttpStatus.NOT_FOUND.value()));
	}

	@ExceptionHandler(BadRequestException.class)
	public ResponseEntity<CustomResponse> handleBadRequest(Exception ex) {
		CustomResponse error = new CustomResponse(ex.getMessage(), HttpStatus.BAD_REQUEST.value());
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
	}

	@ExceptionHandler(SQLException.class)
	public ResponseEntity<CustomResponse> handleDatabaseException(Exception ex) {
		CustomResponse error = new CustomResponse(ex.getMessage(), HttpStatus.UNAVAILABLE_FOR_LEGAL_REASONS.value());
		return ResponseEntity.status(HttpStatus.UNAVAILABLE_FOR_LEGAL_REASONS).body(error);
	}

	@ExceptionHandler(DisabledException.class)
	public ResponseEntity<CustomResponse> handleUserDisableException(Exception ex) {
		CustomResponse error = new CustomResponse(ex.getMessage(), HttpStatus.UNAVAILABLE_FOR_LEGAL_REASONS.value());
		return ResponseEntity.status(HttpStatus.UNAVAILABLE_FOR_LEGAL_REASONS).body(error);
	}

	@ExceptionHandler(AlreadyExistedException.class)
	public ResponseEntity<CustomResponse> handleAreadyExistedException(Exception ex) {
		CustomResponse error = new CustomResponse(ex.getMessage(), HttpStatus.CONFLICT.value());
		return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
	}

	@ExceptionHandler(BadCredentialsException.class)
	public ResponseEntity<CustomResponse> handleWrongPasswordException(Exception ex) {
		CustomResponse error = new CustomResponse("Incorrect Password!", HttpStatus.UNAUTHORIZED.value());
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
	}

	@ExceptionHandler(TakingExamCustomException.class)
	public ResponseEntity<ExamCustomErrorResponse> handleTakingExamCustomException(TakingExamCustomException ex) {
		ExamCustomErrorResponse examCustomErrorResponse = new ExamCustomErrorResponse(ex.getMessage(),
				HttpStatus.CONFLICT.toString(), ex.getStartDate().toString(), ex.getEndDate().toString());
		return ResponseEntity.status(HttpStatus.CONFLICT).body(examCustomErrorResponse);
	}

}
