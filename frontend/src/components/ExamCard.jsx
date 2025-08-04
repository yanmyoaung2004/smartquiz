import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  BookOpen,
  Database,
  FileCode,
  SplitSquareVertical,
  BarChart,
  Repeat,
  Shield,
} from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export function ExamCard({
  title,
  description,
  questionCount,
  duration,
  creator,
  examCode,
  icon,
  taken,
}) {
  const icons = {
    BookOpen,
    Database,
    FileCode,
    SplitSquareVertical,
    BarChart,
    Repeat,
    Shield,
  };
  const navigate = useNavigate();
  const IconComponent = icons[icon] || BookOpen;
  const takeExam = () => {
    navigate(`/exams/${examCode}`);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md dark:bg-slate-800">
      <CardContent className="p-6 pb-4">
        <div className="flex items-start gap-4">
          <div className="bg-purple-100 p-2 rounded-lg">
            <IconComponent className="h-8 w-8 text-purple-700" />
          </div>
          <div className="space-y-1 flex-1">
            <h3 className="font-semibold  dark:text-slate-100">{title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 dark:text-slate-300">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-muted-foreground dark:text-slate-300  mb-1">
            Total Questions : {questionCount}{" "}
            {questionCount === 1 || questionCount === 0
              ? "question"
              : "questions"}{" "}
          </p>
          <p className="text-sm text-muted-foreground dark:text-slate-300  mb-1">
            Allowed Time : {duration}{" "}
            {duration === 1 || duration === 0 ? "min" : "minutes"}{" "}
          </p>
          <p className="text-sm text-muted-foreground dark:text-slate-300">
            Creator : {creator}
          </p>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex gap-2">
        {taken && (
          <Button className="cursor-pointer flex-1 text-sm font-semibold bg-purple-900 hover:bg-purple-900 text-white rounded-md shadow-sm transition duration-150 ease-in-out">
            Already Taken
          </Button>
        )}
        {!taken && (
          <Button
            onClick={takeExam}
            className="cursor-pointer flex-1 text-sm font-semibold bg-purple-800 hover:bg-purple-900 text-white rounded-md shadow-sm transition duration-150 ease-in-out"
          >
            Practice
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
