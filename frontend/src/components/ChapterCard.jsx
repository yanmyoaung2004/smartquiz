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
import PracticeConfigurationDialog from "./PracticeConfigurationDialog";

export function ChapterCard({
  id,
  title,
  chapter,
  description,
  questionCount,
  icon,
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

  const IconComponent = icons[icon] || BookOpen;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md dark:bg-slate-800">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-purple-100 p-2 rounded-lg">
            <IconComponent className="h-8 w-8 text-purple-700" />
          </div>
          <div className="space-y-1 flex-1">
            <h3 className="font-semibold  dark:text-slate-100">{title}</h3>
            <h4 className="text-sm font-semibold  dark:text-slate-300">
              {chapter}
            </h4>
            <p className="text-sm text-muted-foreground line-clamp-2 dark:text-slate-300">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-muted-foreground dark:text-slate-300">
            {questionCount}{" "}
            {questionCount === 1 || questionCount === 0
              ? "question"
              : "questions"}{" "}
            available
          </p>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex gap-2">
        <PracticeConfigurationDialog topicId={id} />
      </CardFooter>
    </Card>
  );
}
