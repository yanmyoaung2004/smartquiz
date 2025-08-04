"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Clock,
  User,
  Calendar,
  Play,
  X,
  HelpCircle,
  Timer,
} from "lucide-react";
import { format, isAfter, isBefore } from "date-fns";
import { cn } from "@/components/lib/utils";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function getExamStatus(startTime, endTime) {
  const now = new Date();
  if (isBefore(now, startTime)) return "upcoming";
  if (isAfter(now, endTime)) return "ended";
  return "active";
}

export function Notification({ notifications, setNotifications }) {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const unreadCount =
    notifications.length > 0
      ? notifications.filter((exam) => !exam.read).length
      : 0;

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const res = await axios.get(`/api/user/get-notifications`, {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        });
        if (res.data === "") return;
        if (res.status === 200) {
          setNotifications(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchNotification();
  }, [currentUser?.token, setNotifications]);

  const startExam = (code) => {
    navigate(`/exams/${code}`);
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        aria-label="Exam Notifications"
        onClick={() => setIsOpen(true)}
        className="relative border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 cursor-pointer"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 text-xs font-bold flex items-center justify-center bg-gradient-to-r bg-red-500 text-white rounded-full shadow-lg animate-pulse">
            {unreadCount}
          </span>
        )}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-50  transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Notification Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out transform",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-5 text-white flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <h3 className="font-semibold text-lg">Exam Invitations</h3>
              </div>
              <p className="text-purple-100 text-sm mt-1">
                {unreadCount > 0
                  ? `${unreadCount} new invitation${
                      unreadCount !== 1 ? "s" : ""
                    }`
                  : "All caught up!"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-purple-500/20"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No exam invitations</p>
              </div>
            ) : (
              <div className="p-4">
                {notifications.length > 0 &&
                  notifications.map((exam) => {
                    const status = getExamStatus(exam.startTime, exam.endTime);
                    return (
                      <div
                        key={exam.id}
                        className={`relative p-4 mb-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
                          !exam.read
                            ? "bg-purple-50 border-purple-200 shadow-sm"
                            : "bg-white border-gray-200 hover:border-purple-200"
                        }`}
                      >
                        {!exam.read && (
                          <div className="absolute top-3 right-3 h-2 w-2 bg-purple-500 rounded-full"></div>
                        )}

                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {exam.title}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>{exam.teacher}</span>
                              </div>
                              <Badge
                                variant="secondary"
                                className="bg-purple-100 text-purple-700 hover:bg-purple-200"
                              >
                                {exam.subject}
                              </Badge>
                            </div>
                          </div>
                          <Badge
                            variant={
                              status === "active"
                                ? "default"
                                : status === "upcoming"
                                ? "secondary"
                                : "outline"
                            }
                            className={
                              status === "active"
                                ? "bg-green-100 text-green-700 border-green-200"
                                : status === "upcoming"
                                ? "bg-blue-100 text-blue-700 border-blue-200"
                                : "bg-gray-100 text-gray-600 border-gray-200"
                            }
                          >
                            {status === "active"
                              ? "Live"
                              : status === "upcoming"
                              ? "Upcoming"
                              : "Ended"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-4 w-4 text-purple-500" />
                            <div>
                              <p className="font-medium">Start</p>
                              <p>{format(exam.startTime, "MMM d, h:mm a")}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="h-4 w-4 text-purple-500" />
                            <div>
                              <p className="font-medium">End</p>
                              <p>{format(exam.endTime, "MMM d, h:mm a")}</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <HelpCircle className="h-4 w-4 text-purple-500" />
                            <div>
                              <p className="font-medium">Questions</p>
                              <p>{exam.questions} questions</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Timer className="h-4 w-4 text-purple-500" />
                            <div>
                              <p className="font-medium">Duration</p>
                              <p>{exam.duration} minutes</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {status === "active" && (
                            <Button
                              onClick={() => startExam(exam.examCode)}
                              size="sm"
                              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Start Exam
                            </Button>
                          )}
                          {status === "upcoming" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300"
                            >
                              <Calendar className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          )}
                          {status === "ended" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-50"
                              disabled
                            >
                              Exam Ended
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 px-4 py-3 flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            >
              Mark all as read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            >
              View all exams →
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
