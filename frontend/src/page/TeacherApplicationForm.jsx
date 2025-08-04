"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock, Upload, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";
import { useSelector } from "react-redux";

export default function TeacherApplicationForm() {
  const [reason, setReason] = useState("");
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [status, setStatus] = useState("none");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`api/user/role-request/user/teacher`, {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        });
        if (res.status === 200) {
          setFileData(res.data.fileData);
          setFileName(res.data.fileName);
          setStatus(res.data.status);
          setReason(res.data.reason);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser?.token) {
      fetchData();
    }
  }, [currentUser?.token]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openFileDialog,
  } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
    },
    noClick: true,
    noKeyboard: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      setError("Please provide a reason for your application");
      return;
    }

    if (!file) {
      setError("Please upload a CV form for your application");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      formData.append("reason", reason);

      const res = await axios.post(`/api/user/request-teacher-role`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${currentUser?.token}`,
        },
      });

      if (res.status === 200) {
        setStatus("PENDING");
        console.log("Application submitted:", { reason, file });
      }
    } catch (err) {
      console.log(err);
      setError("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1"
          >
            <Clock className="h-3 w-3" /> Pending Review
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" /> Approved
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1"
          >
            <X className="h-3 w-3" /> Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const viewFile = () => {
    if (!fileData || !fileName) return;

    const byteCharacters = atob(fileData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    let mimeType = "application/octet-stream";
    if (fileName.endsWith(".pdf")) mimeType = "application/pdf";
    else if (fileName.endsWith(".doc") || fileName.endsWith(".docx"))
      mimeType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    const blob = new Blob([byteArray], { type: mimeType });
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  const downloadFile = () => {
    if (!fileData || !fileName) return;

    const link = document.createElement("a");
    link.href = `data:application/octet-stream;base64,${fileData}`;
    link.download = fileName;
    link.click();
  };

  return (
    <Card className="rounded-2xl shadow-lg dark:bg-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            Teacher Application
          </CardTitle>
          {getStatusBadge()}
        </div>
        <CardDescription>
          Apply to become a teacher and share your knowledge with students
        </CardDescription>
      </CardHeader>

      {status === "none" ? (
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="reason">
                Why do you want to become a teacher?{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="reason"
                placeholder="Share your teaching experience, qualifications, and motivation..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[150px] rounded-xl mt-1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>CV Form</Label>
              <span className="text-red-500">*</span>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-purple-400 bg-purple-50"
                    : "border-gray-300"
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center">
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-700">
                    {file ? file.name : "Drag & drop or click to upload"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, DOC up to 10MB
                  </p>
                  <Button
                    type="button"
                    onClick={openFileDialog}
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                  >
                    Browse files
                  </Button>
                </div>
              </div>

              {file && (
                <div className="mt-4 flex items-center justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFile(null)}
                    className="text-xs"
                  >
                    Remove file
                  </Button>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className={"mt-5"}>
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 rounded-xl py-6 dark:text-slate-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </CardFooter>
        </form>
      ) : (
        <CardContent className="space-y-6">
          {status === "PENDING" && (
            <Alert className="bg-yellow-50 text-yellow-800 border-yellow-100 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Your application is being reviewed. We'll notify you once a
                decision has been made.
              </AlertDescription>
            </Alert>
          )}

          {status === "APPROVED" && (
            <Alert className="bg-green-50 text-green-800 border-green-100 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Congratulations! Your application has been approved. You can now
                access teacher features.
              </AlertDescription>
            </Alert>
          )}

          {status === "REJECTED" && (
            <Alert className="bg-red-50 text-red-800 border-red-100 flex items-center gap-2">
              <X className="h-4 w-4" />
              <AlertDescription>
                Unfortunately, your application was not approved at this time.
                You may apply again after 30 days.
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-gray-100 dark:bg-slate-800 dark:border dark:border-slate-300 p-4 rounded-xl">
            <h3 className="font-medium mb-2">Your Application Reason:</h3>
            <p className="text-gray-700 text-sm whitespace-pre-wrap dark:text-slate-300">
              {reason}
            </p>

            {/* File display section */}
            {fileData && fileName && (
              <div className="mt-6 p-4 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-600">
                <h4 className="font-semibold mb-2">Uploaded File:</h4>
                <p className="mb-2 text-gray-700 dark:text-slate-300">
                  {fileName}
                </p>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={viewFile}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    View File
                  </button>

                  <button
                    type="button"
                    onClick={downloadFile}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                  >
                    Download File
                  </button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
