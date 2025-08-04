import React, { useEffect, useState } from "react";
import ExamResultDetail from "./ExamResultDetail";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

const UserExamResultDetails = () => {
  const { examCode } = useParams();
  const [searchParams] = useSearchParams();
  const userEmail = searchParams.get("u");
  const { currentUser } = useSelector((state) => state.user);

  const [result, setResult] = useState(null);
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await axios.get(
          `api/exam/exam-review?examCode=${examCode}&email=${userEmail}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        if (res.status === 200) {
          setResult(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchResult();
  }, [currentUser.token, examCode, userEmail]);

  return <ExamResultDetail result={result} />;
};

export default UserExamResultDetails;
