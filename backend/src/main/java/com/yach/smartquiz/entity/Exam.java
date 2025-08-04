package com.yach.smartquiz.entity;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.aventrix.jnanoid.jnanoid.NanoIdUtils;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Exam {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String name;

	@Column(length = 1000)
	private String description;

	@Column(name = "allowed_time")
	private Integer duration;

	@Column(name = "start_date")
	private LocalDateTime startDate;
	
	@Column(name = "end_date")
	private LocalDateTime endDate;

	@Column(name = "maximum_attempt")
	private Integer maximumAttempt;

	@Column(name = "passing_score")
	private Integer passingScore;
	
	private Boolean isRandom;
	
	@Column(name = "short_code", unique = true, nullable = false, length = 10)
	private String shortCode;

	@Enumerated(EnumType.STRING)
	private ExamStatus status;
	
	private boolean isPublic = false;
	
	@JsonIgnore
	@OneToMany(mappedBy = "exam")
    private List<UserExam> takenByUsers = new ArrayList<>();
	
	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(
	    name = "exam_questions",
	    joinColumns = @JoinColumn(name = "exam_id"),
	    inverseJoinColumns = @JoinColumn(name = "question_id")
	)
	private List<Question> questions;
	
	@ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

	private Instant createdAt;

	private Instant updatedAt;

	@PrePersist
	protected void onCreate() {
		Instant now = Instant.now();
		this.createdAt = now;
		this.updatedAt = now;
		if (this.shortCode == null || this.shortCode.isEmpty()) {
			this.shortCode = NanoIdUtils.randomNanoId(NanoIdUtils.DEFAULT_NUMBER_GENERATOR, NanoIdUtils.DEFAULT_ALPHABET, 8);
		}
	}

	@PreUpdate
	protected void onUpdate() {
		this.updatedAt = Instant.now();
	}

}
