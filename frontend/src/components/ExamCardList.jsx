import React from "react";
import { Card, CardContent } from "./ui/card";
import { BookOpen, FileText, Play, Target, Users } from "lucide-react";

const ExamCardList = ({
  firstCardLabel,
  firstCardValue,
  secondCardLabel,
  secondCardValue,
  thirdCardLabel,
  thirdCardValue,
  fourthCardLabel,
  fourthCardValue,
}) => {
  return (
    <>
      <Card className="border-l-4 border-l-blue-500 dark:bg-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {firstCardLabel}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {firstCardValue}
              </p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-green-500 dark:bg-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {secondCardLabel}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {secondCardValue}
              </p>
            </div>
            <Play className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-purple-500 dark:bg-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {thirdCardLabel}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {thirdCardValue}
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-yellow-500 dark:bg-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {/* Avg. Pass Rate */}
                {fourthCardLabel}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {isNaN(fourthCardValue) ? "0" : Math.round(fourthCardValue)}%
              </p>
            </div>
            <Target className="h-8 w-8 text-yellow-600" />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ExamCardList;
