import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Clock } from "lucide-react";
import { format } from "date-fns";

const ExamNotStartedORAlreadyOver = ({ startDate, endDate }) => {
  const navigate = useNavigate();
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  let title = "";
  let description = "";
  let Icon = Clock;

  if (now < start) {
    const timeUntilStart = Math.floor((start - now) / 60000);
    title = "This exam hasn’t started yet";

    if (timeUntilStart > 0 && timeUntilStart <= 60) {
      description = `The exam will start in ${timeUntilStart} minute${
        timeUntilStart > 1 ? "s" : ""
      } at ${format(start, "hh:mm a")}.`;
    } else {
      description = `The exam is scheduled to start at ${format(
        start,
        "hh:mm a"
      )} on ${format(start, "PPP")}.`;
    }
    Icon = Clock;
  }

  // Exam is over
  else if (now > end) {
    title = "This exam is already over";
    description = `The exam ended at ${format(end, "hh:mm a")} on ${format(
      end,
      "PPP"
    )}.`;
    Icon = AlertTriangle;
  }

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-xl">
      <Alert variant="destructive" className="w-full">
        <div className="flex flex-col items-center space-y-4">
          <Icon className="h-10 w-10 text-red-600" />
          <AlertTitle className="text-3xl font-semibold">{title}</AlertTitle>
          <AlertDescription className="text-gray-700 text-lg">
            {description}
          </AlertDescription>
          <Button
            onClick={() => navigate("/exams")}
            className="mt-2 bg-red-500 hover:bg-red-600 cursor-pointer"
          >
            Back to Exams
          </Button>
        </div>
      </Alert>
    </div>
  );
};

export default ExamNotStartedORAlreadyOver;
