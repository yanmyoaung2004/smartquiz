"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  Clock,
  BookOpen,
  MoreVertical,
  Calendar,
  Play,
  Archive,
  BarChart3,
  Download,
  CheckCircle,
  Target,
  Award,
  FileText,
  UserPlus,
  Upload,
  Send,
  Share2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ExamCardList from "@/components/ExamCardList";
import {
  seeExamDetailSuccess,
  publishExamStart,
  completeDraftExam,
} from "@/store/exam/ExamSlice";
import { useDispatch, useSelector } from "react-redux";
import CustomPagination from "@/components/CustomPagination";
import { Skeleton } from "@/components/ui/skeleton";
import DraftExamCard from "@/components/DraftExamCard";
import useDebounce from "@/hooks/useDebounce";
import { useTranslation } from "react-i18next";
import { handleSuccessToast } from "@/components/ToastService";

export default function ExamListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("recent");
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalExams, setTotalExams] = useState(0);
  const [activeExams, setActiveExams] = useState(0);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [averagePassRate, setAveragePassRate] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const listRef = React.useRef(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const publishExam = async (exam) => {
    dispatch(publishExamStart(exam));
    navigate(`/exams/${exam.examCode}/invite`);
  };

  const handlePageChange = (page) => {
    setPageNumber(page);
    listRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchData = async (page) => {
      try {
        const res = await axios.get(
          `/api/exam/all?page=${page}&size=5&keyword=${debouncedSearchTerm}&status=${
            selectedFilter === "ALL" ? "" : selectedFilter
          }`,
          {
            headers: {
              Authorization: `Bearer ${currentUser?.token}`,
            },
          }
        );
        if (res.status === 200 && res.data !== "") {
          setExams(res.data.content);
          setPageNumber(res.data.pageNumber);
          setTotalPages(res.data.totalPages);
          setActiveExams(res.data.credential.activeExam);
          setTotalExams(res.data.credential.totalExam);
          setAveragePassRate(res.data.credential.averagePassRate);
          setTotalParticipants(res.data.credential.totalParticipants);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData(pageNumber);
  }, [currentUser?.token, pageNumber, debouncedSearchTerm, selectedFilter]);

  const editExam = (exam) => {
    dispatch(completeDraftExam(exam));
    navigate(`/exams/${exam.examCode}/edit`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 border-green-200";
      case "PUBLISHED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "ARCHIVED":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PUBLIC":
        return <Share2 className="h-4 w-4" />;
      case "ACTIVE":
        return <Play className="h-4 w-4" />;
      case "PUBLISHED":
        return <CheckCircle className="h-4 w-4" />;
      case "COMPLETED":
        return <Award className="h-4 w-4" />;
      case "ARCHIEVED":
        return <Archive className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
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

  const isExamActive = (exam) => {
    const now = new Date();
    const start = new Date(exam.startDate);
    const end = new Date(exam.endDate);
    return now >= start && now <= end && exam.status === "active";
  };

  const seeDetails = (id) => {
    const exam = exams.find((e) => e.id === id);
    dispatch(seeExamDetailSuccess(exam));
    navigate(`/exams/${exam.examCode}/result`);
  };

  const makePublic = async (id) => {
    try {
      const res = await axios.put(
        `api/exam/make-public?examId=${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        }
      );
      if (res.status === 200) {
        handleSuccessToast(res.data);
        setExams(
          exams.map((e) => (e.id === id ? { ...e, isPublic: !e.isPublic } : e))
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
                  {t("exams.managementTitle")}
                </h1>
                <p className="text-gray-600 mt-2 dark:text-slate-300">
                  {t("exams.managementDescription")}
                </p>
              </div>
              <div className="flex gap-3">
                <Link to={"/exams/create"}>
                  <Button
                    variant={"ghost"}
                    className={
                      "bg-purple-600 dark:hover:bg-purple-800 text-white px-5 justify-start cursor-pointer hover:bg-[--sidebar-active-bg] hover:text-[--sidebar-active-fg]"
                    }
                  >
                    <Plus className="h-4 w-4" />
                    {t("exams.create")}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {!loading && (
                <ExamCardList
                  firstCardLabel={t("exams.total")}
                  firstCardValue={totalExams}
                  secondCardLabel={t("exams.active")}
                  secondCardValue={activeExams}
                  thirdCardLabel={t("exams.participants")}
                  thirdCardValue={totalParticipants}
                  fourthCardLabel={t("exams.passRate")}
                  fourthCardValue={averagePassRate}
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
                        placeholder={t("exams.searchPlaceholder")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600"
                      />
                    </div>

                    <div className="flex gap-2">
                      {/* Filter */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex items-center gap-2 dark:bg-purple-600 dark:hover:bg-purple-800 cursor-pointer dark:border-none"
                          >
                            <Filter className="h-4 w-4" />
                            {t("exams.filterLabel")}:{" "}
                            {t(`exams.filters.${selectedFilter.toLowerCase()}`)}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="dark:bg-slate-800 dark:border-slate-600">
                          <DropdownMenuItem
                            onClick={() => setSelectedFilter("ALL")}
                          >
                            {t("exams.filters.all")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setSelectedFilter("ACTIVE")}
                          >
                            {t("exams.filters.active")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setSelectedFilter("DRAFT")}
                          >
                            {t("exams.filters.draft")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setSelectedFilter("PUBLISHED")}
                          >
                            {t("exams.filters.published")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setSelectedFilter("COMPLETED")}
                          >
                            {t("exams.filters.completed")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Sort */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex items-center gap-2 dark:bg-purple-600 dark:hover:bg-purple-800 cursor-pointer dark:border-none"
                          >
                            {t("exams.sortLabel")}:{" "}
                            {t(`exams.sortOptions.${sortBy}`)}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="dark:bg-slate-800 dark:border-slate-600">
                          <DropdownMenuItem onClick={() => setSortBy("recent")}>
                            {t("exams.sortOptions.recent")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSortBy("title")}>
                            {t("exams.sortOptions.title")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setSortBy("participants")}
                          >
                            {t("exams.sortOptions.participants")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setSortBy("performance")}
                          >
                            {t("exams.sortOptions.performance")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Exams List */}
              <div ref={listRef} className="space-y-4">
                {exams.length > 0 &&
                  exams.map((exam) => {
                    return exam.status === "DRAFT" ? (
                      <DraftExamCard exam={exam} key={exam.id} />
                    ) : (
                      <Card
                        key={exam.id}
                        className={`hover:shadow-md border-l-4 dark:bg-slate-800 ${
                          isExamActive(exam)
                            ? "border-l-green-500 bg-green-50/30"
                            : "border-l-gray-200 hover:border-l-purple-500"
                        }`}
                      >
                        <CardContent className="p-6">
                          <div className="flex gap-6">
                            {/* Main Content */}
                            <div className="flex-1 min-w-0">
                              {/* Header */}
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-xl font-semibold text-gray-900 truncate dark:text-slate-100">
                                      {exam.title}
                                    </h3>

                                    {isExamActive(exam) && (
                                      <Badge className="bg-green-100 text-green-800 border-green-200 animate-pulse">
                                        <Play className="h-3 w-3 mr-1" />
                                        Live
                                      </Badge>
                                    )}
                                  </div>

                                  <p className="text-gray-600 mb-3 line-clamp-2 dark:text-slate-300">
                                    {exam.description}
                                  </p>

                                  {/* Enhanced Metadata */}
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge
                                      className={` text-xs border ${getStatusColor(
                                        exam.status
                                      )} flex items-center gap-1`}
                                    >
                                      {getStatusIcon(exam.status)}
                                      {exam.status}
                                    </Badge>

                                    <Badge
                                      className={` text-xs border ${getStatusColor(
                                        "ACTIVE"
                                      )} flex items-center gap-1`}
                                    >
                                      {getStatusIcon("PUBLIC")}
                                      {exam.isPublic ? "Public" : "Private"}
                                    </Badge>

                                    <Badge
                                      variant="outline"
                                      className="text-xs dark:border-slate-700"
                                    >
                                      <BookOpen className="mr-1 h-3 w-3" />
                                      {exam.totalQuestions} questions
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="text-xs dark:border-slate-700"
                                    >
                                      <Clock className="mr-1 h-3 w-3" />
                                      {exam.duration} min
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="text-xs dark:border-slate-700"
                                    >
                                      <Target className="mr-1 h-3 w-3" />
                                      {Math.floor(
                                        (exam.passingScore /
                                          exam.totalQuestions) *
                                          100
                                      )}
                                      % to pass
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="text-xs dark:border-slate-700"
                                    >
                                      <Users className="mr-1 h-3 w-3" />
                                      {exam.examStats.totalParticipants}{" "}
                                      participants
                                    </Badge>
                                  </div>
                                </div>

                                {/* Action Menu */}
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
                                  <DropdownMenuContent
                                    align="end"
                                    className="dark:bg-slate-800 dark:border-slate-600"
                                  >
                                    {exam.status === "PUBLISHED" && (
                                      <>
                                        <DropdownMenuItem
                                          className="cursor-pointer"
                                          onClick={() => {
                                            publishExam(exam);
                                          }}
                                        >
                                          <UserPlus className="mr-2 h-4 w-4" />
                                          Invite Participants
                                        </DropdownMenuItem>
                                        {exam.isPublic ? (
                                          <DropdownMenuItem
                                            className="cursor-pointer"
                                            onClick={() => makePublic(exam.id)}
                                          >
                                            <Send className="mr-2 h-4 w-4" />
                                            Make private
                                          </DropdownMenuItem>
                                        ) : (
                                          <DropdownMenuItem
                                            className="cursor-pointer"
                                            onClick={() => makePublic(exam.id)}
                                          >
                                            <Send className="mr-2 h-4 w-4" />
                                            Make public
                                          </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem className="cursor-pointer">
                                          <Eye className="mr-2 h-4 w-4" />
                                          {t("exams.viewDetail")}
                                        </DropdownMenuItem>
                                      </>
                                    )}
                                    <Link to={`/exams/${exam.examCode}/result`}>
                                      <DropdownMenuItem className="cursor-pointer">
                                        <BarChart3 className="mr-2 h-4 w-4" />
                                        View Results
                                      </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuItem
                                      onClick={() => editExam(exam)}
                                    >
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit Exam
                                    </DropdownMenuItem>
                                    <Separator />
                                    <DropdownMenuItem>
                                      <Download className="mr-2 h-4 w-4" />
                                      Export Results
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>

                              {/* Performance Metrics */}
                              {exam.examStats.totalParticipants > 0 && (
                                <div className="bg-gray-50 rounded-lg p-4 mb-4 dark:bg-slate-800">
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center">
                                      <div className="text-2xl font-bold text-blue-600">
                                        {exam.examStats.averageScore.toFixed(1)}
                                        %
                                      </div>
                                      <div className="text-xs text-gray-600 dark:text-slate-300">
                                        Avg Score
                                      </div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-2xl font-bold text-green-600">
                                        {exam.examStats.passRate.toFixed(1)}%
                                      </div>
                                      <div className="text-xs text-gray-600 dark:text-slate-300">
                                        Pass Rate
                                      </div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-2xl font-bold text-purple-600">
                                        {exam.examStats.totalCompleted}
                                      </div>
                                      <div className="text-xs text-gray-600 dark:text-slate-300">
                                        Completed
                                      </div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-2xl font-bold text-orange-600">
                                        {exam.examStats.averageTime}m
                                      </div>
                                      <div className="text-xs text-gray-600 dark:text-slate-300">
                                        Avg Time
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mt-3">
                                    <div className="flex justify-between text-sm mb-1">
                                      <span>Completion Rate</span>
                                      <span>
                                        {exam.examStats.totalParticipants > 0
                                          ? Math.round(
                                              (exam.examStats
                                                .completedAttempts /
                                                exam.examStats
                                                  .totalParticipants) *
                                                100
                                            )
                                          : 0}
                                        %
                                      </span>
                                    </div>
                                    <Progress
                                      value={
                                        exam.examStats.totalParticipants > 0
                                          ? (exam.examStats.completedAttempts /
                                              exam.examStats
                                                .totalParticipants) *
                                            100
                                          : 0
                                      }
                                      className="h-2 [&>div]:bg-purple-600"
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Schedule and Metadata */}
                              <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center gap-4 flex-wrap">
                                  <span className="flex items-center dark:text-slate-300">
                                    <Calendar className="mr-1 h-3 w-3" />
                                    {formatDate(exam.startDate)} -{" "}
                                    {formatDate(exam.endDate)}
                                  </span>
                                  <span className="dark:text-slate-300">
                                    Subject: {exam.subject}
                                  </span>
                                  <span className="dark:text-slate-300">
                                    Modified: {formatDate(exam.lastModified)}
                                  </span>
                                </div>

                                {exam.status !== "CREATED" ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className={
                                      "cursor-pointer dark:text-slate-300"
                                    }
                                    onClick={() => seeDetails(exam.id)}
                                  >
                                    <Eye className="mr-1 h-3 w-3" />
                                    {t("exams.viewDetail")}
                                  </Button>
                                ) : (
                                  <Button
                                    onClick={() => publishExam(exam)}
                                    variant="ghost"
                                    size="sm"
                                    className={
                                      "cursor-pointer dark:text-slate-300"
                                    }
                                  >
                                    <Upload className="mr-1 h-3 w-3" />
                                    Publish Exam
                                  </Button>
                                )}
                              </div>
                            </div>

                            {/* Status Indicator */}
                            <div className="flex-shrink-0 flex flex-col items-center gap-2">
                              <div
                                className={`w-16 h-16 rounded-full flex items-center justify-center ${getStatusColor(
                                  exam.status
                                )}`}
                              >
                                {getStatusIcon(exam.status)}
                              </div>
                              <span className="text-xs font-medium text-gray-600 text-center dark:text-slate-300">
                                {exam.status}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                {exams.length > 0 && (
                  <CustomPagination
                    pageNumber={pageNumber}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>

              {exams.length === 0 && (
                <Card className={"dark:bg-slate-800"}>
                  <CardContent className="text-center py-12">
                    <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4 dark:text-gray-300" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2 dark:text-slate-300">
                      No exams found
                    </h3>
                    <p className="text-gray-600 mb-6 dark:text-slate-300">
                      {searchTerm || selectedFilter !== "all"
                        ? "Try adjusting your search or filter criteria."
                        : "Get started by creating your first exam."}
                    </p>
                    <Button className="bg-purple-600 hover:bg-purple-700 dark:text-slate-200 cursor-pointer">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Exam
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
