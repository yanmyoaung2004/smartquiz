"use client";
import {
  Clock,
  FileText,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Zap,
  Eye,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomPagination from "@/components/CustomPagination";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data
const studentData = {
  name: "Alex Johnson",
  grade: "Grade 10",
  overallScore: 85,
  totalExams: 24,
  studyStreak: 12,
  totalStudyHours: 156,
};

export function Dashboard() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [overAllScore, setOverAllScore] = useState(0);
  const [performanceData, setPerformanceData] = useState([]);
  const [examHistory, setExamHistory] = useState([]);
  const [practiceHistory, setPracticeHistory] = useState([]);
  const [improvement, setImprovement] = useState("");
  const [strengthAnalysis, setStrengthAnalysis] = useState({
    strong: [],
    weak: [],
  });

  const [pageExam, setPageExam] = useState(0);
  const [page, setPage] = useState(0);
  const pageSize = 5;

  const paginatedExamHistory = examHistory.slice(
    pageExam * pageSize,
    (pageExam + 1) * pageSize
  );
  const totalPagesExamHistory = Math.ceil(examHistory.length / pageSize);

  const paginatedPracticeHistory = practiceHistory.slice(
    page * pageSize,
    (page + 1) * pageSize
  );
  const totalPagesPracticeHistory = Math.ceil(
    practiceHistory.length / pageSize
  );

  function calculateOverallScore(data) {
    let totalWeightedScore = 0;
    let totalQuestions = 0;

    data.forEach((topic) => {
      totalWeightedScore += topic.performanceScore * topic.totalQuestions;
      totalQuestions += topic.totalQuestions;
    });

    if (totalQuestions === 0) return 0;

    const overallScore = totalWeightedScore / totalQuestions;
    return parseFloat(overallScore.toFixed(1));
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/user/get-dashboard-data`, {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        });
        if (res.status === 200) {
          setImprovement(res.data.improvement);
          setOverAllScore(calculateOverallScore(res.data.performance));
          setExamHistory(res.data.examHistory);
          setPracticeHistory(res.data.practiceHistory);
          setPerformanceData(res.data.performance);

          const strong = [];
          const weak = [];
          res.data.performance.forEach((item) => {
            const simplified = {
              topicName: item.topicName,
              performanceScore: item.performanceScore,
            };

            if (item.performanceScore > 90) {
              strong.push(simplified);
            } else {
              weak.push(simplified);
            }
          });

          setStrengthAnalysis({ strong, weak });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser?.token]);

  const review = (examCode) => {
    navigate(`/exams/${examCode}/review?u=${currentUser.email}`);
  };

  const reviewPractice = (examCode) => {
    navigate(`/practice/${examCode}/result`);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Dashboard</h1>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className={"dark:bg-slate-800"}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Overall Score
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overAllScore}%</div>
                <p className="text-xs text-muted-foreground">
                  {improvement} from last month
                </p>
              </CardContent>
            </Card>
            <Card className={"dark:bg-slate-800"}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Exams Taken
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{examHistory.length}</div>
                <p className="text-xs text-muted-foreground">This semester</p>
              </CardContent>
            </Card>
            <Card className={"dark:bg-slate-800"}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Study Streak
                </CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {studentData.studyStreak}
                </div>
                <p className="text-xs text-muted-foreground">Days in a row</p>
              </CardContent>
            </Card>
            <Card className={"dark:bg-slate-800"}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Study Hours
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {studentData.totalStudyHours}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total this semester
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="performance" className="space-y-4">
            <TabsList>
              <TabsTrigger value="performance">
                Performance Analysis
              </TabsTrigger>
              <TabsTrigger value="history">Exam History</TabsTrigger>
              <TabsTrigger value="practice">Practice History</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className={"dark:bg-slate-800"}>
                  <CardHeader>
                    <CardTitle>Topic Performance</CardTitle>
                    <CardDescription>
                      Your performance across different topics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {performanceData.length > 0 &&
                      performanceData.map((chapter) => (
                        <div key={chapter.topicId} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {chapter.topicName}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {chapter.performanceScore}%
                            </span>
                          </div>
                          <Progress
                            value={chapter.performanceScore}
                            className="h-2 [&>div]:bg-purple-600"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>
                              {chapter.correctCount}/{chapter.totalQuestions}{" "}
                              questions mastered
                            </span>
                            <span>
                              {chapter.totalQuestions - chapter.correctCount}{" "}
                              weak questions
                            </span>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>

                <Card className={"dark:bg-slate-800"}>
                  <CardHeader>
                    <CardTitle>Strength Analysis</CardTitle>
                    <CardDescription>
                      Areas where you excel and need improvement
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {strengthAnalysis?.strong?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Strong Areas
                          </h4>
                          <div className="space-y-2">
                            {strengthAnalysis?.strong.map((s, i) => (
                              <div
                                className="flex items-center justify-between mb-3"
                                key={i}
                              >
                                <span className="text-sm">{s.topicName}</span>
                                <Badge
                                  variant="secondary"
                                  className="bg-green-100 text-green-800"
                                >
                                  {s.performanceScore}%
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {strengthAnalysis?.weak?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                            Needs Improvement
                          </h4>
                          <div className="space-y-2">
                            {strengthAnalysis?.weak.map((w, i) => (
                              <div
                                className="flex items-center justify-between mb-3"
                                key={i}
                              >
                                <span className="text-sm">{w.topicName}</span>
                                <Badge
                                  variant="secondary"
                                  className="bg-orange-100 text-orange-800"
                                >
                                  {w.performanceScore}%
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card className={"dark:bg-slate-800"}>
                <CardHeader>
                  <CardTitle>Exam History</CardTitle>
                  <CardDescription>
                    Complete history of your exams and assessments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedExamHistory.map((exam) => (
                        <TableRow key={exam.examId}>
                          <TableCell className="font-medium">
                            {exam.title}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                exam.score >= 90
                                  ? "default"
                                  : exam.score >= 80
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {exam.score}%
                            </Badge>
                          </TableCell>
                          <TableCell>{exam.date}</TableCell>
                          <TableCell>{exam.duration} min</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                exam.status === "Excellent"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {exam.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 cursor-pointer"
                              onClick={() => review(exam.examCode)}
                            >
                              <Eye className="w-4 h-4" />
                              Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex justify-end items-center gap-2">
                    <CustomPagination
                      pageNumber={pageExam}
                      totalPages={totalPagesExamHistory}
                      onPageChange={setPageExam}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="practice" className="space-y-4">
              <Card className={"dark:bg-slate-800"}>
                <CardHeader>
                  <CardTitle>Practice History</CardTitle>
                  <CardDescription>
                    Complete history of your practices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Topics</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedPracticeHistory.map((exam) => (
                        <TableRow key={exam.practiceId}>
                          <TableCell className="font-medium">
                            {exam.topicList}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                exam.score >= 90
                                  ? "default"
                                  : exam.score >= 80
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {exam.score}%
                            </Badge>
                          </TableCell>
                          <TableCell>{exam.date}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                exam.status === "Excellent"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {exam.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 cursor-pointer"
                              onClick={() => reviewPractice(exam.examCode)}
                            >
                              <Eye className="w-4 h-4" />
                              Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex justify-end items-center gap-2">
                    <CustomPagination
                      pageNumber={page}
                      totalPages={totalPagesPracticeHistory}
                      onPageChange={setPage}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
