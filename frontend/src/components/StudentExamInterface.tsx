"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trophy,
  Target,
  TrendingUp,
  BookOpen,
  Timer,
  Flag,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react"

interface ExamQuestion {
  id: string
  question: string
  type: "multiple-choice" | "short-answer"
  options?: string[]
  correctAnswer?: string | number
  userAnswer?: string | number
  topic: string
  difficulty: "Easy" | "Medium" | "Hard"
  points: number
}

interface ExamData {
  id: string
  title: string
  description: string
  duration: number
  totalQuestions: number
  totalPoints: number
  passingScore: number
  questions: ExamQuestion[]
}

const mockExamData: ExamData = {
  id: "exam-1",
  title: "Database Management Final Exam",
  description: "Comprehensive exam covering database design, SQL, normalization, and transactions",
  duration: 90, // minutes
  totalQuestions: 4,
  totalPoints: 100,
  passingScore: 70,
  questions: [
    {
      id: "q1",
      question: "What is the primary purpose of database normalization?",
      type: "multiple-choice",
      options: [
        "To increase query speed",
        "To minimize redundancy and dependency",
        "To secure the database",
        "To compress data",
      ],
      correctAnswer: 1,
      topic: "Database Design",
      difficulty: "Medium",
      points: 25,
    },
    {
      id: "q2",
      question: "Which of the following is NOT a valid SQL JOIN type?",
      type: "multiple-choice",
      options: ["INNER JOIN", "LEFT JOIN", "MIDDLE JOIN", "RIGHT JOIN"],
      correctAnswer: 2,
      topic: "SQL Fundamentals",
      difficulty: "Easy",
      points: 20,
    },
    {
      id: "q3",
      question: "Identify the correct syntax for creating a primary key constraint:",
      type: "multiple-choice",
      options: [
        "PRIMARY KEY (column_name)",
        "KEY PRIMARY (column_name)",
        "CONSTRAINT PRIMARY (column_name)",
        "PRIMARY (column_name)",
      ],
      correctAnswer: 0,
      topic: "Database Design",
      difficulty: "Hard",
      points: 30,
    },
    {
      id: "q4",
      question: "Explain the ACID properties in database transactions and provide an example of each.",
      type: "short-answer",
      topic: "Transactions",
      difficulty: "Hard",
      points: 25,
    },
  ],
}

type ExamState = "instructions" | "taking" | "completed" | "results"

