package com.yach.smartquiz.request;

import java.util.List;

public record InviteParticipantsToExamRequest(List<String> emails, String examCode) {

}
