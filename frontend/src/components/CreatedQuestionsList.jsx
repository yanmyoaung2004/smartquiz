"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  ImageIcon,
  CheckCircle,
  BookOpen,
  MoreVertical,
  Calendar,
  Tag,
  Maximize2,
  Send,
  Lock,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import CustomPagination from "./CustomPagination";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "./ui/skeleton";
import useDebounce from "@/hooks/useDebounce";
import { setQuestionForEdit } from "@/store/question/questionSlice";
import QuestionCardList from "./QuestionCardList";
import { useTranslation } from "react-i18next";
import QuestionImportDialog from "./QuestionImportDialog";
import { handleSuccessToast } from "./ToastService";

export default function ProfessionalQuestionsLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [sortBy, setSortBy] = useState("recent");
  const [questions, setQuestion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [publishedQuestions, setPublishedQuestions] = useState(0);
  const [createdQuestion, setCreatedQuestions] = useState(0);
  const [questionWithImage, setQuestionWithImage] = useState(0);
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const { currentUser } = useSelector((state) => state.user);
  const [importQuestion, setImportQuestion] = useState(false);
  const listRef = React.useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handlePageChange = (page) => {
    setPageNumber(page);
    listRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchQuestion = async (page) => {
      try {
        const res = await axios.get(
          `/api/question/all?page=${page}&size=5&keyword=${debouncedSearchTerm}&status=${
            selectedFilter === "ALL" ? "" : selectedFilter
          }`,
          {
            headers: {
              Authorization: `Bearer ${currentUser?.token}`,
            },
          }
        );
        if (res.status === 200) {
          if (res.data === "") return;
          setQuestion(res.data.content);
          setPageNumber(res.data.pageNumber);
          setTotalPages(res.data.totalPages);
          setTotalQuestions(res.data.credential.totalQuestions);
          setCreatedQuestions(res.data.credential.createdQuestions);
          setPublishedQuestions(res.data.credential.publishedQuestions);
          setQuestionWithImage(res.data.credential.questionWithImage);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion(pageNumber);
  }, [
    currentUser?.token,
    pageNumber,
    debouncedSearchTerm,
    selectedFilter,
    importQuestion,
  ]);

  const editQuestion = (question) => {
    dispatch(setQuestionForEdit(question));
    navigate("/questions/edit");
  };

  const deleteQuestion = async (id) => {
    try {
      const res = await axios.delete(`/api/question/delete?questionId=${id}`, {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
        },
      });
      if (res.status === 201) {
        setQuestion(questions.filter((qt) => qt.id !== id));
        handleSuccessToast("Successfully deleted!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const publishQuestions = async (id) => {
    try {
      const res = await axios.get(`/api/question/publish?questionId=${id}`);
      if (res.status === 200) {
        setQuestion(
          questions.map((q) =>
            q.id === id ? { ...q, status: "PUBLISHED" } : q
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen">
        <div className="container max-w-7xl mx-auto p-6">
          {/* Enhanced Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
                  {t("questions.libraryTitle")}
                </h1>
                <p className="text-gray-600 mt-2 dark:text-slate-300">
                  {t("questions.libraryDescription")}
                </p>
              </div>
              <div className="flex gap-3">
                <QuestionImportDialog
                  importQuestion={importQuestion}
                  setImportQuestion={setImportQuestion}
                />
                <Link to={"/questions/create"}>
                  <Button className="text-white bg-purple-600 hover:bg-purple-700 flex items-center gap-2 cursor-pointer">
                    <Plus className="h-4 w-4" />
                    {t("questions.create")}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {!loading && (
                <QuestionCardList
                  firstCardLabel={t("questions.total")}
                  firstCardValue={totalQuestions}
                  secondCardLabel={t("questions.published")}
                  secondCardValue={publishedQuestions}
                  thirdCardLabel={t("questions.mine")}
                  thirdCardValue={createdQuestion}
                  fourthCardLabel={t("questions.withImages")}
                  fourthCardValue={questionWithImage}
                />
              )}
            </div>
          </div>

          {loading ? (
            <Card className="p-6 space-y-4 dark:bg-slate-800">
              <Skeleton className="h-6 w-1/2 dark:bg-slate-600" />
              <Skeleton className="h-6 w-full dark:bg-slate-600" />
              <Skeleton className="h-6 w-full dark:bg-slate-600" />
              <Skeleton className="h-6 w-3/4 dark:bg-slate-600" />
            </Card>
          ) : (
            <>
              <Card className="mb-6 dark:bg-slate-800">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder={t("questions.searchPlaceholder")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600"
                      />
                    </div>

                    <div className="flex gap-2">
                      {/* Filter Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex items-center gap-2 dark:bg-purple-600 dark:hover:bg-purple-800 cursor-pointer dark:border-none"
                          >
                            <Filter className="h-4 w-4" />
                            {t("questions.filterLabel")}:{" "}
                            {selectedFilter === "ALL"
                              ? t("questions.filters.all")
                              : t(
                                  `questions.filters.${selectedFilter.toLowerCase()}`
                                )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="dark:bg-slate-800 dark:border-slate-600">
                          <DropdownMenuItem
                            onClick={() => setSelectedFilter("ALL")}
                          >
                            {t("questions.filters.all")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setSelectedFilter("PUBLISHED")}
                          >
                            {t("questions.filters.published")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setSelectedFilter("MINE")}
                          >
                            {t("questions.filters.mine")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setSelectedFilter("HAS_IMAGE")}
                          >
                            {t("questions.filters.hasImage")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Sort Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex items-center gap-2 dark:bg-purple-600 dark:hover:bg-purple-800 cursor-pointer dark:border-none"
                          >
                            {t("questions.sortLabel")}:{" "}
                            {t(`questions.sortOptions.${sortBy}`)}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="dark:bg-slate-800 dark:border-slate-600">
                          <DropdownMenuItem onClick={() => setSortBy("recent")}>
                            {t("questions.sortOptions.recent")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSortBy("usage")}>
                            {t("questions.sortOptions.usage")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setSortBy("alphabetical")}
                          >
                            {t("questions.sortOptions.alphabetical")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Questions List */}
              <div className="space-y-4 " ref={listRef}>
                {questions.length > 0 &&
                  questions.map((question) => (
                    <Card
                      key={question.id}
                      className="hover:shadow-md border-l-4 border-l-gray-200 hover:border-l-purple-500 dark:bg-slate-800"
                    >
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          {/* Main Content */}
                          <div className="flex-1 min-w-0">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(
                                          question.questionText
                                        ),
                                      }}
                                    />
                                  </h3>
                                </div>

                                {/* Enhanced Metadata */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                  <Badge
                                    variant="outline"
                                    className="text-xs dark:border-slate-700"
                                  >
                                    <Tag className="mr-1 h-3 w-3" />
                                    {question.chapter}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className="text-xs dark:border-slate-700"
                                  >
                                    {question.topic}
                                  </Badge>

                                  {question.hasImage && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs dark:border-slate-700"
                                    >
                                      <ImageIcon className="mr-1 h-3 w-3" />
                                      Image
                                    </Badge>
                                  )}
                                  {question.status === "PUBLISHED" ? (
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                      Published
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-yellow-50 text-yellow-800 border-yellow-200 flex items-center gap-1"
                                    >
                                      <Lock className="h-4 w-4" />
                                      Private
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              {/* Action Menu */}

                              {question?.creatorEmail ===
                                currentUser?.email && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="flex-shrink-0 cursor-pointer"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      className="cursor-pointer"
                                      onClick={() => editQuestion(question)}
                                    >
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit Question
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                      className="cursor-pointer"
                                      onClick={() =>
                                        publishQuestions(question.id)
                                      }
                                    >
                                      <Send className="mr-2 h-4 w-4" />
                                      {question.status === "PUBLISHED"
                                        ? "Published"
                                        : "Publish now"}
                                    </DropdownMenuItem>
                                    <Separator />
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => {
                                        deleteQuestion(question.id);
                                      }}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>

                            {/* Compact Options Preview */}
                            <div className="rounded-lg p-4 mb-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {question.options
                                  .slice(0, 4)
                                  .map((option, index) => (
                                    <div
                                      key={index}
                                      className={`p-2 rounded-md text-sm flex items-center gap-2 ${
                                        option.isCorrect
                                          ? "bg-green-100 border border-green-300 text-green-800"
                                          : "bg-white border border-gray-200 dark:text-slate-700 dark:bg-white"
                                      }`}
                                    >
                                      {option.isCorrect && (
                                        <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                                      )}
                                      <span className="font-medium flex-shrink-0">
                                        {String.fromCharCode(65 + index)}.
                                      </span>
                                      <span className="line-clamp-1">
                                        <span
                                          dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(
                                              option.text
                                            ),
                                          }}
                                        />
                                      </span>
                                      {option.hasImage && (
                                        <ImageIcon className="h-3 w-3 text-gray-500 flex-shrink-0" />
                                      )}
                                    </div>
                                  ))}
                              </div>
                            </div>

                            {/* Footer with Actions */}
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center gap-4">
                                <span className="flex items-center dark:text-slate-300">
                                  <Calendar className="mr-1 h-3 w-3" />
                                  {new Date(
                                    question.createdAt
                                  ).toLocaleDateString()}
                                </span>
                                <span className="dark:text-slate-300">
                                  Year: {question.year}
                                </span>
                                {question.lastUsed && (
                                  <span className="text-green-600">
                                    Last used:{" "}
                                    {new Date(
                                      question.lastUsed
                                    ).toLocaleDateString()}
                                  </span>
                                )}
                              </div>

                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    className={
                                      "cursor-pointer dark:text-slate-300"
                                    }
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      setSelectedQuestion(question)
                                    }
                                  >
                                    <Eye className="mr-1 h-3 w-3" />
                                    {t("questions.viewDetail")}
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto dark:bg-slate-900">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                      Question Details
                                    </DialogTitle>
                                    <DialogDescription>
                                      {selectedQuestion?.chapter}
                                      {" ( "}
                                      {selectedQuestion?.topic}
                                      {" )"}
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedQuestion && (
                                    <div className="space-y-6">
                                      {/* Question Section */}
                                      <div className="bg-gradient-to-r border-2 bg-purple-50 rounded-lg p-6 dark:bg-slate-800">
                                        <h3 className="text-xl font-medium mb-4">
                                          <span
                                            dangerouslySetInnerHTML={{
                                              __html: DOMPurify.sanitize(
                                                selectedQuestion.questionText
                                              ),
                                            }}
                                          />
                                        </h3>
                                        {selectedQuestion.hasImage && (
                                          <div className="mt-4">
                                            <Dialog>
                                              <DialogTrigger asChild>
                                                <div className="relative cursor-pointer group">
                                                  <img
                                                    src={
                                                      selectedQuestion.imageUrl ||
                                                      "/placeholder.svg"
                                                    }
                                                    alt="Question"
                                                    className="max-h-64 w-auto rounded-md mx-auto border-2 border-white/20"
                                                  />
                                                  <div className="absolute inset-0 bg-black/0  transition-colors rounded-md flex items-center justify-center">
                                                    <Maximize2 className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                  </div>
                                                </div>
                                              </DialogTrigger>
                                              <DialogDescription />
                                              <DialogContent className="max-w-5xl">
                                                <DialogHeader>
                                                  <DialogTitle>
                                                    Question Image
                                                  </DialogTitle>
                                                </DialogHeader>
                                                <div className="flex justify-center">
                                                  <img
                                                    src={
                                                      selectedQuestion.imageUrl ||
                                                      "/placeholder.svg"
                                                    }
                                                    alt="Question"
                                                    className="max-w-full max-h-[70vh] object-contain"
                                                  />
                                                </div>
                                              </DialogContent>
                                            </Dialog>
                                          </div>
                                        )}
                                      </div>

                                      {/* Options Section */}
                                      <div>
                                        <h4 className="font-semibold text-gray-900 mb-3 dark:text-slate-300">
                                          Answer Options
                                        </h4>
                                        <div className="grid grid-cols-1 gap-3">
                                          {selectedQuestion.options.map(
                                            (option, index) => (
                                              <div
                                                key={index}
                                                className={`p-4 rounded-lg border-2 transition-colors dark:bg-slate-800 ${
                                                  option.isCorrect
                                                    ? "bg-green-50 border-green-300"
                                                    : "bg-gray-50 border-gray-200"
                                                }`}
                                              >
                                                <div className="flex items-start gap-3">
                                                  <span className="font-bold text-lg flex-shrink-0">
                                                    {String.fromCharCode(
                                                      65 + index
                                                    )}
                                                    .
                                                  </span>
                                                  <div className="flex-1">
                                                    <span className="text-gray-900 dark:text-slate-300">
                                                      <span
                                                        dangerouslySetInnerHTML={{
                                                          __html:
                                                            DOMPurify.sanitize(
                                                              option.text
                                                            ),
                                                        }}
                                                      />
                                                    </span>
                                                    {option.hasImage && (
                                                      <div className="mt-3">
                                                        <Dialog>
                                                          <DialogTrigger
                                                            asChild
                                                          >
                                                            <div className="relative cursor-pointer group inline-block">
                                                              <img
                                                                src={
                                                                  option.imageUrl ||
                                                                  "/placeholder.svg"
                                                                }
                                                                alt={`Option ${String.fromCharCode(
                                                                  65 + index
                                                                )}`}
                                                                className="max-h-32 w-auto rounded border"
                                                              />
                                                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded flex items-center justify-center">
                                                                <Maximize2 className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                              </div>
                                                            </div>
                                                          </DialogTrigger>
                                                          <DialogContent className="max-w-3xl">
                                                            <DialogHeader>
                                                              <DialogTitle>
                                                                Option{" "}
                                                                {String.fromCharCode(
                                                                  65 + index
                                                                )}{" "}
                                                                Image
                                                              </DialogTitle>
                                                            </DialogHeader>
                                                            <div className="flex justify-center">
                                                              <img
                                                                src={
                                                                  option.imageUrl ||
                                                                  "/placeholder.svg"
                                                                }
                                                                alt={`Option ${String.fromCharCode(
                                                                  65 + index
                                                                )}`}
                                                                className="max-w-full max-h-[70vh] object-contain"
                                                              />
                                                            </div>
                                                          </DialogContent>
                                                        </Dialog>
                                                      </div>
                                                    )}
                                                  </div>
                                                  {option.isCorrect && (
                                                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                                  )}
                                                </div>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>

                                      {/* Explanation Section */}
                                      {selectedQuestion.explanation && (
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 dark:bg-slate-800">
                                          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2 dark:text-slate-300">
                                            <BookOpen className="h-4 w-4" />
                                            Explanation
                                          </h4>
                                          <p className="text-blue-800 leading-relaxed dark:text-slate-300">
                                            {selectedQuestion.explanation}
                                          </p>
                                        </div>
                                      )}

                                      {/* Usage Analytics */}
                                      <div className="bg-gray-50 p-4 rounded-lg dark:bg-slate-800 border-blue-200 border">
                                        <h4 className="font-semibold text-gray-900 mb-3 dark:text-slate-300">
                                          Usage Analytics
                                        </h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                          <div>
                                            <div className="text-2xl font-bold text-blue-600">
                                              {selectedQuestion.year}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-slate-300">
                                              Year
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>

                          {/* Thumbnail Image */}
                          {question.hasImage && (
                            <div className="flex-shrink-0">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-purple-300 transition-colors">
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <div className="relative cursor-pointer group h-full">
                                          <img
                                            src={
                                              question.imageUrl ||
                                              "/placeholder.svg"
                                            }
                                            alt="Question"
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-5xl">
                                        <DialogHeader>
                                          <DialogTitle>
                                            Question Image
                                          </DialogTitle>
                                        </DialogHeader>
                                        <div className="flex justify-center">
                                          <img
                                            src={
                                              question.imageUrl ||
                                              "/placeholder.svg"
                                            }
                                            alt="Question"
                                            className="max-w-full max-h-[70vh] object-contain"
                                          />
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Click to view full image</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                {questions.length > 0 && (
                  <CustomPagination
                    pageNumber={pageNumber}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>

              {/* Empty State */}
              {questions.length === 0 && (
                <Card className={"dark:bg-slate-800"}>
                  <CardContent className="text-center py-12 ">
                    <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4 dark:text-gray-300" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2 dark:text-slate-300">
                      No questions found
                    </h3>
                    <p className="text-gray-600 mb-6 dark:text-slate-300">
                      {searchTerm || selectedFilter !== "ALL"
                        ? "Try adjusting your search or filter criteria."
                        : "Get started by creating your first question."}
                    </p>
                    <Button className="bg-purple-600 hover:bg-purple-700 dark:text-slate-200 cursor-pointer">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Question
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
