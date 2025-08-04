import React, { useEffect, useState } from "react";
import { ChapterCard } from "@/components/ChapterCard";
import { Layout } from "@/components/layout/Layout";
import { PracticeHeader } from "@/components/PracticeHeader";
import { PracticeHistoryCard } from "@/components/PracticeHistoryCard";
import { RecommendedPracticeCard } from "@/components/RecommendedPracticeCard";
import axios from "axios";
import { useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Practice = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState([]);
  const [practiceHistory, setPracticeHistory] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await axios.get("api/topic/all", {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        });

        const response = await axios.get(
          `api/topic/get-recommendation-history`,
          {
            headers: {
              Authorization: `Bearer ${currentUser?.token}`,
            },
          }
        );

        if (response.status === 200) {
          setRecommendation(response.data.recommendedTopics);
          setPracticeHistory(response.data.recentPractice);
        }
        if (res.status === 200) setTopics(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, [currentUser?.token]);

  const groupedTopics =
    topics.length > 0 &&
    topics.reduce((acc, topic) => {
      const chapterName = topic.chapter.name;
      if (!acc[chapterName]) {
        acc[chapterName] = [];
      }
      acc[chapterName].push(topic);
      return acc;
    }, {});

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-6">
        <PracticeHeader />
        {loading ? (
          <Card className="p-6 space-y-4 dark:bg-slate-800 mt-5">
            <Skeleton className="h-6 w-1/2 dark:bg-slate-600" />
            <Skeleton className="h-6 w-full dark:bg-slate-600" />
            <Skeleton className="h-6 w-full dark:bg-slate-600" />
            <Skeleton className="h-6 w-3/4 dark:bg-slate-600" />
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="md:col-span-2">
              {Object.entries(groupedTopics).map(
                ([chapterName, chapterTopics]) => (
                  <div key={chapterName} className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 dark:text-slate-300">
                      {chapterName}
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {chapterTopics.map((topic) => (
                        <ChapterCard
                          key={topic.id}
                          id={topic.id}
                          chapter={topic.chapter.name}
                          title={topic.name}
                          description={topic.description}
                          questionCount={topic.numberOfQuestions}
                          icon="Database"
                        />
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="space-y-6">
              {recommendation?.length > 0 && (
                <RecommendedPracticeCard recommendation={recommendation} />
              )}
              {practiceHistory?.length > 0 && (
                <PracticeHistoryCard practiceHistory={practiceHistory} />
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Practice;
