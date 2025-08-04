package com.yach.smartquiz.entity;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

import com.aventrix.jnanoid.jnanoid.NanoIdUtils;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.JoinColumn;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PracticeExam {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String name;

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "practice_exam_topic", joinColumns = @JoinColumn(name = "practice_exam_id"), inverseJoinColumns = @JoinColumn(name = "topic_id"))
	private List<Topic> topics;

	@ManyToOne(fetch = FetchType.EAGER, optional = true)
	@JoinColumn(name = "user_id", nullable = true)
	private User user;

	@ElementCollection(fetch = FetchType.EAGER)
	@CollectionTable(name = "practice_exam_years", joinColumns = @JoinColumn(name = "practice_exam_id"))
	@Column(name = "year")
	private List<String> years;

	@Column(nullable = false)
	private Integer numberOfQuestions;

	@Column(nullable = false)
	private Boolean isRandom;

	@Column(name = "allowed_time", nullable = false)
	private Integer duration;

	@Column(name = "start_date")
	private LocalDateTime startDate;

	@Column(name = "short_code", unique = true, nullable = false, length = 12)
	private String shortCode;

	private Instant createdAt;

	private Instant updatedAt;

	@PrePersist
	protected void onCreate() {
		this.name = "Practice Exam";
		Instant now = Instant.now();
		this.createdAt = now;
		this.updatedAt = now;
		if (this.shortCode == null || this.shortCode.isEmpty()) {
			this.shortCode = NanoIdUtils.randomNanoId(NanoIdUtils.DEFAULT_NUMBER_GENERATOR,
					NanoIdUtils.DEFAULT_ALPHABET, 12);
		}
	}

	@PreUpdate
	protected void onUpdate() {
		this.updatedAt = Instant.now();
	}
}
