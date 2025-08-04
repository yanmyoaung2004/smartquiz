import TakeExamForm from "@/components/TakeExamForm";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const PracticeExam = () => {
  const { examCode } = useParams();
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestionAndExamData = async () => {
      try {
        const res = await axios.get(`/api/exam/practice?examCode=${examCode}`, {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        });
        if (res.status === 200) {
          setQuestions(res.data.questions);
          setTitle(res.data.quizTitle);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchQuestionAndExamData();
  }, [currentUser?.token, examCode]);

  const submitExam = async (selectedAnswers) => {
    try {
      const res = await axios.post(
        `/api/exam/submit-practice`,
        {
          examCode: examCode,
          questionAnswerList: selectedAnswers,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        }
      );
      if (res.status === 200) {
        navigate("result");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <TakeExamForm
        questions={questions}
        quizTitle={title}
        onSave={submitExam}
        allowedTime={0}
      />
    </div>
  );
};

export default PracticeExam;
