"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Clock, BarChart3, ArrowLeft, Download, Share2 } from "lucide-react";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import axios from "axios";
import { useSelector } from "react-redux";

export default function ExamResult() {
  const navigate = useNavigate();
  const { examCode } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await axios.get(`api/exam/result?examCode=${examCode}`, {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        });
        if (res.status === 200) {
          setResult(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchResult();
  }, [currentUser?.token, examCode]);

  const COLORS = ["#10B981", "#EF4444"];

  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-slate-900">
      <div className="container max-w-4xl mx-auto px-4">
        {result != null && (
          <>
            <Card className="mb-6 dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="text-2xl">{result.examTitle}</CardTitle>
                <CardDescription>
                  Completed on {result.completionTime}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      {result.score}%
                    </div>
                    <div className="text-sm text-gray-600">Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {result.correctAnswers}/{result.totalQuestions}
                    </div>
                    <div className="text-sm text-gray-600">Correct Answers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-600 mb-2">
                      {result.timeTaken}
                    </div>
                    <div className="text-sm text-gray-600">Time Taken</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Answer Distribution Chart */}
              <Card className={"dark:bg-slate-800"}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Answer Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={result.questionStats}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {result?.questionStats?.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Time Distribution Chart */}
              <Card className={"dark:bg-slate-800"}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Time Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={result.performance.timeDistribution}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div> */}
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Result
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share Result
              </Button>
              <Button
                variant="default"
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 dark:text-slate-100"
                onClick={() => navigate(`/practice/${examCode}/review`)}
              >
                Review
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
