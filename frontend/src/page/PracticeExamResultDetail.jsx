import React, { useEffect, useState } from "react";
import ExamResultDetail from "./ExamResultDetail";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const PracticeExamResultDetail = () => {
  const { examCode } = useParams();
  const [result, setResult] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await axios.get(`api/exam/review?examCode=${examCode}`, {
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

  return <ExamResultDetail result={result} />;
};

export default PracticeExamResultDetail;
