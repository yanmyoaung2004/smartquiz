"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import DOMPurify from "dompurify";

export default function ExamResultDetail({ result }) {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const nextQuestion = () => {
    if (currentQuestionIndex < result.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const backQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const getOptionStyle = (optionId) => {
    const question = result.questions[currentQuestionIndex];
    if (optionId === question.correctAnswer) {
      return "border-green-500 bg-green-50 dark:bg-green-400";
    }
    if (optionId === question.userAnswer && !question.isCorrect) {
      return "border-red-500 bg-red-50 dark:bg-red-400";
    }
    return "border-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700";
  };

  const currentQuestion = result && result.questions[currentQuestionIndex];

  const getQuestionStatus = (index) => {
    if (index === currentQuestionIndex) return "current";
    return "default";
  };

  const getQuestionVariant = (status) => {
    switch (status) {
      case "current":
        return "default";
      default:
        return "outline";
    }
  };

  const navigateToQuestion = (index) => {
    if (index >= 0 && index < result.questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {result && (
        <div className="container max-w-6xl p-4 md:p-6 mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              className="mb-4 hover:bg-gray-100"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Results
            </Button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
                  {result.examTitle}
                </h1>
                <p className="text-gray-600 mt-1 dark:text-slate-300">
                  Question {currentQuestionIndex + 1} of {result.totalQuestions}
                </p>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border shadow-sm dark:bg-slate-800">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium dark:text-slate-100">
                  Time Taken: {result.timeTaken}
                </span>
              </div>
            </div>
          </div>

          {/* Question Card */}
          {currentQuestion && (
            <Card className="mb-6 shadow-lg border-0 dark:bg-slate-800">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl leading-relaxed pr-4">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(currentQuestion.question),
                      }}
                    />
                  </CardTitle>
                  <Badge
                    variant={
                      currentQuestion.isCorrect ? "success" : "destructive"
                    }
                    className={`flex items-center gap-1 ${
                      currentQuestion.isCorrect
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {currentQuestion.isCorrect ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    {currentQuestion.isCorrect ? "Correct" : "Incorrect"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Answer Options */}
                <RadioGroup
                  value={currentQuestion.userAnswer}
                  className="space-y-4"
                >
                  {currentQuestion.options.map((option) => (
                    <div
                      key={option.id}
                      className={`flex items-start space-x-3 p-4 border rounded-lg transition-colors ${getOptionStyle(
                        option.id
                      )}`}
                    >
                      <RadioGroupItem
                        value={option.id}
                        id={option.id}
                        className="mt-1"
                        disabled
                      />
                      <div className="flex-1">
                        <Label
                          className="cursor-default text-base leading-relaxed"
                          htmlFor={option.id}
                        >
                          <span
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(option.text),
                            }}
                          />
                        </Label>
                      </div>
                    </div>
                  ))}
                </RadioGroup>

                {/* Explanation */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">
                    Explanation:
                  </h3>
                  <p className="text-blue-700">{currentQuestion.explanation}</p>
                </div>
              </CardContent>

              <div className="flex justify-between gap-4 p-6 pt-0">
                <Button
                  onClick={backQuestion}
                  variant="outline"
                  disabled={currentQuestionIndex === 0}
                  className="w-full sm:w-auto"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                {currentQuestionIndex !== result.questions.length - 1 ? (
                  <Button
                    onClick={nextQuestion}
                    className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto dark:text-white"
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Link to={"/practice"}>
                    <Button
                      onClick={nextQuestion}
                      className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto dark:text-white"
                    >
                      Retake Exam
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          )}

          {/* Question Navigation Grid */}
          <Card className="p-4 dark:bg-slate-800">
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2 dark:text-slate-100">
                Question Navigation
              </h3>
              <div className="flex gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-600 rounded"></div>
                  <span className="dark:text-slate-300">Current</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 border border-gray-300 rounded"></div>
                  <span className="dark:text-slate-300">Other Questions</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-2">
              {Array.from({ length: result.totalQuestions }, (_, i) => {
                const status = getQuestionStatus(i);
                return (
                  <Button
                    key={i}
                    variant={getQuestionVariant(status)}
                    onClick={() => navigateToQuestion(i)}
                    className={`h-10 w-10 p-0 ${
                      status === "current"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : ""
                    }`}
                  >
                    {i + 1}
                  </Button>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
