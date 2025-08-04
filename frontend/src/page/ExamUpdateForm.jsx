"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  BookOpen,
  Filter,
  Search,
  CheckCircle,
  ChevronLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import DOMPurify from "dompurify";
import useDebounce from "@/hooks/useDebounce";
import { handleFailureToast } from "@/components/ToastService";
import CustomPagination from "@/components/CustomPagination";

export default function ExamCreationForm() {
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [topics, setTopics] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([1, 2, 3, 4, 5]);
  const [questions, setQuestions] = useState([]);
  const [filters, setFilters] = useState({
    topic: "",
    chapter: "",
    year: "",
    ownOnly: false,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchTerm = useDebounce(searchQuery, 1000);
  const { currentUser } = useSelector((state) => state.user);
  const { exam } = useSelector((state) => state.exam);
  const navigate = useNavigate();
  const listRef = React.useRef(null);
  const [examData, setExamData] = useState({
    id: null,
    title: "",
    description: "",
    allowedTime: "",
    isRandom: true,
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    passingScore: "",
    maxAttempts: "1",
  });

  useEffect(() => {
    const fetchSelectedQuestions = async () => {
      try {
        const res = await axios.get(
          `/api/exam/exam/questions?examId=${exam.id}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        if (res.status === 200) {
          setSelectedQuestions(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (exam) {
      fetchSelectedQuestions();
      const [startDate = "", startTime = ""] = exam.startDate?.split("T") || [];
      const [endDate = "", endTime = ""] = exam.endDate?.split("T") || [];
      setExamData({
        id: exam.id,
        title: exam.title || "",
        description: exam.description || "",
        allowedTime: exam.duration || "",
        isRandom: exam.isRandom ?? true,
        startDate,
        startTime,
        endDate,
        endTime,
        passingScore: exam.passingScore || "",
        maxAttempts: exam.maxAttempts?.toString() || "1",
      });
    }
  }, [currentUser.token, exam]);

  useEffect(() => {
    const fetchQuestions = async (page) => {
      try {
        const res = await axios.get(
          `/api/question/get/exam-creation?page=${page}&size=5&topicId=${
            filters.topic === "all" ? "" : filters.topic
          }&chapterId=${
            filters.chapter === "all" ? "" : filters.chapter
          }&year=${
            filters.year === "all" ? "" : filters.year
          }&keyword=${debouncedSearchTerm}&isMine=${filters.ownOnly}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        if (res.status === 200) {
          setQuestions(res.data.content);
          setPageNumber(res.data.pageNumber);
          setTotalPages(res.data.totalPages);
        }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong";
        handleFailureToast(errorMessage);
      }
    };
    const fetchTopicChatperAndYear = async () => {
      try {
        const res = await axios.get(`/api/question/get-topic-chapter-year`, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        if (res.status === 200) {
          setChapters(res.data.chapters);
          setTopics(res.data.topics);
          setYears(res.data.years);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchQuestions(pageNumber);
    fetchTopicChatperAndYear();
  }, [
    currentUser.token,
    debouncedSearchTerm,
    exam.examCode,
    filters.chapter,
    filters.ownOnly,
    filters.topic,
    filters.year,
    pageNumber,
  ]);

  const createExam = async () => {
    if (
      examData.title == "" ||
      examData.description == "" ||
      examData.allowedTime == "" ||
      examData.maxAttempts == "" ||
      examData.passingScore == "" ||
      examData.startDate == "" ||
      examData.startTime == "" ||
      examData.endDate == "" ||
      examData.endTime == ""
    ) {
      console.log("Please fill all the fills");
      return;
    }
    if (selectedQuestions.length < 1) {
      console.log("You have to select at least one question!");
      return;
    }

    const startDateTime = `${examData.startDate}T${examData.startTime}`;
    const endDateTime = `${examData.endDate}T${examData.endTime}`;
    try {
      const res = await axios.post(
        "api/exam/update",
        {
          examCredentials: {
            id: examData?.id,
            examCode: exam?.examCode,
            title: examData.title,
            description: examData.description,
            passingScore: examData.passingScore,
            maxAttempts: examData.maxAttempts,
            startDateTime: startDateTime,
            endDateTime: endDateTime,
            allowedTime: examData.allowedTime,
            isRandom: examData.isRandom,
          },
          questionList: selectedQuestions,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      if (res.status === 201) {
        navigate(`/exams`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (page) => {
    setPageNumber(page);
    listRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const saveExamAsDraft = async () => {
    if (examData.title == "") {
      console.log("Title is required to save draft.");
      return;
    }

    const startDateTime =
      examData.startDate && examData.startTime
        ? `${examData.startDate}T${examData.startTime}`
        : null;

    const endDateTime =
      examData.endDate && examData.endTime
        ? `${examData.endDate}T${examData.endTime}`
        : null;

    try {
      const res = await axios.post(
        "api/exam/draft",
        {
          examCredentials: {
            title: examData.title,
            description: examData.description || "",
            passingScore: examData.passingScore || null,
            maxAttempts: examData.maxAttempts || null,
            startDateTime,
            endDateTime,
            allowedTime: examData.allowedTime || null,
            isRandom: examData.isRandom || false,
          },
          questionList: selectedQuestions || [],
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      if (res.status === 201) {
        navigate(`/exams/`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleQuestionSelection = (questionId) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const clearFilters = () => {
    setFilters({
      topic: "",
      chapter: "",
      year: "",
      ownOnly: false,
    });
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link to="/exams">
            <Button
              variant="ghost"
              size="icon"
              className="flex items-center gap-2 cursor-pointer w-fit p-2"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Back to Exams</span>
            </Button>
          </Link>
          <h1 className="mt-6 text-4xl font-semibold text-gray-900 dark:text-slate-100">
            {!exam ? "Create New Exam" : "Update Exam"}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-slate-300">
            Set up your exam details, and select questions
          </p>
        </div>

        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Exam Details
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Select Questions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card className={"dark:bg-slate-800"}>
              <CardHeader>
                <CardTitle>Exam Configuration</CardTitle>
                <CardDescription>
                  Configure the basic settings for your exam
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Exam Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Database Management Final Exam"
                      value={examData.title}
                      onChange={(e) =>
                        setExamData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="allowedTime">
                      Allowed Time (minutes) *
                    </Label>
                    <Input
                      id="allowedTime"
                      type="number"
                      placeholder="90"
                      value={examData.allowedTime}
                      onChange={(e) =>
                        setExamData((prev) => ({
                          ...prev,
                          allowedTime: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the exam content and instructions"
                    value={examData.description}
                    onChange={(e) =>
                      setExamData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="passingScore">Passing Score (%)</Label>
                    <Input
                      id="passingScore"
                      type="number"
                      placeholder="70"
                      min="0"
                      max="100"
                      value={examData.passingScore}
                      onChange={(e) =>
                        setExamData((prev) => ({
                          ...prev,
                          passingScore: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxAttempts">Maximum Attempts</Label>
                    <Select
                      value={examData.maxAttempts}
                      onValueChange={(value) =>
                        setExamData((prev) => ({ ...prev, maxAttempts: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Attempt</SelectItem>
                        <SelectItem value="2">2 Attempts</SelectItem>
                        <SelectItem value="3">3 Attempts</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="maxAttempts">
                      Randomize Question & Option Order
                    </Label>
                    <Select
                      value={String(examData.isRandom)}
                      onValueChange={(value) =>
                        setExamData((prev) => ({
                          ...prev,
                          isRandom: value === "true",
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Start Date & Time
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={examData.startDate}
                          onChange={(e) =>
                            setExamData((prev) => ({
                              ...prev,
                              startDate: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startTime">Time</Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={examData.startTime}
                          onChange={(e) =>
                            setExamData((prev) => ({
                              ...prev,
                              startTime: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      End Date & Time
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="endDate">Date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={examData.endDate}
                          onChange={(e) =>
                            setExamData((prev) => ({
                              ...prev,
                              endDate: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startTime">Time</Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={examData.endTime}
                          onChange={(e) =>
                            setExamData((prev) => ({
                              ...prev,
                              endTime: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions">
            <div className="space-y-6">
              <Card className={"dark:bg-slate-800"}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Question Bank
                    </span>
                    <Badge variant="secondary">
                      {selectedQuestions.length} selected
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Filter and select questions from your question bank
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Search and Filters */}
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Search questions..."
                              className="pl-10"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
                        </div>
                        <Button variant="outline" onClick={clearFilters}>
                          <Filter className="h-4 w-4 mr-2" />
                          Clear Filters
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <Select
                          value={filters.chapter}
                          onValueChange={(value) =>
                            setFilters((prev) => ({ ...prev, chapter: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chapter" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Chapters</SelectItem>
                            {chapters.length > 0 &&
                              chapters.map((chapter) => (
                                <SelectItem key={chapter.id} value={chapter.id}>
                                  {chapter.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={filters.topic}
                          onValueChange={(value) =>
                            setFilters((prev) => ({ ...prev, topic: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Topic" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Topics</SelectItem>
                            {topics.length > 0 &&
                              topics.map((topic) => (
                                <SelectItem key={topic.id} value={topic.id}>
                                  {topic.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={filters.year}
                          onValueChange={(value) =>
                            setFilters((prev) => ({ ...prev, year: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Years</SelectItem>
                            {years.length > 0 &&
                              years.map((year) => (
                                <SelectItem key={year} value={year}>
                                  {year}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="ownOnly"
                            className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                            checked={filters.ownOnly}
                            onCheckedChange={(checked) =>
                              setFilters((prev) => ({
                                ...prev,
                                ownOnly: checked,
                              }))
                            }
                          />
                          <Label htmlFor="ownOnly" className="text-sm">
                            My Questions
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Questions List */}
                    <div className="space-y-4">
                      {questions.length > 0 &&
                        questions.map((question) => (
                          <div
                            key={question.id}
                            className={` p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedQuestions.includes(question.id)
                                ? "border-purple-500 bg-purple-50 dark:bg-slate-700"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => toggleQuestionSelection(question.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Checkbox
                                    className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                                    checked={selectedQuestions.includes(
                                      question.id
                                    )}
                                  />
                                  {selectedQuestions.includes(question.id) && (
                                    <CheckCircle className="h-4 w-4 text-purple-600" />
                                  )}
                                </div>
                                <h4 className="font-medium text-gray-900 mb-2 dark:text-slate-200">
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: DOMPurify.sanitize(
                                        question.title
                                      ),
                                    }}
                                  />
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  <Badge
                                    variant="outline"
                                    className="dark:border-slate-600"
                                  >
                                    {question.topic}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className="dark:border-slate-600"
                                  >
                                    {question.chapter}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className="dark:border-slate-600"
                                  >
                                    {question.year}
                                  </Badge>

                                  {question.isOwn && (
                                    <Badge className="bg-purple-100 text-purple-800">
                                      Own
                                    </Badge>
                                  )}
                                  {question.hasImage && (
                                    <Badge
                                      variant="outline"
                                      className="dark:border-slate-600"
                                    >
                                      📷 Image
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      {questions.length > 0 && (
                        <CustomPagination
                          pageNumber={pageNumber}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                        />
                      )}
                    </div>

                    {questions.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No questions found matching your filters.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {selectedQuestions.length > 0 && (
                <Card className={"dark:bg-slate-800"}>
                  <CardHeader>
                    <CardTitle>Selected Questions Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="p-4 bg-blue-50 rounded-lg dark:bg-s-300">
                        <div className="text-2xl font-bold text-blue-600">
                          {selectedQuestions.length}
                        </div>
                        <div className="text-sm text-blue-600">
                          Total Questions
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={saveExamAsDraft}
            className={"cursor-pointer"}
          >
            Save as Draft
          </Button>
          <div className="flex gap-4">
            <Button variant="outline">Preview Exam</Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 cursor-pointer dark:text-slate-100"
              onClick={createExam}
            >
              Update Exam
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
