package com.yach.smartquiz.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "options")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Option {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "option_text", nullable = false)
	private String optionText;

	@ManyToOne
	@JsonIgnore
	@JoinColumn(name = "question_id")
	private Question question;

	@Column(name = "image_url", nullable = true)
	private String imageUrl;

	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	@PrePersist
	protected void onCreate() {
		this.createdAt = LocalDateTime.now();
	}

	@PreUpdate
	protected void onUpdate() {
		this.updatedAt = LocalDateTime.now();
	}

	public Option(String optionText, String imageUrl) {
		super();
		this.optionText = optionText;
		this.imageUrl = imageUrl;
	}
}
