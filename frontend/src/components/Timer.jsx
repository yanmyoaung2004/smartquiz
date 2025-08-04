import { Clock } from "lucide-react";
import React, { useEffect, useState } from "react";

const Timer = ({ allowedTime, onTimeUp }) => {
  const [timeRemaining, setTimeRemaining] = useState(allowedTime);

  useEffect(() => {
    if (allowedTime === 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          onTimeUp();
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [allowedTime, onTimeUp]);

  if (allowedTime === 0) return null;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const percentRemaining = (timeRemaining / allowedTime) * 100;

  let colorClass = "text-green-600";
  if (percentRemaining <= 50 && percentRemaining > 20) {
    colorClass = "text-yellow-500";
  } else if (percentRemaining <= 20) {
    colorClass = "text-red-600";
  }

  return (
    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border shadow-sm">
      <Clock className={`h-4 w-4 ${colorClass}`} />
      <span className={`text-sm font-medium ${colorClass}`}>
        Time Remaining: {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
};

export default Timer;
