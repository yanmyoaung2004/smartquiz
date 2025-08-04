import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export function PracticeHistoryCard({ practiceHistory }) {
  return (
    <Card className={"dark:bg-slate-800"}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-purple-500" />
          Recent Practice
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {practiceHistory.map((session) => (
            <div
              key={session.id}
              className="flex items-start space-x-3 border-b pb-3 last:border-0 last:pb-0"
            >
              <div className="flex-1 space-y-1">
                <h3 className="font-medium">{session.topic}</h3>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>{new Date(session.date).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span>{session.time}</span>
                </div>
              </div>
              <div className="text-sm font-medium">{session.score}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
