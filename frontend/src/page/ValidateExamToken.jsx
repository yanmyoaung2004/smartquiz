"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setInvitedEmailUser } from "@/store/exam/ExamSlice";

export default function ValidateToken() {
  const [status, setStatus] = useState("validating");
  const [message, setMessage] = useState("");
  const { invitationCode } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const validateToken = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const res = await axios.get(
          `/api/exam/invite/accept?token=${invitationCode}`
        );
        if (res.status === 200) {
          dispatch(
            setInvitedEmailUser({
              email: res.data.email,
              isUserExisted: res.data.isUserExisted,
              examCode: res.data.examCode,
            })
          );
          setStatus("valid");
          setMessage("Token validated successfully! Redirecting to exam...");
          setTimeout(() => {
            navigate(`/exams/${res.data.examCode}`);
          }, 1500);
        } else {
          setStatus("invalid");
          setMessage(
            "Invalid or expired exam token. Please check your invitation email."
          );
        }
      } catch (error) {
        console.log(error);
        const backendMessage =
          error.response?.data?.message || "An unexpected error occurred.";
        setStatus("invalid");
        setMessage(backendMessage);
      }
    };

    validateToken();
  }, [dispatch, invitationCode, navigate]);

  const handleRetry = () => {
    setStatus("validating");
    setMessage("");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="space-y-6">
            {status === "validating" && (
              <>
                <div className="flex justify-center">
                  <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Validating Exam Token
                  </h2>
                  <p className="text-gray-600">
                    Please wait while we verify your exam access...
                  </p>
                </div>
              </>
            )}

            {status === "valid" && (
              <>
                <div className="flex justify-center">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-green-900 mb-2">
                    Token Validated
                  </h2>
                  <p className="text-green-700">{message}</p>
                </div>
              </>
            )}

            {status === "invalid" && (
              <>
                <div className="flex justify-center">
                  <XCircle className="h-12 w-12 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-red-900 mb-2">
                    Validation Failed
                  </h2>
                  <p className="text-red-700 mb-4">{message}</p>
                  <div className="space-y-2">
                    <Button
                      onClick={handleRetry}
                      variant="outline"
                      className="w-full"
                    >
                      Try Again
                    </Button>
                    <Button
                      onClick={() =>
                        (window.location.href = "https://mail.google.com")
                      }
                      variant="ghost"
                      className="w-full"
                    >
                      Back to Invitation
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
