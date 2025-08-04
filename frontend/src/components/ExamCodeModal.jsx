import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ExamCodeModal() {
  const [showExamModal, setShowExamModal] = useState(false);
  const [examCode, setExamCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!examCode.trim()) return;
    setIsLoading(true);
    try {
      const res = await axios.get(
        `api/exam/check-examcode?examCode=${examCode}`
      );
      if (res.status === 200) {
        navigate(`/exams/${examCode}`);
      }
    } catch (error) {
      console.error("Error submitting exam code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={showExamModal} onOpenChange={setShowExamModal}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={
            "bg-purple-600 text-white hover:bg-purple-800 hover:text-white cursor-pointer"
          }
        >
          Enter Exam Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter Exam Code</DialogTitle>
          <DialogDescription>
            Please enter the exam code provided to you.
          </DialogDescription>
        </DialogHeader>
        <Input
          value={examCode}
          onChange={(e) => setExamCode(e.target.value)}
          placeholder="e.g. ABC123"
          className="mt-4"
        />
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setShowExamModal(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className={"bg-purple-600 hover:bg-purple-800 cursor-pointer"}
            onClick={handleSubmit}
            disabled={isLoading || !examCode}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
