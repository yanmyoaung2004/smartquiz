import {
  BookOpen,
  Clock,
  FileText,
  Star,
  Target,
  MoreVertical,
  Edit,
  Trash2,
  Calendar,
  ClipboardCheck,
} from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { completeDraftExam } from "@/store/exam/ExamSlice";

const DraftExamCard = ({ exam }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";
  };

  const completeExam = () => {
    dispatch(completeDraftExam(exam));
    navigate(`/exams/${exam.examCode}/edit`);
  };

  return (
    <Card className="transition-all duration-200 border-l-4 hover:border-l-purple-500 dark:bg-slate-800">
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
                </div>

                {exam.description && (
                  <p className="text-gray-600 mb-3 line-clamp-2 dark:text-slate-300">
                    {exam.description}
                  </p>
                )}

                {/* Metadata */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
                    <FileText className="h-4 w-4" />
                    Draft
                  </Badge>

                  {exam.totalQuestions > 0 && (
                    <Badge
                      variant="outline"
                      className="text-xs dark:border-slate-700"
                    >
                      <BookOpen className="mr-1 h-3 w-3" />
                      {exam.totalQuestions} questions
                    </Badge>
                  )}

                  {exam.duration && (
                    <Badge
                      variant="outline"
                      className="text-xs dark:border-slate-700"
                    >
                      <Clock className="mr-1 h-3 w-3" />
                      {exam.duration} min
                    </Badge>
                  )}

                  {exam.passingScore && exam.totalQuestions > 0 && (
                    <Badge
                      variant="outline"
                      className="text-xs dark:border-slate-700"
                    >
                      <Target className="mr-1 h-3 w-3" />
                      {Math.floor(
                        (exam.passingScore / exam.totalQuestions) * 100
                      )}
                      % to pass
                    </Badge>
                  )}
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
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Exam
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Dates and Metadata (Optional) */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4 flex-wrap">
                {exam.startDate && exam.endDate && (
                  <span className="flex items-center dark:text-slate-300">
                    <Calendar className="mr-1 h-3 w-3" />
                    {formatDate(exam.startDate)} - {formatDate(exam.endDate)}
                  </span>
                )}
                {exam.subject && (
                  <span className="dark:text-slate-300">
                    Subject: {exam.subject}
                  </span>
                )}
                {exam.lastModified && (
                  <span className="dark:text-slate-300">
                    Modified: {formatDate(exam.lastModified)}
                  </span>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                className={"cursor-pointer dark:text-slate-300"}
                onClick={completeExam}
              >
                <ClipboardCheck className="mr-1 h-3 w-3" />
                Complete Exam
              </Button>
            </div>
          </div>

          {/* Status Icon */}
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-yellow-100 text-yellow-800 border-yellow-300">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-yellow-700 dark:text-slate-300 text-center">
              Draft
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DraftExamCard;
