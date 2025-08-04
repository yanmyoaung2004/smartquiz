import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, BookOpen, Brain } from "lucide-react";

export function QuestionCard({ question, index }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 border-green-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Hard":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <Card className="w-full dark:text-slate-300 dark:bg-slate-800">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-semibold">
              Q{index + 1}
            </span>
            <BookOpen className="h-5 w-5 text-blue-600" />
          </CardTitle>
          <div className="flex gap-2">
            {/* {question.subject && (
              <Badge variant="outline" className="text-xs">
                {question.subject}
              </Badge>
            )} */}
            {/* {question.difficulty && (
              <Badge
                variant="outline"
                className={`text-xs ${getDifficultyColor(question.difficulty)}`}
              >
                {question.difficulty}
              </Badge>
            )} */}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Question */}
        <div className="p-4 bg-gray-50 rounded-lg dark:bg-transparent text-lg ">
          <p className="font-medium text-gray-900 dark:text-slate-100">
            {question.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-gray-700 mb-3 dark:text-slate-100">
            Options:
          </h4>
          {Object.entries(question.options).map(([key, value]) => (
            <div
              key={key}
              className={`p-2 rounded-lg border-2 flex items-center gap-2 ${
                key === question.correctAnswer
                  ? "bg-green-50 border-green-200 text-green-800 dark:text-gray-900"
                  : "bg-white border-gray-200 dark:text-gray-900"
              }`}
            >
              <span
                className={`font-bold text-sm px-2 py-1 rounded ${
                  key === question.correctAnswer
                    ? "bg-green-200 text-green-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {key}
              </span>
              <span className="flex-1">{value}</span>
              {key === question.correctAnswer && (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
            </div>
          ))}
        </div>

        {/* Correct Answer */}
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-green-800 text-sm">
              Correct Answer:
            </span>
            <Badge className="bg-green-600 text-white hover:bg-green-700 cursor-pointer">
              Option {question.correctAnswer}
            </Badge>
          </div>
        </div>

        {/* Explanation */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Brain className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-semibold text-blue-800 text-sm block mb-1">
                Explanation:
              </span>
              <p className="text-blue-700 leading-relaxed">
                {question.explanation}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
