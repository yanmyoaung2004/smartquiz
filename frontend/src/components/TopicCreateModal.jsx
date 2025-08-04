import React, { useEffect, useState } from "react";
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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useSelector } from "react-redux";

const TopicCreateModal = ({ onCreate }) => {
  const [open, setOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const [chapters, setChapters] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    chapterId: "", // NEW: selected chapter
  });
  const [error, setError] = useState("");

  // Fetch chapters on mount
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await axios.get("/api/chapter/all", {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        });
        if (res.status === 200) {
          setChapters(res.data);
        }
      } catch (error) {
        console.log("Error fetching chapters:", error);
      }
    };

    fetchChapters();
  }, [currentUser?.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.chapterId
    ) {
      setError("Please fill all the fields!");
      return;
    }

    try {
      const res = await axios.post("/api/topic/create", formData, {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
        },
      });

      if (res.status === 201) {
        onCreate(res.data);
        setFormData({
          name: "",
          description: "",
          chapterId: "",
        });
        setError("");
        setOpen(false);
      }
    } catch (error) {
      console.error("Error creating topic:", error);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-800 text-white cursor-pointer">
          Create Topic
        </Button>
      </DialogTrigger>

      <DialogContent className="dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle>Create New Topic</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>
            <Input
              name="name"
              placeholder="e.g. Multiple Choice"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Chapter</label>
            <Select
              value={formData.chapterId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, chapterId: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a chapter" />
              </SelectTrigger>
              <SelectContent>
                {chapters.map((chapter) => (
                  <SelectItem key={chapter.id} value={chapter.id}>
                    {chapter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

          {error && <p className="text-sm text-red-500">{error}</p>}

          <DialogFooter>
            <Button
              type="submit"
              className="bg-purple-600 text-white hover:bg-purple-800 cursor-pointer"
            >
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TopicCreateModal;
