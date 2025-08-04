"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, RefreshCw, Download, Settings } from "lucide-react";
import { QuestionCard } from "@/components/QuestionCard";
import { generateQuestions } from "@/service/aiService";
import Layout from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);
  const [error, setError] = useState(null);

  const handleGenerateQuestions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await generateQuestions(questionCount);
      if (response.success) {
        setQuestions(response.questions);
      } else {
        setError(response.message || "Failed to generate questions");
      }
    } catch (err) {
      setError("An error occurred while generating questions");
      console.error("Error generating questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportQuestions = () => {
    const dataStr = JSON.stringify(questions, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `ai-generated-questions-${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center mb-8 justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
              <Settings className="h-8 w-8 text-blue-600" />
              Admin Question Generator
            </h1>
            <p className="text-muted-foreground">
              Generate AI-powered questions for exams and assessments
            </p>
          </div>
        </div>

        {/* Controls */}
        <Card className="mb-8 dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Question Generation Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 max-w-xs">
                <Label htmlFor="questionCount" className="text-sm font-medium">
                  Number of Questions
                </Label>
                <Input
                  id="questionCount"
                  type="number"
                  min="1"
                  max="20"
                  value={questionCount}
                  onChange={(e) =>
                    setQuestionCount(Number.parseInt(e.target.value) || 5)
                  }
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleGenerateQuestions}
                  disabled={loading}
                  className="cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 dark:text-slate-100"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Questions
                    </>
                  )}
                </Button>
                {questions.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleGenerateQuestions}
                      disabled={loading}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate
                    </Button>
                    <Button variant="outline" onClick={handleExportQuestions}>
                      <Download className="mr-2 h-4 w-4" />
                      Export JSON
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50 dark:bg-slate-800">
            <CardContent className="pt-6">
              <p className="text-red-800 text-center">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Questions Display */}
        {questions.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                Generated Questions
                <Badge variant="secondary" className="ml-2">
                  {questions.length} questions
                </Badge>
              </h2>
            </div>

            <div className="grid gap-6">
              {questions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
        {loading && questions.length === 0 && (
          <Card className="p-6 space-y-4 dark:bg-slate-800">
            <div className="space-y-2">
              <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200">
                Generating questions with AI
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This can take a few minutes...
              </p>
            </div>

            <Skeleton className="h-6 w-1/2 dark:bg-slate-600" />
            <Skeleton className="h-6 w-full dark:bg-slate-600" />
            <Skeleton className="h-6 w-full dark:bg-slate-600" />
            <Skeleton className="h-6 w-3/4 dark:bg-slate-600" />
          </Card>
        )}

        {/* Empty State */}
        {questions.length === 0 && !loading && (
          <Card className="text-center py-12 dark:bg-slate-800">
            <CardContent>
              <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 dark:text-slate-100">
                No Questions Generated Yet
              </h3>
              <p className="text-gray-600 mb-4 dark:text-slate-300">
                Click the "Generate Questions" button to create AI-powered
                questions for your exams.
              </p>
              <Button
                onClick={handleGenerateQuestions}
                className="cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 dark:text-slate-100"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Get Started
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
