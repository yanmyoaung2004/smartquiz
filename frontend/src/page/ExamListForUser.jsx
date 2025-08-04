"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import axios from "axios";
import { useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExamCard } from "@/components/ExamCard";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, BookOpen, AlertCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const ExamListForUser = () => {
  const [publicExams, setPublicExams] = useState([]);
  const [invitedExams, setInvitedExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      try {
        const [publicRes, invitedRes] = await Promise.all([
          axios.get("/api/exam/get-exam-list", {
            headers: {
              Authorization: `Bearer ${currentUser?.token}`,
            },
          }),
          axios.get("/api/exam/get-invited-exams", {
            headers: {
              Authorization: `Bearer ${currentUser?.token}`,
            },
          }),
        ]);

        setPublicExams(publicRes.data);
        setInvitedExams(invitedRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch exams.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.token) {
      fetchExams();
    }
  }, [currentUser?.token]);

  const renderExamGrid = (examList) => {
    const filtered = examList.filter(
      (e) =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filtered.length === 0) {
      return (
        <Card className="p-8 text-center dark:bg-slate-800">
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">No exams found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters
              </p>
            </div>
          </div>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((e) => (
          <ExamCard
            key={e.id}
            id={e.id}
            title={e.name}
            description={e.description}
            questionCount={e.numberOfQuestions}
            duration={e.duration}
            creator={e.creator}
            examCode={e.examCode}
            icon="Database"
            taken={e.taken}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto p-4 md:p-6">
          <Card className="p-6 space-y-4 dark:bg-slate-800 mt-5">
            <Skeleton className="h-6 w-1/2 dark:bg-slate-600" />
            <Skeleton className="h-6 w-full dark:bg-slate-600" />
            <Skeleton className="h-6 w-full dark:bg-slate-600" />
            <Skeleton className="h-6 w-3/4 dark:bg-slate-600" />
          </Card>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto p-4 md:p-6">
          <Alert variant="destructive" className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Exams</h1>
          </div>
        </div>

        {/* Search */}
        <Card className="p-4 dark:bg-slate-800 max-w-fit">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md min-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search exams, chapters, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="public" className="mt-6 space-y-6">
          <TabsList>
            <TabsTrigger value="public">Public Exams</TabsTrigger>
            <TabsTrigger value="invited">Invited Exams</TabsTrigger>
          </TabsList>

          <TabsContent value="public">
            {renderExamGrid(publicExams)}
          </TabsContent>
          <TabsContent value="invited">
            {renderExamGrid(invitedExams)}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ExamListForUser;
