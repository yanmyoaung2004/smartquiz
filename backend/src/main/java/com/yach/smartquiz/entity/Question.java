package com.yach.smartquiz.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "questions")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "text")
    private String questionText;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "topic_id")
    private Topic topic;

    private String year;

    @Column(columnDefinition = "text", nullable = true)
    private String explanation;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Option> options;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "correct_option_id", nullable = true)
    private Option correctOption;

    @Column(name = "image_url", nullable = true)
    private String imageUrl;
    
    @JsonIgnore
    @ManyToMany(mappedBy = "questions")
    private List<Exam> exams;
    
    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;


	@Enumerated(EnumType.STRING)
	private QuestionStatus status;

    private LocalDateTime created_at;
    private LocalDateTime updated_at;

    @PrePersist
    private void onCreate() {
    	this.status = QuestionStatus.CREATED;
        this.created_at = LocalDateTime.now();
    }

    @PreUpdate
    private void onUpdate() {
        this.updated_at = LocalDateTime.now();
    }
}
