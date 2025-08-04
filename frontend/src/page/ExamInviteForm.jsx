import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import {
  BookOpen,
  Calendar,
  ChevronLeft,
  Clock,
  Copy,
  LinkIcon,
  List,
  Settings,
  Users,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { createExamRemove } from "@/store/exam/ExamSlice";
import { handleSuccessToast } from "@/components/ToastService";
import { Toaster } from "@/components/ui/sooner";

const ExamInviteForm = () => {
  const { exam } = useSelector((state) => state.exam);
  const { currentUser } = useSelector((state) => state.user);
  const [emails, setEmails] = useState([]);
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setEmails(exam.invitedEmail);
  }, [exam.invitedEmail]);

  const handleCopy = async () => {
    const directUrl = `http://localhost:5173/exams/${exam?.examCode}`;
    try {
      await navigator.clipboard.writeText(directUrl);
    } catch (err) {
      console.log(err);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const email = input.trim().replace(/,$/, "");
      if (email && validateEmail(email) && !emails.includes(email)) {
        setEmails([...emails, email]);
        setInput("");
      }
    }
  };

  const removeEmail = (emailToRemove) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleEmailInvite = async () => {
    if (emails.length === 0) {
      return;
    }
    try {
      const res = await axios.post(
        `api/exam/invite-participant`,
        {
          emails: emails,
          examCode: exam?.examCode,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        }
      );
      if (res.status === 200) {
        handleSuccessToast("You have successfully Invited! ");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const publishExam = async () => {
    try {
      const res = await axios.post(
        `/api/exam/publish?examCode=${exam?.examCode}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        }
      );
      if (res.status === 200) {
        dispatch(createExamRemove());
        handleEmailInvite();
        navigate(`/exams`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-slate-900">
      <Toaster position="top-right" />
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <Link to="/exams">
            <Button
              variant="ghost"
              size="icon"
              className="flex items-center gap-2 cursor-pointer w-fit p-2"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Back to Exams</span>
            </Button>
          </Link>
          <h1 className="mt-6 text-4xl font-semibold text-gray-900 dark:text-slate-100">
            Configure Exam Invitation
          </h1>
          <p className="mt-2 text-gray-600 dark:text-slate-300">
            Provide exam access details, invite students, and customize
            participation options.
          </p>
        </div>

        {/* Exam Info */}
        {exam && (
          <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                    <CardTitle className="text-2xl font-bold text-slate-900">
                      <div className="flex gap-10 mb-2 dark:text-slate-300">
                        <span>{exam?.title}</span>
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-800 border-blue-200 select-none"
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          Setup Mode
                        </Badge>
                      </div>
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base text-slate-700 max-w-5xl dark:text-slate-300">
                    {exam?.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            {exam?.startDate && (
              <CardContent className="pt-0">
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="font-medium dark:text-slate-300">
                      Start Date:
                    </span>
                    <span className="dark:text-slate-300">
                      {new Date(exam?.startDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {exam?.duration && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Duration:</span>
                      <span>{exam.duration} minutes</span>
                    </div>
                  )}
                  {exam?.duration && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <List className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Number Of Questions:</span>
                      <span>{exam?.totalQuestions}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        )}

        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="mb-6"></TabsList>

          <TabsContent value="details">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-5">
              <Card className={"dark:bg-slate-800"}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Email Invitations
                  </CardTitle>
                  <CardDescription className={"dark:text-slate-300"}>
                    Distribute invitations directly to student email addresses.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="emails">Email Addresses</Label>
                    <div className="flex flex-wrap gap-2 p-2 min-h-[120px] border rounded-md ">
                      {emails.map((email, index) => (
                        <div
                          key={index}
                          className="flex items-center px-2 bg-muted border rounded-full text-sm"
                        >
                          {email}
                          <button
                            type="button"
                            onClick={() => removeEmail(email)}
                            className="ml-2 text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <textarea
                        id="emails"
                        value={input ?? ""}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Type email and press Enter or comma"
                        className="flex-grow w-full min-h-[40px] border-none focus:ring-0 outline-none resize-none text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Custom Message (Optional)</Label>
                    <textarea
                      id="message"
                      placeholder="Include an optional message to personalize the invitation."
                      className="min-h-[80px] w-full border rounded-md p-2"
                    />
                  </div>
                  <div className="w-full">
                    <Button
                      className={
                        "w-full bg-purple-600 hover:bg-purple-800 cursor-pointer dark:text-white"
                      }
                      onClick={handleEmailInvite}
                    >
                      Send Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card className={"dark:bg-slate-800"}>
                <CardHeader>
                  <CardTitle>Alternative Access Options</CardTitle>
                  <CardDescription className={"dark:text-slate-300"}>
                    Offer flexible access methods for student convenience.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <LinkIcon className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Direct Access Link</p>
                          <p className="text-sm text-gray-600 dark:text-slate-400">
                            Share a direct URL for students to access the exam.
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        className={"cursor-pointer"}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Users className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Exam Access Code</p>
                          <p className="text-sm text-gray-600 dark:text-slate-400">
                            Students can enter this code to participate.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={exam?.examCode ?? ""}
                          readOnly
                          className="font-mono"
                        />
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-purple-600 hover:bg-purple-800 cursor-pointer dark:text-white"
                      onClick={publishExam}
                      disabled={exam?.status === "PUBLISHED"}
                    >
                      <span className="ml-2">
                        {exam?.status !== "PUBLISHED"
                          ? "Publish Exam"
                          : "Already Published"}
                      </span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ExamInviteForm;
