package com.yach.smartquiz.response;

import java.util.List;

import com.yach.smartquiz.entity.Chapter;
import com.yach.smartquiz.entity.Topic;

public record TopicChapterAndYearListForExamResponse(List<Chapter> chapters, List<Topic> topics, List<String> years) {

}
