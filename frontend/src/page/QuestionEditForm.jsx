"use client";

import { useState, useRef, useEffect } from "react";
import {
  ImageIcon,
  ChevronLeft,
  Check,
  Plus,
  Trash2,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { uploadPicture } from "@/service/ImageService";
import axios from "axios";
import ChapterTopicSelectionModel from "@/components/ChapterTopicSelectionModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link, Navigate, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import ImageUploadProgress from "@/components/ImageUploadProgress";
import { useDispatch, useSelector } from "react-redux";
import { removeQuestionForEdit } from "@/store/question/questionSlice";

export default function QuestionEditForm() {
  const { question: questionData } = useSelector((state) => state.question);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [questionId, setQuestionId] = useState(null);
  const [questionImage, setQuestionImage] = useState("");
  const [question, setQuestion] = useState("");
  const [topic, setTopic] = useState("");
  const [type, setType] = useState("");
  const [chapter, setChapter] = useState("");
  const [year, setYear] = useState("");
  const [topicName, setTopicName] = useState("");
  const [options, setOptions] = useState([
    { id: 1, text: "", isCorrect: false, color: "bg-blue-500", image: "" },
    { id: 2, text: "", isCorrect: false, color: "bg-purple-500", image: "" },
    { id: 3, text: "", isCorrect: false, color: "bg-purple-500", image: "" },
    { id: 4, text: "", isCorrect: false, color: "bg-blue-500", image: "" },
  ]);
  const questionImageInputRef = useRef(null);
  const optionImageInputRefs = useRef([]);
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const [explanation, setExplanation] = useState("");
  const questionEditorRef = useRef(null);
  const optionEditorRefs = useRef([]);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (questionData) {
      setQuestionId(questionData.id || null);
      setQuestion(questionData.questionText || "");
      setTopicName(questionData.topic || "");
      setYear(questionData.year || "");
      setExplanation(questionData.explanation || "");
      setQuestionImage(questionData.imageUrl || "");
      const updatedOptions = questionData.options.map((option, index) => ({
        id: option.id,
        text: option.text || "",
        isCorrect: option.isCorrect || false,
        color: index % 2 === 0 ? "bg-blue-500" : "bg-purple-500",
        image: option.imageUrl || "",
      }));

      setOptions(updatedOptions);
    }
  }, [questionData]);

  const addOption = () => {
    const colors = ["bg-purple-500", "bg-indigo-500"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newOption = {
      id: options.length + 1,
      text: "",
      isCorrect: false,
      color: randomColor,
      image: null,
    };
    setOptions([...options, newOption]);
  };

  const deleteOption = (id) => {
    if (options.length > 2) {
      setOptions(options.filter((option) => option.id !== id));
    }
  };

  const toggleCorrect = (id) => {
    setOptions(
      options.map((option) => {
        if (option.id === id) {
          return { ...option, isCorrect: !option.isCorrect };
        }
        return { ...option, isCorrect: false };
      })
    );
  };

  const updateOptionText = (id, text) => {
    setOptions(
      options.map((option) => {
        if (option.id === id) {
          return { ...option, text };
        }
        return option;
      })
    );
  };

  const handleQuestionImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);
      const res = await uploadPicture(file, (progress) => {
        setUploadProgress(progress);
      });
      setIsUploading(false);

      if (res.status) {
        setQuestionImage(res.imgData);
      } else {
        console.log(res.msg);
      }
    }
  };

  const handleOptionImageUpload = async (id, e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);
      const res = await uploadPicture(file, (progress) => {
        setUploadProgress(progress);
      });
      setIsUploading(false);
      if (res.status) {
        const imageUrl = res.imgData;
        setOptions(
          options.map((option) => {
            if (option.id === id) {
              return { ...option, image: imageUrl };
            }
            return option;
          })
        );
      } else {
        console.log(res.msg);
      }
    }
  };

  const updateQuestion = async () => {
    if (question === "" || type === "" || chapter === "" || topic === "") {
      console.log("Please fill all fields!");
      return;
    }
    const hasEmptyOption = options.some((o) => o.text === "");
    if (hasEmptyOption) {
      console.log("Please fill all options!");
      return;
    }
    const questionObj = {
      id: questionId,
      questionText: question,
      year: year,
      imageUrl: questionImage,
      explanation: explanation,
      options: options.map((o) => ({
        optionText: o.text,
        imageUrl: o.image,
        isCorrect: o.isCorrect,
      })),
    };
    const correctIndex = options.findIndex((option) => option.isCorrect);
    if (correctIndex === -1) {
      console.log("Please select correct answer!");
      return;
    }

    try {
      const res = await axios.post(
        "/api/question/update",
        {
          question: questionObj,
          correctOptionIndex: correctIndex,
          topicId: topic,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        }
      );

      if (res.status === 201) {
        dispatch(removeQuestionForEdit());
        navigate("/questions");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveImage = () => {
    setQuestionImage("");
    if (questionImageInputRef.current) {
      questionImageInputRef.current.value = "";
    }
  };

  const handleOptionImageRemove = (optionId) => {
    const index = options.findIndex((opt) => opt.id === optionId);
    if (optionImageInputRefs.current[index]) {
      optionImageInputRefs.current[index].value = null;
    }
    setOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === optionId ? { ...option, image: "" } : option
      )
    );
  };

  const updateExplanation = (text) => {
    setExplanation(text);
  };

  const toggleExplanationModal = () => {
    setShowExplanationModal(!showExplanationModal);
  };

  if (!questionData) {
    return <Navigate to="/questions" />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {isUploading && <ImageUploadProgress uploadProgress={uploadProgress} />}
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to={"/questions"}>
            <Button variant="ghost" size="icon" className={"cursor-pointer"}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>

          <span className="font-medium">Update Question</span>
        </div>

        <div className="flex items-center gap-3">
          <ChapterTopicSelectionModel
            onChangeChapter={setChapter}
            onChangeTopic={setTopic}
            onChangeYear={setYear}
            onChangeType={setType}
            topicName={topicName}
            year={year}
          />
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
            onClick={updateQuestion}
          >
            Save question
          </Button>
        </div>
      </div>

      <div className="px-20 pt-2 pb-2 border-b">
        <div className="flex items-center gap-4">
          <div id="toolbar" className="flex gap-2 dark:bg-gray-200">
            <button className="ql-bold bg-red-500" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-strike" />
            <select className="ql-list">
              <option value="ordered"></option>
              <option value="bullet"></option>
            </select>
            <button className="ql-clean" />
          </div>
          <div className="ml-auto">
            <Dialog
              open={showExplanationModal}
              onOpenChange={setShowExplanationModal}
            >
              <DialogTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  <span className="i-lucide-lightbulb h-4 w-4" />
                  <span>Add answer explanation</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Add Explanation</DialogTitle>
                  <DialogDescription>
                    Provide an explanation for the question.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Textarea
                    value={explanation}
                    onChange={(e) => updateExplanation(e.target.value)}
                    placeholder="Add explanation for the question"
                    className="min-h-40 w-full bg-transparent border-none text-black text-lg resize-none focus:ring-0 placeholder:text-gray-400 placeholder:text-center"
                  />
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={toggleExplanationModal}>
                    Cancel
                  </Button>
                  <Button variant="ghost" onClick={toggleExplanationModal}>
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-purple-950 rounded-lg p-8 mb-6">
          <div className="flex gap-2 mb-4">
            {questionImage ? (
              <Button
                variant="ghost"
                size="icon"
                className="bg-red-600/50 text-white hover:bg-red-500/70 cursor-pointer"
                onClick={handleRemoveImage}
              >
                <XIcon className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="bg-purple-900/50 text-white hover:bg-purple-900/70 cursor-pointer"
                onClick={() => questionImageInputRef.current?.click()}
              >
                <ImageIcon className="h-5 w-5" />
              </Button>
            )}

            <input
              type="file"
              ref={questionImageInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleQuestionImageUpload}
            />
          </div>
          {questionImage && (
            <div className="mb-4">
              <img
                src={questionImage || "/placeholder.svg"}
                alt="Question"
                className="max-h-60 rounded-md mx-auto"
              />
            </div>
          )}

          <div className="bg-transparent">
            <ReactQuill
              ref={questionEditorRef}
              value={question}
              onChange={setQuestion}
              modules={{ toolbar: "#toolbar" }}
              theme="snow"
              className="custom-quill"
              placeholder="Type question here"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {options.map((option, index) => (
            <div
              key={option.id}
              className={`${option.color} rounded-lg p-6 pb-10 relative min-h-[180px] flex flex-col`}
            >
              <div className="flex gap-2 mb-4">
                {option.image ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-red-600/70 text-white hover:bg-red-500/80 cursor-pointer"
                    onClick={() => handleOptionImageRemove(index + 1)}
                  >
                    <XIcon className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`${option.color} brightness-90 text-white hover:brightness-75 cursor-pointer`}
                    onClick={() => optionImageInputRefs.current[index]?.click()}
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                )}

                <input
                  type="file"
                  ref={(el) => (optionImageInputRefs.current[index] = el)}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleOptionImageUpload(option.id, e)}
                />
              </div>

              {option.image && (
                <div className="mb-4">
                  <img
                    src={option.image || "/placeholder.svg"}
                    alt={`Option ${option.id}`}
                    className="max-h-40 rounded-md mx-auto"
                  />
                </div>
              )}

              <div className="bg-transparent flex-1">
                <ReactQuill
                  ref={(el) => (optionEditorRefs.current[index] = el)}
                  value={option.text}
                  onChange={(content) => updateOptionText(option.id, content)}
                  modules={{ toolbar: "#toolbar" }}
                  theme="snow"
                  className="custom-quill custom-quill-option"
                  placeholder="Type question here"
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-2 left-2 text-white/70 hover:text-white hover:bg-transparent"
                onClick={() => deleteOption(option.id)}
              >
                <Trash2 className="h-5 w-5" />
              </Button>

              {/* Correct answer checkbox */}
              <div
                className="absolute top-2 right-2 cursor-pointer"
                onClick={() => toggleCorrect(option.id)}
              >
                <div
                  className={`h-6 w-6 rounded-full flex items-center justify-center ${
                    option.isCorrect ? "bg-white" : "bg-white/30"
                  }`}
                >
                  {option.isCorrect && (
                    <Check
                      className={`h-4 w-4 text-${
                        option.color.split("-")[1]
                      }-500`}
                    />
                  )}
                </div>
              </div>

              {/* Add option button on the last item */}
              {index === options.length - 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-2 right-2 text-white/70 hover:text-white hover:bg-transparent"
                  onClick={addOption}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
