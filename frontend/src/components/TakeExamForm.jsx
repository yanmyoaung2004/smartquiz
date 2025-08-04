"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  Flag,
  ImageIcon,
  Bookmark,
  CheckCircle,
  Circle,
} from "lucide-react";
import DOMPurify from "dompurify";
import Timer from "./Timer";

export default function TakeExamForm({
  questions,
  quizTitle,
  onSave,
  allowedTime,
}) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const submitAnswer = () => {
    onSave(selectedAnswers);
  };

  const currentQuestion = questions[currentQuestionIndex];

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const timeup = () => {
    setIsTimeUp(true);
    setTimeout(() => {
      submitAnswer();
    }, 2000);
  };

  const backQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const navigateToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const handleFlagQuestion = () => {
    setFlaggedQuestions((prev) => {
      const newFlagged = new Set(prev);
      if (newFlagged.has(currentQuestion.id)) {
        newFlagged.delete(currentQuestion.id);
      } else {
        newFlagged.add(currentQuestion.id);
      }
      return newFlagged;
    });
  };

  const handleAnswerSelect = (value) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));

    setAnsweredQuestions((prev) => {
      const newAnswered = new Set(prev);
      newAnswered.add(currentQuestion.id);
      return newAnswered;
    });
  };

  const getQuestionStatus = (index) => {
    const question = questions[index];
    if (index === currentQuestionIndex) return "current";
    if (answeredQuestions.has(question.id)) return "answered";
    if (flaggedQuestions.has(question.id)) return "flagged";
    return "unanswered";
  };

  const getQuestionVariant = (status) => {
    switch (status) {
      case "current":
        return "default";
      case "answered":
        return "outline";
      case "flagged":
        return "secondary";
      default:
        return "ghost";
    }
  };

  const totalQuestions = questions.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-800">
      {isTimeUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 text-center max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold text-red-600">Time is up!</h2>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              Auto submitting the exam...
            </p>
          </div>
        </div>
      )}

      <div className="container max-w-6xl p-4 md:p-6 mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" className="mb-4 hover:bg-gray-100">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Exit Quiz
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
                {quizTitle}
              </h1>
              <p className="text-gray-600 mt-1 dark:text-slate-300">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </p>
            </div>
            <Timer allowedTime={allowedTime} onTimeUp={timeup} />
          </div>

          {/* Progress */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Progress</span>
              <span className="text-gray-600 dark:text-slate-300">
                {Math.round((answeredQuestions.size / totalQuestions) * 100)}%
                Complete
              </span>
            </div>
            <Progress
              value={(answeredQuestions.size / totalQuestions) * 100}
              className="h-2 [&>div]:bg-purple-600"
            />

            <div className="flex gap-4 text-xs text-gray-500">
              <span className="dark:text-slate-300">
                Answered: {answeredQuestions.size}
              </span>
              <span className="dark:text-slate-300">
                Flagged: {flaggedQuestions.size}
              </span>
              <span className="dark:text-slate-300">
                Remaining: {totalQuestions - answeredQuestions.size}
              </span>
            </div>
          </div>
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <Card className="mb-6 shadow-lg border-0 dark:bg-slate-700">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl leading-relaxed pr-4">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(currentQuestion.question),
                    }}
                  />
                </CardTitle>
                {flaggedQuestions.has(currentQuestion.id) && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Bookmark className="h-3 w-3" />
                    Flagged
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Question Image */}
              {currentQuestion.hasImage && (
                <div className="relative">
                  <img
                    src={currentQuestion.imageUrl || "/placeholder.svg"}
                    alt={currentQuestion.imageAlt}
                    className="w-full max-w-2xl mx-auto rounded-lg border shadow-sm"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                    <ImageIcon className="h-3 w-3" />
                    Reference Image
                  </div>
                </div>
              )}

              {/* Answer Options */}
              <RadioGroup
                value={selectedAnswers[currentQuestion.id] || ""}
                onValueChange={handleAnswerSelect}
                className="space-y-4"
              >
                {currentQuestion.options.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer dark:hover:bg-slate-500"
                    onClick={() => handleAnswerSelect(option.id)}
                  >
                    <RadioGroupItem
                      value={option.id}
                      id={option.id}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label
                        className="cursor-pointer text-base leading-relaxed"
                        htmlFor={option.id}
                      >
                        <span
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(option.text),
                          }}
                        />
                      </Label>
                      {option.hasImage && (
                        <div className="mt-3">
                          <img
                            src={option.imageUrl || "/placeholder.svg"}
                            alt={option.imageAlt}
                            className="max-w-xs rounded border shadow-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
              <Button
                onClick={backQuestion}
                variant="outline"
                disabled={currentQuestionIndex === 0}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <Button
                variant="outline"
                onClick={handleFlagQuestion}
                className={`w-full sm:w-auto ${
                  flaggedQuestions.has(currentQuestion.id)
                    ? "bg-yellow-50 border-yellow-200"
                    : ""
                }`}
              >
                <Flag
                  className={`mr-2 h-4 w-4 ${
                    flaggedQuestions.has(currentQuestion.id)
                      ? "text-yellow-600"
                      : ""
                  }`}
                />
                {flaggedQuestions.has(currentQuestion.id)
                  ? "Unflag"
                  : "Flag for Review"}
              </Button>

              {currentQuestionIndex === totalQuestions - 1 ? (
                <Button
                  onClick={submitAnswer}
                  className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto cursor-pointer dark:text-slate-100"
                  disabled={currentQuestionIndex === totalQuestions}
                >
                  Finish Quiz
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={nextQuestion}
                  className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto cursor-pointer dark:text-slate-100"
                  disabled={currentQuestionIndex === totalQuestions}
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        )}

        {/* Question Navigation Grid */}
        <Card className="p-4 dark:bg-slate-700">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-2 dark:text-slate-100">
              Question Navigation
            </h3>
            <div className="flex gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-600 rounded"></div>
                <span className="dark:text-slate-100">Current</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span className="dark:text-slate-100">Answered</span>
              </div>
              <div className="flex items-center gap-1">
                <Flag className="w-3 h-3 text-yellow-600" />
                <span className="dark:text-slate-100">Flagged</span>
              </div>
              <div className="flex items-center gap-1">
                <Circle className="w-3 h-3 text-gray-400" />
                <span className="dark:text-slate-100">Unanswered</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-2">
            {Array.from({ length: totalQuestions }, (_, i) => {
              const status = getQuestionStatus(i);
              return (
                <Button
                  key={i}
                  variant={getQuestionVariant(status)}
                  onClick={() => navigateToQuestion(i)}
                  className={`h-10 w-10 p-0 relative ${
                    status === "current" ? "bg-blue-600 hover:bg-blue-700" : ""
                  }`}
                >
                  {i + 1}
                  {status === "answered" && status !== "current" && (
                    <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 text-green-600 bg-white rounded-full" />
                  )}
                  {flaggedQuestions.has(questions[i].id) &&
                    status !== "current" && (
                      <Flag className="absolute -top-1 -right-1 h-3 w-3 text-yellow-600 bg-white rounded-full p-0.5" />
                    )}
                </Button>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
