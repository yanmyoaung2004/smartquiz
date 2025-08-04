package com.yach.smartquiz.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "question_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuestionType {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String name;

	private String description;
	
	@JsonIgnore
	@ManyToMany(mappedBy = "examTypes")
	private List<User> users;


	@JsonIgnore
	@OneToMany(mappedBy = "type", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	private List<Chapter> chapter;

}
