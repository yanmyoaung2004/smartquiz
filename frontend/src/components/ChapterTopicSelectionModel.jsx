"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tag } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { handleFailureToast } from "./ToastService";

export default function ChapterTopicSelectionModel({
  onChangeTopic,
  onChangeYear,
  onChangeChapter,
  topicName,
  year,
}) {
  const [chapters, setChapters] = useState([]);
  const [allTopics, setAllTopics] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [availableTopics, setAvailableTopics] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  const getTopicDetailsByName = useCallback(
    (topics, chaps) => {
      if (!topicName || typeof topicName === "number") return;
      const topicData = topics.find(
        (t) => t.name.toLowerCase() === topicName.toLowerCase()
      );
      if (!topicData) return null;
      const chapter = chaps.find((c) => c.id === topicData.chapterId);
      if (!chapter) return null;
      return {
        topicId: topicData.id,
        chapterId: chapter.id,
      };
    },
    [topicName]
  );

  useEffect(() => {
    setSelectedYear(year);
  }, [year]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "/api/question-type/formatted-question-data",
          {
            headers: {
              Authorization: `Bearer ${currentUser?.token}`,
            },
          }
        );

        if (res.status === 200) {
          const { allTopics: topicsData, chapters: chaptersData } = res.data;

          setAllTopics((prev) =>
            JSON.stringify(prev) !== JSON.stringify(topicsData)
              ? topicsData
              : prev
          );
          setChapters((prev) =>
            JSON.stringify(prev) !== JSON.stringify(chaptersData)
              ? chaptersData
              : prev
          );

          const data = getTopicDetailsByName(topicsData, chaptersData);
          if (data) {
            const { topicId, chapterId } = data;
            onChangeChapter(chapterId);
            onChangeTopic(topicId);
            setSelectedChapter(chapterId);
            setSelectedTopic(topicId);
          }
        }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong";
        handleFailureToast(errorMessage);
        console.log(error);
      }
    };

    if (currentUser?.token) {
      fetchData();
    }
  }, [
    currentUser?.token,
    getTopicDetailsByName,
    onChangeChapter,
    onChangeTopic,
  ]);

  useEffect(() => {
    if (!selectedChapter || !chapters.length || !allTopics.length) return;
    const relevantTopics = allTopics.filter(
      (topic) => topic.chapterId === selectedChapter
    );
    setAvailableTopics((prev) =>
      JSON.stringify(prev) !== JSON.stringify(relevantTopics)
        ? relevantTopics
        : prev
    );
  }, [allTopics, chapters, selectedChapter]);

  const handleSubmit = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-1 dark:bg-white dark:hover:bg-gray-300 cursor-pointer"
        >
          <Tag className="h-4 w-4 dark:text-gray-900" />
          <span className="text-gray-900">Tag chapters & topics</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] dark:bg-slate-800">
        <DialogHeader>
          <DialogTitle>Select Options</DialogTitle>
          <DialogDescription>
            Select a chapter, topic, and enter year in sequence.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Chapter */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="chapter" className="text-right">
              Chapter
            </Label>
            <Select
              value={selectedChapter}
              onValueChange={(value) => {
                setSelectedChapter(value);
                onChangeChapter(value);
              }}
            >
              <SelectTrigger id="chapter" className="col-span-3">
                <SelectValue placeholder="Select chapter" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Chapters</SelectLabel>
                  {chapters.map((chapter) => (
                    <SelectItem key={chapter.id} value={chapter.id}>
                      {chapter.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Topic */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="topic" className="text-right">
              Topic
            </Label>
            <Select
              value={selectedTopic}
              onValueChange={(value) => {
                setSelectedTopic(value);
                onChangeTopic(value);
              }}
              disabled={!selectedChapter}
            >
              <SelectTrigger id="topic" className="col-span-3">
                <SelectValue placeholder="Select topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Topics</SelectLabel>
                  {availableTopics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id}>
                      {topic.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Year */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="year" className="text-right">
              Year
            </Label>
            <Input
              id="year"
              type="text"
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                onChangeYear(e.target.value);
              }}
              placeholder="Enter year"
              className="col-span-3"
              disabled={!selectedTopic}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            className="bg-purple-600 hover:bg-purple-800 text-white"
            type="submit"
            onClick={handleSubmit}
            disabled={!selectedChapter || !selectedTopic || !selectedYear}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
