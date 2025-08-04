"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Archive, UploadCloud } from "lucide-react";
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import { handleSuccessToast } from "./ToastService";

export default function QuestionImportDialog({
  importQuestion,
  setImportQuestion,
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { t } = useTranslation();
  const { currentUser } = useSelector((state) => state.user);

  const handleDownloadTemplate = async () => {
    setDownloading(true);
    try {
      const response = await axios.get("/api/question/question-template", {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "question-template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed", err);
      setStatus("Download failed.");
    } finally {
      setDownloading(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setStatus("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setIsUploading(true);
    setStatus("Uploading...");

    try {
      const response = await axios.post(
        "/api/question/import-questions",
        formData,
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        setStatus("Successfully imported questions.");
        setSelectedFile(null);
        setImportQuestion(!importQuestion);
        handleSuccessToast("Successfully imported questions.");
        setTimeout(() => {
          setStatus("");
        }, 1500);
      }
    } catch (err) {
      console.error("Upload failed", err);
      setStatus("Import failed. " + (err.response?.data || ""));
    } finally {
      setIsUploading(false);
    }
  };

  // Drag and drop logic
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setStatus("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    multiple: false,
  });

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 cursor-pointer"
        >
          <Archive className="h-4 w-4" />
          {t("questions.import")}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle className="dark:text-slate-100 text-xl">
            Import Questions
          </DialogTitle>
          <DialogDescription className="dark:text-slate-300 text-slate-800">
            Use this function to upload multiple questions via an Excel (.xlsx)
            file.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm text-muted-foreground">
          <ul className="list-disc pl-4 dark:text-slate-300 text-slate-800">
            <li>Download the template file and fill it correctly.</li>
            <li>
              <strong>Do not modify column headers</strong>.
            </li>
            <li>Each row = 1 question + 4 options max.</li>
            <li>Only one correct answer (A–D) allowed.</li>
            <li>Chapter/Topic are dropdowns — don’t type manually.</li>
          </ul>

          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-slate-100">
              Upload filled template
            </label>

            <div
              {...getRootProps()}
              className="border border-dashed border-muted-foreground rounded-md p-4 cursor-pointer dark:bg-slate-800 hover:bg-muted/30 transition-colors text-center"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-blue-500">Drop the file here...</p>
              ) : (
                <p className="text-sm dark:text-slate-300 text-slate-700">
                  Drag & drop or click to upload your <code>.xlsx</code> file
                </p>
              )}
            </div>

            {selectedFile && (
              <p className="text-xs text-green-600">
                Selected: {selectedFile.name}
              </p>
            )}

            {status && (
              <p className="text-sm dark:text-slate-200 text-slate-800">
                {status}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-between mt-4">
          <Button
            onClick={handleDownloadTemplate}
            disabled={downloading}
            className={"cursor-pointer"}
          >
            {downloading ? "Downloading..." : "Download Template"}
          </Button>
          <Button
            onClick={handleUpload}
            disabled={isUploading || !selectedFile}
            className="bg-purple-600 text-white hover:bg-purple-700 cursor-pointer"
          >
            {isUploading ? (
              "Uploading..."
            ) : (
              <span className="flex items-center gap-2">
                <UploadCloud className="h-4 w-4" /> Upload
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
