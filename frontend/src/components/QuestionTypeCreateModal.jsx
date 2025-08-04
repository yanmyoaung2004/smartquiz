import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogDescription } from "@radix-ui/react-dialog";
import axios from "axios";
import { useSelector } from "react-redux";

const QuestionTypeCreateModal = ({ onCreate }) => {
  const [open, setOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.description.trim()) {
      setError("Please Fill all the fields!");
      return;
    }
    try {
      const res = await axios.post("api/question-type/create", formData, {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
        },
      });
      if (res.status === 201) {
        onCreate(res.data);
        setFormData({ name: "", description: "" });
        setError("");
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={
            "bg-purple-600 hover:bg-purple-800 text-white cursor-pointer"
          }
        >
          Create Question Type
        </Button>
      </DialogTrigger>

      <DialogContent className="dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle>Create New Question Type</DialogTitle>
        </DialogHeader>
        <DialogDescription />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>
            <Input
              name="name"
              placeholder="e.g. Multiple Choice"
              value={formData.name}
              onChange={handleChange}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Description
            </label>
            <Textarea
              name="description"
              placeholder="Description..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className={
                "bg-purple-600 text-white hover:bg-purple-800 cursor-pointer"
              }
            >
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionTypeCreateModal;
