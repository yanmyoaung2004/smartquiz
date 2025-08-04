package com.yach.smartquiz.entity;

import java.time.Instant;	

import com.aventrix.jnanoid.jnanoid.NanoIdUtils;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ExamInvitation {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String email;

	@ManyToOne
	@JoinColumn(name = "exam_id", nullable = false)
	private Exam exam;

	@Column(name = "invitation_token", unique = true, nullable = false, length = 32)
	private String invitationToken;

	private boolean accepted = false;

	private Instant sentAt;

	private Instant respondedAt;

	@PrePersist
	protected void onCreate() {
		this.sentAt = Instant.now();
		if (this.invitationToken == null || this.invitationToken.isEmpty()) {
			this.invitationToken = NanoIdUtils.randomNanoId();
		}
	}

}
