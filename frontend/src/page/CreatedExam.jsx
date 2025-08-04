import TakeExamForm from "@/components/TakeExamForm";
import { removeInvitedEmailUser } from "@/store/exam/ExamSlice";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { signoutSuccess } from "@/store/user/userSlice";
import ExamNotStartedORAlreadyOver from "@/components/ExamNotStartedORAlreadyOver";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleFailureToast } from "@/components/ToastService";
import { Toaster } from "@/components/ui/sooner";

const CreatedExam = () => {
  const { examCode } = useParams();
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("");
  const [isTakenExam, setIsTakenExam] = useState(false);
  const [allowedTime, setAllowedTime] = useState(0);
  const [examOverOrNotStart, setExamOverOrNotStart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState({
    startDate: "",
    endDate: "",
  });
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const email = currentUser && currentUser.email;
    if (!email) {
      navigate("/home");
      return;
    }

    const fetchQuestionAndExamData = async () => {
      try {
        const res = await axios.post(
          `/api/exam/start`,
          {
            examCode,
            email,
          },
          {
            headers: {
              Authorization: `Bearer ${currentUser?.token}`,
            },
          }
        );

        if (res.data === "") {
          navigate("/login");
          dispatch(signoutSuccess());
        }

        if (res.status === 200) {
          setTitle(res.data.quizTitle);
          const now = Date.now();
          const startTime = new Date(res.data.startTime).getTime();
          const allowedTimeMs = res.data.allowedTime * 60 * 1000;
          const timeRemaining = Math.floor(
            (startTime + allowedTimeMs - now) / 1000
          );
          setAllowedTime(timeRemaining < 0 ? 0 : timeRemaining);
          if (timeRemaining < 0) {
            setIsTakenExam(true);
          }
          setQuestions(res.data.questions);
        }
      } catch (error) {
        if (error.response?.status === 409) {
          if (
            error.response?.data?.message === "EXAM_OVER" ||
            error.response?.data?.message === "EXAM_NOT_START"
          ) {
            setExamOverOrNotStart(true);
            setDate({
              startDate: error.response?.data?.startDate,
              endDate: error.response?.data?.endDate,
            });
          }
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionAndExamData();
  }, [currentUser, dispatch, examCode, navigate]);

  const submitExam = async (selectedAnswers) => {
    try {
      const email = currentUser.email;
      const res = await axios.post(
        `api/exam/submit-exam`,
        {
          examCode,
          questionAnswerList: selectedAnswers,
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        }
      );
      if (res.status === 200) {
        dispatch(removeInvitedEmailUser());
        navigate("/exams");
      }
    } catch (error) {
      handleFailureToast(error?.response?.data?.message);
      console.log(error);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10 dark:bg-slate-900">
      <Toaster position="top-right" />

      {isTakenExam && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center space-y-4">
            <div className="flex justify-center">
              <XCircle className="h-14 w-14 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-800">
              You've Already Taken the Exam
            </h2>
            <p className="text-sm text-gray-700">
              Our system indicates that you've already submitted this exam. If
              you believe this is a mistake, please contact your instructor.
            </p>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full dark:bg-slate-800 dark:hover:bg-slate-900 cursor-pointer"
              >
                Try Again
              </Button>
              <Link to={"/home"}>
                <Button
                  variant="ghost"
                  className="w-full dark:text-gray-900 dark:hover:bg-slate-100 dark:border dark:border-slate-300 cursor-pointer "
                >
                  Back to Invitation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {!isTakenExam &&
        (loading ? (
          <Card className="w-full max-w-xl p-6 space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </Card>
        ) : examOverOrNotStart ? (
          <ExamNotStartedORAlreadyOver
            startDate={date.startDate}
            endDate={date.endDate}
          />
        ) : questions.length > 0 ? (
          <Card className="w-full max-w-6xl dark:bg-slate-800">
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <TakeExamForm
                questions={questions}
                quizTitle={title}
                onSave={submitExam}
                allowedTime={allowedTime}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="text-center text-gray-500 text-2xl">
            The requested exam is unavailable!
          </div>
        ))}
    </div>
  );
};

export default CreatedExam;
