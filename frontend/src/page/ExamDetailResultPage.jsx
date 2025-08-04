"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Search,
  Download,
  Share2,
  Edit,
  Users,
  Clock,
  BookOpen,
  BarChart3,
  Target,
  Award,
  Timer,
  CheckCircle,
  Eye,
  Filter,
  Calendar,
  PieChart,
  Activity,
  Brain,
  Star,
  ArrowLeft,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useSelector } from "react-redux";
import axios from "axios";
import DOMPurify from "dompurify";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExamDetailsResults() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("score");
  const [timeAnalysis, setTimeAnalysis] = useState(null);
  const [scoreDistribution, setScoreDistribution] = useState([]);
  const [studentResultLists, setStudentResultLists] = useState([]);
  const [questionAnalytics, setQuestionAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const { examDetail } = useSelector((state) => state.exam);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `/api/exam/exam-detail?examCode=${examDetail.examCode}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser?.token}`,
            },
          }
        );

        if (res.status === 200 && res.data !== "") {
          setTimeAnalysis(res.data.timeAnalysis);
          setScoreDistribution(res.data.scoreDistribution);
          setStudentResultLists(res.data.studentResultLists);
          setQuestionAnalytics(res.data.questionAnalytics);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [examDetail.examCode, currentUser?.token]);

  const filteredStudents =
    studentResultLists.length > 0
      ? studentResultLists.filter((student) => {
          const matchesSearch =
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesFilter =
            filterStatus === "all" ||
            (filterStatus === "passed" &&
              student.percentage >= examDetail.passingScore) ||
            (filterStatus === " " &&
              student.percentage < examDetail.passingScore) ||
            (filterStatus === "completed" && student.status === "completed");

          return matchesSearch && matchesFilter;
        })
      : [];

  // Calculate statistics

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-blue-600";
    if (percentage >= examDetail.passingScore) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceBadge = (percentage) => {
    if (percentage >= 90)
      return {
        label: "Excellent",
        color: "bg-green-100 text-green-800 border-green-200",
      };
    if (percentage >= 80)
      return {
        label: "Good",
        color: "bg-blue-100 text-blue-800 border-blue-200",
      };
    if (
      percentage >=
      (examDetail.passingScore * 100) / examDetail.totalQuestions
    )
      return {
        label: "Pass",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      };
    return { label: "Fail", color: "bg-red-100 text-red-800 border-red-200" };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Layout>
      <main className="flex-1 overflow-y-auto  ">
        <TooltipProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
            <div className="container max-w-7xl mx-auto p-6">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <Link to={"/exams"}>
                    <Button
                      variant="outline"
                      size="sm"
                      className={"cursor-pointer"}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Exams
                    </Button>
                  </Link>
                  <div className="h-6 w-px bg-gray-300" />
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                      <Calendar className="h-3 w-3 mr-1" />
                      {examDetail.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-300">
                      {examDetail.title}
                    </h1>
                    <p className="text-gray-600 mt-2 dark:text-slate-300">
                      {examDetail.description}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 flex-wrap">
                      <span className="flex items-center dark:text-slate-300">
                        <BookOpen className="mr-1 h-4 w-4" />
                        Number of questions : {examDetail.totalQuestions}{" "}
                      </span>
                      <span className="flex items-center dark:text-slate-300">
                        <Clock className="mr-1 h-4 w-4 " />
                        Duration : {examDetail.duration} minutes
                      </span>
                      <span className="flex items-center dark:text-slate-300">
                        <Target className="mr-1 h-4 w-4" />
                        Passing Score :{" "}
                        {(
                          (examDetail.passingScore * 100) /
                          examDetail.totalQuestions
                        ).toFixed(2)}
                        %
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export Results
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      Share Report
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Exam
                    </Button>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger
                    value="overview"
                    className="flex items-center gap-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="students"
                    className="flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Student Results
                  </TabsTrigger>
                  <TabsTrigger
                    value="questions"
                    className="flex items-center gap-2"
                  >
                    <Brain className="h-4 w-4" />
                    Question Analysis
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <div className="space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      <Card className="border-l-4 border-l-blue-500 dark:bg-white">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Total Students
                              </p>
                              <p className="text-2xl font-bold text-gray-900">
                                {examDetail.examStats.totalParticipants}
                              </p>
                            </div>
                            <Users className="h-8 w-8 text-blue-600" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-green-500 dark:bg-white">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Completed
                              </p>
                              <p className="text-2xl font-bold text-gray-900">
                                {examDetail.examStats.totalCompleted}
                              </p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-600" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-yellow-500 dark:bg-white">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Average Score
                              </p>
                              <p className="text-2xl font-bold text-gray-900">
                                {examDetail.examStats.averageScore}%
                              </p>
                            </div>
                            <Target className="h-8 w-8 text-yellow-600" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-purple-500 dark:bg-white">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Pass Rate
                              </p>
                              <p className="text-2xl font-bold text-gray-900">
                                {examDetail.examStats.passRate}%
                              </p>
                            </div>
                            <Award className="h-8 w-8 text-purple-600" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-orange-500 dark:bg-white">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Avg Time
                              </p>
                              <p className="text-2xl font-bold text-gray-900">
                                {examDetail.examStats.averageTime}m
                              </p>
                            </div>
                            <Timer className="h-8 w-8 text-orange-600" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Performance Distribution */}
                    {loading && (
                      <Card className="p-6 space-y-4 dark:bg-slate-800">
                        <Skeleton className="h-6 w-1/2 dark:bg-slate-600" />
                        <Skeleton className="h-6 w-full dark:bg-slate-600" />
                        <Skeleton className="h-6 w-full dark:bg-slate-600" />
                        <Skeleton className="h-6 w-3/4 dark:bg-slate-600" />
                      </Card>
                    )}
                    {!loading && (
                      <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <Card className={"dark:bg-slate-800"}>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <PieChart className="h-5 w-5" />
                                Score Distribution
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {scoreDistribution.map(
                                  ({ range, numberOfStudents }) => (
                                    <div key={range} className="space-y-4">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">
                                          {range}
                                        </span>
                                        <span className="text-sm text-gray-600 dark:text-slate-300">
                                          {numberOfStudents === 0 ||
                                          numberOfStudents === 1
                                            ? numberOfStudents + " student"
                                            : numberOfStudents + " students"}
                                        </span>
                                      </div>
                                      <Progress
                                        className="h-2 [&>div]:bg-purple-600"
                                        value={
                                          (numberOfStudents /
                                            examDetail.examStats
                                              .totalParticipants) *
                                          100
                                        }
                                      />
                                    </div>
                                  )
                                )}
                              </div>
                            </CardContent>
                          </Card>
                          <Card className={"dark:bg-slate-800"}>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Time Analysis
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-center">
                                  <div className="p-4 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">
                                      {examDetail.examStats.averageTime}m
                                    </div>
                                    <div className="text-sm text-blue-600">
                                      Average Time
                                    </div>
                                  </div>
                                  <div className="p-4 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">
                                      {timeAnalysis &&
                                      studentResultLists.length > 0
                                        ? timeAnalysis.fastestTime
                                        : 0}
                                      m
                                    </div>
                                    <div className="text-sm text-green-600">
                                      Fastest
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  {timeAnalysis &&
                                    timeAnalysis.timeBuckets.map(
                                      ({ label, count }) => (
                                        <div
                                          className="flex items-center justify-between"
                                          key={label}
                                        >
                                          <span className="text-sm font-medium">
                                            {label}
                                          </span>
                                          <span className="text-sm text-gray-600 dark:text-slate-300">
                                            {count === 0 || count === 1
                                              ? count + " student"
                                              : count + " students"}
                                          </span>
                                        </div>
                                      )
                                    )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        {/* Top Performers */}
                        {studentResultLists.length > 0 && (
                          <Card className={"dark:bg-slate-800"}>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Star className="h-5 w-5" />
                                Top Performers
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {studentResultLists
                                  .sort((a, b) => {
                                    if (b.percentage === a.percentage) {
                                      return a.timeSpent - b.timeSpent;
                                    }
                                    return b.percentage - a.percentage;
                                  })
                                  .slice(0, 3)
                                  .map((student, index) => (
                                    <div
                                      key={student.id}
                                      className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div
                                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                                            index === 0
                                              ? "bg-yellow-500"
                                              : index === 1
                                              ? "bg-gray-400"
                                              : "bg-orange-600"
                                          }`}
                                        >
                                          {index + 1}
                                        </div>
                                        <div>
                                          <div className="font-semibold dark:text-gray-900">
                                            {student.name}
                                          </div>
                                          <div className="text-sm text-gray-600">
                                            {student.percentage}% •{" "}
                                            {student.timeSpent}m
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="students">
                  <div className="space-y-6">
                    {/* Search and Filters */}
                    <Card className={"dark:bg-slate-800"}>
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                              placeholder="Search by student name or email..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10"
                            />
                          </div>

                          <div className="flex gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="flex items-center gap-2"
                                >
                                  <Filter className="h-4 w-4" />
                                  Filter: {filterStatus}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() => setFilterStatus("all")}
                                >
                                  All Students
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setFilterStatus("passed")}
                                >
                                  Passed
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setFilterStatus("failed")}
                                >
                                  Failed
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setFilterStatus("completed")}
                                >
                                  Completed
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="flex items-center gap-2"
                                >
                                  Sort: {sortBy}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() => setSortBy("score")}
                                >
                                  By Score
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setSortBy("name")}
                                >
                                  By Name
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setSortBy("time")}
                                >
                                  By Time
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setSortBy("submitted")}
                                >
                                  By Submission
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Student Results List */}
                    <div className="space-y-4">
                      {filteredStudents.length > 0 &&
                        filteredStudents.map((student) => {
                          const performanceBadge = getPerformanceBadge(
                            student.percentage
                          );
                          return (
                            <Card
                              key={student.id}
                              className="hover:shadow-md transition-shadow dark:bg-slate-800"
                            >
                              <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                      <span className="font-semibold text-purple-700">
                                        {student.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </span>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-gray-900 dark:text-slate-100">
                                        {student.name}
                                      </h3>
                                      <p className="text-sm text-gray-600 dark:text-slate-300">
                                        {student.email}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-6">
                                    <div className="text-center">
                                      <div
                                        className={`text-2xl font-bold ${getScoreColor(
                                          student.percentage
                                        )}`}
                                      >
                                        {student.percentage}%
                                      </div>
                                      <div className="text-sm text-gray-600 dark:text-slate-300">
                                        {student.correctAnswers}/
                                        {student.totalQuestions}
                                      </div>
                                    </div>

                                    <div className="text-center">
                                      <div className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                                        {student.timeSpent}m
                                      </div>
                                      <div className="text-sm text-gray-600 dark:text-slate-300">
                                        Time Spent
                                      </div>
                                    </div>

                                    <div className="text-center">
                                      <Badge
                                        className={`border ${performanceBadge.color}`}
                                      >
                                        {performanceBadge.label}
                                      </Badge>
                                      <div className="text-sm text-gray-600 mt-1 dark:text-slate-300">
                                        Attempt {student.attempt}
                                      </div>
                                    </div>

                                    <div className="text-center">
                                      <div className="text-sm text-gray-600 dark:text-slate-300">
                                        Submitted
                                      </div>
                                      <div className="text-sm font-medium">
                                        {formatDate(student.submittedAt)}
                                      </div>
                                    </div>
                                    <Button
                                      className={"cursor-pointer"}
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        navigate(
                                          `/exams/${examDetail.examCode}/review?u=${student.email}`
                                        );
                                      }}
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="questions">
                  <div className="space-y-6">
                    <Card className={"dark:bg-slate-900"}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="h-5 w-5" />
                          Question Performance Analysis
                        </CardTitle>
                        <CardDescription>
                          Analyze how students performed on each question
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {questionAnalytics.length > 0 &&
                            questionAnalytics.map((question, index) => (
                              <Card
                                key={question.questionId}
                                className="border-l-4 hover:border-l-purple-500 dark:bg-slate-800"
                              >
                                <CardContent className="p-6">
                                  <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="font-semibold">
                                          Question {index + 1}
                                        </span>
                                        <Badge
                                          variant="outline"
                                          className="text-xs bg-green-100 text-green-800"
                                        >
                                          {question.topic}
                                        </Badge>
                                      </div>
                                      <h4 className="font-medium text-gray-900 mb-3 dark:text-slate-100">
                                        <span
                                          dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(
                                              question.question
                                            ),
                                          }}
                                        />
                                      </h4>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                                      <div className="text-2xl font-bold text-blue-600">
                                        {question.successRate}%
                                      </div>
                                      <div className="text-sm text-blue-600">
                                        Success Rate
                                      </div>
                                    </div>
                                    <div className="text-center p-3 bg-green-50 rounded-lg">
                                      <div className="text-2xl font-bold text-green-600">
                                        {question.correctAttempts}
                                      </div>
                                      <div className="text-sm text-green-600">
                                        Correct
                                      </div>
                                    </div>
                                    <div className="text-center p-3 bg-red-50 rounded-lg">
                                      <div className="text-2xl font-bold text-red-600">
                                        {question.totalAttempts -
                                          question.correctAttempts}
                                      </div>
                                      <div className="text-sm text-red-600">
                                        Incorrect
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mb-3">
                                    <div className="flex justify-between text-sm mb-1">
                                      <span>Success Rate</span>
                                      <span>{question.successRate}%</span>
                                    </div>
                                    <Progress
                                      value={question.successRate}
                                      className="h-2 [&>div]:bg-purple-600"
                                    />
                                  </div>

                                  {question.commonWrongAnswers.length > 0 && (
                                    <div className="bg-red-50 p-4 rounded-lg">
                                      <h5 className="font-medium text-red-900 mb-2">
                                        Common Wrong Answers:
                                      </h5>
                                      <div className="space-y-1">
                                        {question.commonWrongAnswers.map(
                                          (answer, idx) => (
                                            <div
                                              key={idx}
                                              className="flex justify-between text-sm"
                                            >
                                              <span className="text-red-800">
                                                <span
                                                  dangerouslySetInnerHTML={{
                                                    __html: DOMPurify.sanitize(
                                                      answer.answer
                                                    ),
                                                  }}
                                                />
                                              </span>
                                              <span className="text-red-600">
                                                {answer.count === 0 ||
                                                answer.count === 1
                                                  ? answer.count + " student"
                                                  : answer.count + " students"}
                                              </span>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </TooltipProvider>
      </main>
    </Layout>
  );
}
