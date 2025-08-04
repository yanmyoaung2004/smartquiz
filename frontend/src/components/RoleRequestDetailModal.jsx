"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useSelector } from "react-redux";

export default function RoleRequestDetailModal({
  request,
  open,
  onClose,
  onStatusChange,
}) {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const handleAction = async (action) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/user/role-requests?roleRequestId=${request.id}&status=${action}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        }
      );
      if (res.status === 200) {
        onStatusChange(request.id, action.toUpperCase());
        onClose();
      }
    } catch (err) {
      console.error("Action failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = () => {
    const byteCharacters = atob(request.fileData);
    const byteNumbers = new Array(byteCharacters.length)
      .fill()
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray]);
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = request.fileName || "application_file";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-xl dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Teacher Role Request
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] space-y-4 mt-2">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{request?.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{request?.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Reason</p>
            <p className="whitespace-pre-wrap text-sm mt-1">
              {request?.reason}
            </p>
          </div>

          {request?.fileData && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={downloadFile}>
                <Download className="w-4 h-4 mr-1" /> Download File
              </Button>
              <span className="text-xs text-muted-foreground">
                {request.fileName}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <Badge
              className={`px-3 py-1 rounded-full text-xs ${
                request?.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : request?.status === "APPROVED"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {request?.status}
            </Badge>

            {request?.status === "PENDING" && (
              <div className="flex gap-2">
                <Button
                  variant="success"
                  size="sm"
                  disabled={loading}
                  onClick={() => handleAction("APPROVED")}
                >
                  <CheckCircle className="w-4 h-4 mr-1" /> Approve
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={loading}
                  onClick={() => handleAction("REJECTED")}
                >
                  <XCircle className="w-4 h-4 mr-1" /> Reject
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
