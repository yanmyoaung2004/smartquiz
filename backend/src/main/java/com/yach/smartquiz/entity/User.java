package com.yach.smartquiz.entity;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinTable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User implements CustomUserDetails {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String username;

	@Column(unique = true)
	private String email;

	@JsonIgnore
	private String password;

	private String profileImage;

	private boolean enabled = true;

	@ManyToMany(fetch = FetchType.EAGER)
	private Set<Role> roles = new HashSet<>();

	@JsonIgnore
	@OneToMany(mappedBy = "user")
	private List<UserExam> examsTaken = new ArrayList<>();

	@JsonIgnore
	@OneToMany(mappedBy = "user")
	private List<PracticeExam> practiceExamsTaken = new ArrayList<>();

	@JsonIgnore
	@OneToMany(mappedBy = "createdBy")
	private List<Question> questions;

	@JsonIgnore
	@OneToMany(mappedBy = "createdBy")
	private List<Exam> exams;

	@OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
	private UserSettings userSettings;

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "user_exam_types", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "exam_type_id"))
	private Set<QuestionType> examTypes = new HashSet<>();
	
	private boolean isDisabled = false;

	public User() {
	}

	public User(String username, String email, String encodedPassword) {
		this.username = username;
		this.email = email;
		this.password = encodedPassword;
	}

	@Override
	@JsonIgnore
	public Collection<? extends GrantedAuthority> getAuthorities() {
		Set<GrantedAuthority> authorities = new HashSet<>();
		for (Role role : this.roles) {
			authorities.add(new SimpleGrantedAuthority(role.getName()));
			for (Permission perm : role.getPermissions()) {
				authorities.add(new SimpleGrantedAuthority(perm.getName()));
			}
		}
		return authorities;
	}

	@Override
	public String getName() {
		return this.username;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return this.enabled;
	}
}
