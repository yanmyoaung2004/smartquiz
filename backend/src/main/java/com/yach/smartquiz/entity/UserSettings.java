package com.yach.smartquiz.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "user_settings")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserSettings {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne
	@MapsId
	@JoinColumn(name = "id")
	@JsonIgnore
	private User user;

	@Column(name = "email_notifications_enabled", nullable = false)
	private boolean emailNotificationsEnabled = true;

	@Column(name = "reminder_notifications_enabled", nullable = false)
	private boolean reminderNotificationsEnabled = true;

	@Column(name = "dark_mode_enabled", nullable = false)
	private boolean darkModeEnabled = false;

	@ManyToOne
	@JoinColumn(name = "selected_subject_id")
	private QuestionType selectedSubject;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt = LocalDateTime.now();

	public UserSettings(User user) {
		super();
		this.user = user;
	}

}
