package com.yach.smartquiz.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.yach.smartquiz.entity.Option;
import com.yach.smartquiz.service.OptionService;

@RestController
@RequestMapping("/option")
public class OptionController {

    private final OptionService optionService;

    public OptionController(OptionService optionService) {
        this.optionService = optionService;
    }

    @PostMapping("/create")
    public ResponseEntity<Option> createOption(@RequestBody Option option) {
    	Option createdOption = optionService.createOption(option);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOption);
    }

    @PostMapping("/createByBatch")
    public ResponseEntity<List<Option>> createOptionsByBatch(@RequestBody List<Option> options) {
    	List<Option> createdOptions = optionService.createOptionsByBatch(options);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOptions);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Option> updateOption(@PathVariable Long id, @RequestBody Option option) {
        option.setId(id);
        Option updatedOption = optionService.updateOption(option);
        return ResponseEntity.ok(updatedOption);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Option> getOptionById(@PathVariable Long id) {
    	Option option = optionService.getOptionById(id);
        return ResponseEntity.ok(option);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Option>> getAllOptions() {
    	List<Option> optionList = (optionService.getAllOptions(null));
        return ResponseEntity.ok(optionList);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteOptionById(@PathVariable Long id) {
        optionService.deleteOptionById(id);
        return ResponseEntity.ok("Option deleted successfully");
    }
}
