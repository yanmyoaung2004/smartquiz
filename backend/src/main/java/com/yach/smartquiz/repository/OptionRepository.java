package com.yach.smartquiz.repository;

import java.util.List;
import org.springframework.data.repository.CrudRepository;
import com.yach.smartquiz.entity.Option;

public interface OptionRepository extends CrudRepository<Option, Long> {
    List<Option> findByQuestionId(Long questionId);
}
