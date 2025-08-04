package com.yach.smartquiz.custom_exception;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TakingExamCustomException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private LocalDateTime startDate;

	private LocalDateTime endDate;

	public TakingExamCustomException() {
		super();
	}

	public TakingExamCustomException(String message, LocalDateTime startDate, LocalDateTime endDate) {
		super(message);
		this.endDate = endDate;
		this.startDate = startDate;
	}

	public TakingExamCustomException(String message, Throwable cause) {
		super(message, cause);
	}

	public TakingExamCustomException(Throwable cause) {
		super(cause);
	}

}
