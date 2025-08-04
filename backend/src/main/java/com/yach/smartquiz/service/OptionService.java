package com.yach.smartquiz.service;

import java.util.List;
import com.yach.smartquiz.entity.Option;

public interface OptionService {

    Option createOption(Option option);

    List<Option> createOptionsByBatch(List<Option> options);

    Option updateOption(Option option);

    void deleteOptionById(Long id);

    Option getOptionById(Long id);

    List<Option> getAllOptions(Option option);
}
