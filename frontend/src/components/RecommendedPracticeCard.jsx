import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function RecommendedPracticeCard({ recommendation }) {
  return (
    <Card className={"dark:bg-slate-800"}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-purple-500" />
          Recommended Practice
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendation.map((topic) => (
            <div
              key={topic.topicId}
              className="border rounded-lg p-3 space-y-2"
            >
              <h3 className="font-medium">{topic.title}</h3>
              <p className="text-xs text-muted-foreground">{topic.reason}</p>
              <Button
                size="sm"
                className="w-full bg-purple-800 dark:text-slate-100 dark:hover:bg-purple-900"
              >
                Start Practice
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