export default function StudentExamInterface() {
  const [examState, setExamState] = useState<ExamState>("instructions")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | number>>({})
  const [timeRemaining, setTimeRemaining] = useState(mockExamData.duration * 60) // in seconds
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set())
  const [showResults, setShowResults] = useState(false)
  const [examResults, setExamResults] = useState<any>(null)

  // Timer effect
  useEffect(() => {
    if (examState === "taking" && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setExamState("completed")
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [examState, timeRemaining])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerChange = (questionId: string, answer: string | number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(questionId)) {
        newSet.delete(questionId)
      } else {
        newSet.add(questionId)
      }
      return newSet
    })
  }

  const calculateResults = () => {
    let totalScore = 0
    let correctAnswers = 0
    const questionResults = mockExamData.questions.map((question) => {
      const userAnswer = answers[question.id]
      const isCorrect =
        question.type === "multiple-choice"
          ? userAnswer === question.correctAnswer
          : userAnswer !== undefined && userAnswer !== ""

      if (isCorrect) {
        totalScore += question.points
        correctAnswers++
      }

      return {
        ...question,
        userAnswer,
        isCorrect,
        pointsEarned: isCorrect ? question.points : 0,
      }
    })

    const percentage = Math.round((totalScore / mockExamData.totalPoints) * 100)
    const passed = percentage >= mockExamData.passingScore
    const timeSpent = mockExamData.duration * 60 - timeRemaining

    return {
      totalScore,
      percentage,
      correctAnswers,
      totalQuestions: mockExamData.questions.length,
      passed,
      timeSpent,
      questionResults,
    }
  }

  const submitExam = () => {
    const results = calculateResults()
    setExamResults(results)
    setExamState("results")
  }

  const currentQuestion = mockExamData.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / mockExamData.questions.length) * 100
  const answeredQuestions = Object.keys(answers).length

  if (examState === "instructions") {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{mockExamData.title}</CardTitle>
              <CardDescription className="text-lg">{mockExamData.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{mockExamData.duration}</div>
                  <div className="text-sm text-blue-600">Minutes</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{mockExamData.totalQuestions}</div>
                  <div className="text-sm text-green-600">Questions</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">{mockExamData.passingScore}%</div>
                  <div className="text-sm text-purple-600">Passing Score</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Exam Instructions</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Read each question carefully before answering
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    You can navigate between questions using the navigation buttons
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Flag questions you want to review later
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Make sure to submit your exam before time runs out
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    Once submitted, you cannot change your answers
                  </li>
                </ul>
              </div>

              <div className="text-center pt-6">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700" onClick={() => setExamState("taking")}>
                  Start Exam
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (examState === "taking") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header with timer and progress */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="mx-auto max-w-6xl px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold">{mockExamData.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>
                    Question {currentQuestionIndex + 1} of {mockExamData.questions.length}
                  </span>
                  <span>•</span>
                  <span>{answeredQuestions} answered</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    timeRemaining < 300 ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                  }`}
                >
                  <Timer className="h-4 w-4" />
                  <span className="font-mono font-semibold">{formatTime(timeRemaining)}</span>
                </div>
                <Button onClick={submitExam} className="bg-purple-600 hover:bg-purple-700">
                  Submit Exam
                </Button>
              </div>
            </div>
            <Progress value={progress} className="mt-3" />
          </div>
        </div>

        <div className="mx-auto max-w-6xl p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Question Navigation Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 lg:grid-cols-1 gap-2">
                    {mockExamData.questions.map((question, index) => (
                      <Button
                        key={question.id}
                        variant={currentQuestionIndex === index ? "default" : "outline"}
                        size="sm"
                        className={`relative ${
                          answers[question.id] !== undefined ? "border-green-500 bg-green-50 text-green-700" : ""
                        }`}
                        onClick={() => setCurrentQuestionIndex(index)}
                      >
                        {index + 1}
                        {flaggedQuestions.has(question.id) && (
                          <Flag className="h-3 w-3 absolute -top-1 -right-1 text-red-500" />
                        )}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-100 border border-green-500 rounded"></div>
                      <span>Answered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
                      <span>Not answered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flag className="h-3 w-3 text-red-500" />
                      <span>Flagged</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Question Area */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{currentQuestion.topic}</Badge>
                        <Badge
                          variant={
                            currentQuestion.difficulty === "Easy"
                              ? "default"
                              : currentQuestion.difficulty === "Medium"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {currentQuestion.difficulty}
                        </Badge>
                        <Badge variant="outline">{currentQuestion.points} points</Badge>
                      </div>
                      <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleFlag(currentQuestion.id)}
                      className={flaggedQuestions.has(currentQuestion.id) ? "text-red-600" : ""}
                    >
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {currentQuestion.type === "multiple-choice" ? (
                    <RadioGroup
                      value={answers[currentQuestion.id]?.toString() || ""}
                      onValueChange={(value) => handleAnswerChange(currentQuestion.id, Number.parseInt(value))}
                    >
                      {currentQuestion.options?.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                            <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="short-answer">Your Answer:</Label>
                      <Textarea
                        id="short-answer"
                        placeholder="Type your answer here..."
                        value={answers[currentQuestion.id]?.toString() || ""}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        className="min-h-[120px]"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-6 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                      disabled={currentQuestionIndex === 0}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>

                    <div className="text-sm text-gray-500">
                      Question {currentQuestionIndex + 1} of {mockExamData.questions.length}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentQuestionIndex(Math.min(mockExamData.questions.length - 1, currentQuestionIndex + 1))
                      }
                      disabled={currentQuestionIndex === mockExamData.questions.length - 1}
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (examState === "results" && examResults) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Results Header */}
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {examResults.passed ? (
                  <Trophy className="h-16 w-16 text-yellow-500" />
                ) : (
                  <Target className="h-16 w-16 text-gray-400" />
                )}
              </div>
              <CardTitle className="text-3xl">{examResults.passed ? "Congratulations!" : "Exam Completed"}</CardTitle>
              <CardDescription className="text-lg">
                {examResults.passed
                  ? "You have successfully passed the exam!"
                  : "You can review your answers and retake if allowed."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{examResults.percentage}%</div>
                  <div className="text-sm text-blue-600">Final Score</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {examResults.correctAnswers}/{examResults.totalQuestions}
                  </div>
                  <div className="text-sm text-green-600">Correct Answers</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">{examResults.totalScore}</div>
                  <div className="text-sm text-purple-600">Points Earned</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-gray-600">{formatTime(examResults.timeSpent)}</div>
                  <div className="text-sm text-gray-600">Time Spent</div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Performance</span>
                  <span className="text-sm text-gray-600">{examResults.percentage}%</span>
                </div>
                <Progress value={examResults.percentage} className="h-3" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span className="text-red-600">Passing: {mockExamData.passingScore}%</span>
                  <span>100%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance by Topic */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance by Topic
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from(new Set(examResults.questionResults.map((q: any) => q.topic))).map((topic: string) => {
                  const topicQuestions = examResults.questionResults.filter((q: any) => q.topic === topic)
                  const correctCount = topicQuestions.filter((q: any) => q.isCorrect).length
                  const percentage = Math.round((correctCount / topicQuestions.length) * 100)

                  return (
                    <div key={topic} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{topic}</span>
                        <span className="text-sm text-gray-600">
                          {correctCount}/{topicQuestions.length} ({percentage}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Question-by-Question Review */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Question Review
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => setShowResults(!showResults)}>
                  {showResults ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                  {showResults ? "Hide" : "Show"} Answers
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {examResults.questionResults.map((question: any, index: number) => (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Question {index + 1}</span>
                        {question.isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <Badge variant="outline">{question.topic}</Badge>
                        <Badge
                          variant={
                            question.difficulty === "Easy"
                              ? "default"
                              : question.difficulty === "Medium"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {question.difficulty}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {question.pointsEarned}/{question.points} points
                      </div>
                    </div>

                    <p className="font-medium mb-3">{question.question}</p>

                    {showResults && (
                      <div className="space-y-2 text-sm">
                        {question.type === "multiple-choice" ? (
                          <div className="space-y-1">
                            {question.options?.map((option: string, optIndex: number) => (
                              <div
                                key={optIndex}
                                className={`p-2 rounded ${
                                  optIndex === question.correctAnswer
                                    ? "bg-green-100 text-green-800"
                                    : optIndex === question.userAnswer
                                      ? "bg-red-100 text-red-800"
                                      : "bg-gray-50"
                                }`}
                              >
                                <span className="font-medium mr-2">{String.fromCharCode(65 + optIndex)}.</span>
                                {option}
                                {optIndex === question.correctAnswer && (
                                  <CheckCircle className="h-4 w-4 inline ml-2 text-green-600" />
                                )}
                                {optIndex === question.userAnswer && optIndex !== question.correctAnswer && (
                                  <XCircle className="h-4 w-4 inline ml-2 text-red-600" />
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div>
                              <span className="font-medium">Your Answer:</span>
                              <div className="mt-1 p-2 bg-gray-50 rounded">
                                {question.userAnswer || "No answer provided"}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => window.print()}>
              Download Results
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">Return to Dashboard</Button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
