package com.yach.smartquiz.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yach.smartquiz.custom_exception.NotFoundException;
import com.yach.smartquiz.entity.Option;
import com.yach.smartquiz.repository.OptionRepository;
import com.yach.smartquiz.service.OptionService;

@Service
public class OptionServiceImpl implements OptionService {

    @Autowired
    private OptionRepository optionRepository;

    @Override
    public Option createOption(Option option) {
        return optionRepository.save(option);
    }

    @Override
    public List<Option> createOptionsByBatch(List<Option> options) {
        return (List<Option>) optionRepository.saveAll(options);
    }

    @Override
    public Option updateOption(Option option) {
        return optionRepository.save(option);
    }

    @Override
    public void deleteOptionById(Long id) {
        Optional<Option> optionOptional = optionRepository.findById(id);
        if (optionOptional.isEmpty()) {
            throw new NotFoundException("Option not found");
        }
        optionRepository.deleteById(id);
    }

    @Override
    public Option getOptionById(Long id) {
    	Optional<Option> optionOptional = optionRepository.findById(id);
		if (optionOptional.isEmpty()) {
			throw new NotFoundException("Option not found with id: " + id);
		}
		return optionOptional.get();
    }

    @Override
    public List<Option> getAllOptions(Option option) {
    	Optional<List<Option>> OptionListOptional = Optional.of((List<Option>) optionRepository.findAll());
		if (OptionListOptional.isEmpty()) {
			throw new NotFoundException("No Questions Found");
		}
		return OptionListOptional.get();
    }
}
