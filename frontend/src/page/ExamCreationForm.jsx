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
import {
  handleFailureToast,
  handleWarningToast,
} from "@/components/ToastService";
import CustomPagination from "@/components/CustomPagination";
import useDebounce from "@/hooks/useDebounce";
import { useTranslation } from "react-i18next";

export default function ExamCreationForm() {
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [years, setYears] = useState([]);
  const [filters, setFilters] = useState({
    topic: "",
    chapter: "",
    year: "",
    ownOnly: false,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchTerm = useDebounce(searchQuery, 1000);
  const { currentUser } = useSelector((state) => state.user);
  const [examData, setExamData] = useState({
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
  const navigate = useNavigate();
  const { t } = useTranslation();
  const listRef = React.useRef(null);

  const handlePageChange = (page) => {
    setPageNumber(page);
    listRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
        console.log(res);
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
      handleWarningToast("Please fill all the fields!");
      return;
    }
    if (selectedQuestions.length < 1) {
      handleWarningToast("You have to select at least one question!");
      return;
    }

    const startDateTime = `${examData.startDate}T${examData.startTime}`;
    const endDateTime = `${examData.endDate}T${examData.endTime}`;
    try {
      const res = await axios.post(
        "api/exam/create",
        {
          examCredentials: {
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
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      handleFailureToast(errorMessage);
    }
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
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      handleFailureToast(errorMessage);
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
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
            {t("exams.createExam.title")}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-slate-300">
            {t("exams.createExam.subtitle")}
          </p>
        </div>

        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {t("exams.createExam.examDetails")}
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {t("exams.createExam.selectQuestions")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card className={"dark:bg-slate-800"}>
              <CardHeader>
                <CardTitle>{t("exams.createExam.examConfiguration")}</CardTitle>
                <CardDescription>
                  {t("exams.createExam.examConfigurationSubtitle")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      {t("exams.createExam.examTitle")}
                    </Label>
                    <Input
                      id="title"
                      placeholder={t("exams.createExam.examTitleExample")}
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
                      {t("exams.createExam.allowedTime")}
                    </Label>
                    <Input
                      id="allowedTime"
                      type="number"
                      placeholder={t("exams.createExam.allowedTimeExample")}
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
                  <Label htmlFor="description">
                    {t("exams.createExam.description")}
                  </Label>
                  <Textarea
                    id="description"
                    placeholder={t("exams.createExam.descriptionPlaceholder")}
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
                    <Label htmlFor="passingScore">
                      {t("exams.createExam.passingScore")}
                    </Label>
                    <Input
                      id="passingScore"
                      type="number"
                      placeholder={t("exams.createExam.passingScoreExample")}
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
                    <Label htmlFor="maxAttempts">
                      {t("exams.createExam.maxAttempts")}
                    </Label>
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
                        <SelectItem value="1">
                          1 {t("exams.createExam.maxAttemptsExample")}
                        </SelectItem>
                        <SelectItem value="2">
                          2 {t("exams.createExam.maxAttemptsExample")}
                        </SelectItem>
                        <SelectItem value="3">
                          3 {t("exams.createExam.maxAttemptsExample")}
                        </SelectItem>
                        <SelectItem value="unlimited">
                          {t("exams.createExam.maxAttemptsUnlimited")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="maxAttempts">
                      {t("exams.createExam.randomize")}
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
                        <SelectItem value="true">
                          {t("exams.createExam.randomizeYes")}
                        </SelectItem>
                        <SelectItem value="false">
                          {t("exams.createExam.randomizeNo")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {t("exams.createExam.startDateTime")}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">
                          {t("exams.createExam.date")}
                        </Label>
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
                        <Label htmlFor="startTime">
                          {t("exams.createExam.time")}
                        </Label>
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
                      {t("exams.createExam.endDateTime")}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="endDate">
                          {t("exams.createExam.date")}
                        </Label>
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
                        <Label htmlFor="startTime">
                          {t("exams.createExam.time")}
                        </Label>
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
              className="bg-purple-600 hover:bg-purple-700 cursor-pointer dark:text-slate-300"
              onClick={createExam}
            >
              Create Exam
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
