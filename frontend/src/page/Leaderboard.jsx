import { Trophy, Medal, Award, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Layout from "@/components/layout/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";

const getRankIcon = (rank) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />;
    default:
      return (
        <span className="text-sm font-semibold text-muted-foreground">
          #{rank}
        </span>
      );
  }
};

const getRankBadgeColor = (rank) => {
  switch (rank) {
    case 1:
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case 2:
      return "bg-gray-100 text-gray-800 border-gray-300";
    case 3:
      return "bg-amber-100 text-amber-800 border-amber-300";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function Leaderboard() {
  const { currentUser } = useSelector((state) => state.user);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [additionalData, setAdditionalData] = useState({
    highestAverage: 0,
    highestScore: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/exam/leaderboard", {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        });
        if (res.status === 200) {
          setLeaderboardData(res.data.leaderboard);
          setMyRank(res.data.myRank);
          setAdditionalData({
            highestAverage: res.data.leaderboard[0].averagePercentage,
            highestScore: res.data.leaderboard[0].finalScore,
          });
          setTotalParticipants(res.data.totalParticipants);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser?.token]);

  const currentUserInTop10 =
    leaderboardData.length > 0 &&
    leaderboardData.some((user) => user?.userId === myRank?.userId);

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex items-center mb-8 justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
            <p className="text-muted-foreground">Top performers and rankings</p>
          </div>
        </div>
        {loading ? (
          <Card className="p-6 space-y-4 dark:bg-slate-800">
            <Skeleton className="h-6 w-1/2 dark:bg-slate-600" />
            <Skeleton className="h-6 w-full dark:bg-slate-600" />
            <Skeleton className="h-6 w-full dark:bg-slate-600" />
            <Skeleton className="h-6 w-3/4 dark:bg-slate-600" />
          </Card>
        ) : (
          <>
            <Card className={"dark:bg-slate-800"}>
              <CardHeader>
                <CardTitle className={"flex gap-3"}>
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Top 10 Rankings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20">Rank</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead className="text-right">Avg Score</TableHead>
                        <TableHead className="text-right">Exams</TableHead>
                        <TableHead className="text-right">
                          Final Score
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaderboardData.map((user) => {
                        const isCurrentUser = user?.userId === myRank?.userId;
                        return (
                          <TableRow
                            key={user?.userId}
                            className={
                              isCurrentUser
                                ? "bg-blue-50 border-blue-200 dark:bg-slate-700"
                                : ""
                            }
                          >
                            <TableCell>
                              <div className="flex items-center justify-center">
                                {user.rank <= 3 ? (
                                  <Badge
                                    variant="outline"
                                    className={getRankBadgeColor(user.rank)}
                                  >
                                    <div className="flex items-center gap-1">
                                      {getRankIcon(user.rank)}
                                      <span className="font-semibold">
                                        {user.rank}
                                      </span>
                                    </div>
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="bg-muted text-muted-foreground"
                                  >
                                    #{user.rank}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {isCurrentUser && (
                                  <User className="h-4 w-4 text-blue-600" />
                                )}
                                <span
                                  className={
                                    isCurrentUser
                                      ? "font-semibold text-blue-600"
                                      : "font-medium"
                                  }
                                >
                                  {user.userName}
                                </span>
                                {isCurrentUser && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    You
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {user.averagePercentage.toFixed(1)}%
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {user.examsTaken}
                            </TableCell>
                            <TableCell className="text-right font-mono font-semibold">
                              {user.finalScore.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            {!currentUserInTop10 && (
              <Card className="mt-6 dark:bg-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Your Ranking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    {myRank && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-20">Rank</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead className="text-right">
                              Avg Score
                            </TableHead>
                            <TableHead className="text-right">Exams</TableHead>
                            <TableHead className="text-right">
                              Final Score
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className="bg-blue-50 border-blue-200 dark:bg-slate-700">
                            <TableCell>
                              <div className="flex items-center justify-center">
                                <Badge
                                  variant="outline"
                                  className="bg-blue-100 text-blue-800 border-blue-300"
                                >
                                  #{myRank?.rank}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-blue-600" />
                                <span className="font-semibold text-blue-600">
                                  {myRank.userName}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  You
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {myRank.averagePercentage.toFixed(1)}%
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {myRank.examsTaken}
                            </TableCell>
                            <TableCell className="text-right font-mono font-semibold">
                              {myRank.finalScore.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <Card className={"dark:bg-slate-800"}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">
                      {additionalData.highestAverage}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Highest Average
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className={"dark:bg-slate-800"}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Award className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">
                      {additionalData.highestScore.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Highest Final Score
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className={"dark:bg-slate-800"}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <User className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">
                      {totalParticipants}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total Participants
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
