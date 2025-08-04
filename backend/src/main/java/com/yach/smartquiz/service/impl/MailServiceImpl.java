package com.yach.smartquiz.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.yach.smartquiz.custom_exception.BadRequestException;
import com.yach.smartquiz.entity.User;
import com.yach.smartquiz.service.MailService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class MailServiceImpl implements MailService {

	private final JavaMailSender javaMailSender;

	@Value("${app.admin.email}")
	private String adminEmail;

	@Value("${app.admin.frontendurl}")
	private String frontendUrl;

	public MailServiceImpl(JavaMailSender javaMailSender) {
		super();
		this.javaMailSender = javaMailSender;
	}

	@Override
	public void sendTeacherApplicationAcceptedEmail(User user) {
		try {
			
			String userName = user.getUsername();
			MimeMessage mimeMessage = javaMailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
			helper.setSubject("Teacher Application Accepted");
			helper.setFrom(adminEmail);
			helper.setTo(user.getEmail());
			helper.setText(buildHtmlContentForTeacherApplicationAccepted(userName), true);
			javaMailSender.send(mimeMessage);
		} catch (MessagingException e) {
			throw new BadRequestException("Mail Sending Failed!");
		}
	}

	@Override
	public void sendForgotPasswordEmail(String token, User user) {
		try {
			String resetLink = String.format("%s/reset-password/%s", frontendUrl, token);
			MimeMessage mimeMessage = javaMailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
			helper.setSubject("Password Reset Request");
			helper.setFrom(adminEmail);
			helper.setTo(user.getEmail());
			helper.setText(buildHtmlContentForForgotPassword(resetLink, user.getUsername()), true);
			javaMailSender.send(mimeMessage);
		} catch (MessagingException e) {
			throw new BadRequestException("Mail Sending Failed!");
		}
	}

	@Override
	public void sendExamInvitationEmail(String email, String examCode, String examName, String deadLine) {
		String invitationLink = String.format("%s/exams/%s/validate", frontendUrl, examCode);

		try {
			sendExamInvitationEmailIndividually(email, examCode, examName, deadLine, invitationLink);
		} catch (Exception e) {
			System.err.println("Failed to send to: " + email);
		}

	}

	private void sendExamInvitationEmailIndividually(String email, String examCode, String examName, String deadLine,
			String invitationLink) {
		try {
			MimeMessage mimeMessage = javaMailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
			helper.setSubject("Exam Invitation Request");
			helper.setFrom(adminEmail);
			helper.setTo(email);
			helper.setText(buildHtmlContentForExamInvitation(invitationLink, email, examName, deadLine), true);
			javaMailSender.send(mimeMessage);
		} catch (Exception e) {
			throw new BadRequestException("Mail Sending Failed!");
		}
	}

	private String buildHtmlContentForForgotPassword(String resetLink, String firstName) {
		String name = (firstName != null && !firstName.isBlank()) ? firstName : "there";

		return String.format(
				"""
						<html>
						<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
						    <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px;">
						        <h2 style="color: #333;">Hi %s,</h2>
						        <p>We received a request to reset your password.</p>
						        <p>Click the button below to set a new password (link expires in <strong>30 minutes</strong>):</p>

						        <div style="text-align: center; margin: 30px 0;">
						            <a href="%s"
						               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">
						                Reset Password
						            </a>
						        </div>

						        <p>If you didn’t request this, you can safely ignore this email.</p>
						        <hr style="margin-top: 40px;">
						        <p style="font-size: 12px; color: #777;">If you need help, contact us at <a href="mailto:ymyo44277@gmail.com">ymyo44277@gmail.com</a>.</p>
						    </div>
						</body>
						</html>
						""",
				name, resetLink);
	}

	private String buildHtmlContentForExamInvitation(String examLink, String firstName, String examName,
			String deadline) {
		String name = (firstName != null && !firstName.isBlank()) ? firstName : "there";

		return String.format(
				"""
						<html>
						<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
						    <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px;">
						        <h2 style="color: #333;">Hello %s,</h2>
						        <p>You have been invited to take the exam <strong>%s</strong>.</p>
						        <p>Please click the button below to begin your exam. Make sure to complete it before <strong>%s</strong>.</p>

						        <div style="text-align: center; margin: 30px 0;">
						            <a href="%s"
						               style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">
						                Start Exam
						            </a>
						        </div>

						        <p>If you were not expecting this email, you can safely ignore it.</p>
						        <hr style="margin-top: 40px;">
						        <p style="font-size: 12px; color: #777;">If you have any questions, feel free to reach out at <a href="mailto:ymyo44277@gmail.com">ymyo44277@gmail.com</a>.</p>
						    </div>
						</body>
						</html>
						""",
				name, examName, deadline, examLink);
	}

	private String buildHtmlContentForTeacherApplicationAccepted(String name) {
		String displayName = (name != null && !name.isBlank()) ? name : "there";

		return String.format(
				"""
						<html>
						<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
						    <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px;">
						        <h2 style="color: #333;">Hi %s,</h2>
						        <p>Congratulations! Your application to become a teacher on our platform has been <strong>accepted</strong>.</p>
						        <p>You can now log in and start creating or managing exams right away.</p>

						        <div style="text-align: center; margin: 30px 0;">
						            <a href="%s"
						               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">
						                Go to Dashboard
						            </a>
						        </div>

						        <p>We’re excited to have you on board and look forward to the amazing learning experiences you’ll create!</p>
						        <hr style="margin-top: 40px;">
						        <p style="font-size: 12px; color: #777;">If you have any questions, feel free to reach out at <a href="mailto:ymyo44277@gmail.com">ymyo44277@gmail.com</a>.</p>
						    </div>
						</body>
						</html>
						""",
				displayName, frontendUrl + "/home");
	}

}
