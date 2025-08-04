"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { BookOpen } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserSubjectProfileSetup() {
  const { currentUser } = useSelector((state) => state.user);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get("/api/question-type/all", {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        });

        if (res.data === "") navigate("/login");
        if (res.status === 200) setSubjects(res.data.questionTypes);
      } catch (error) {
        navigate("/login");
        console.error(error);
      }
    };
    const fetchUserSelectedSubjects = async () => {
      try {
        const res = await axios.get(
          `/api/question-type/get-profile-setup-info?email=${currentUser?.email}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser?.token}`,
            },
          }
        );
        if (res.data === "") navigate("/login");
        if (res.status === 200) setSelectedSubjects(res.data);
      } catch (error) {
        navigate("/login");
        console.error(error);
      }
    };
    fetchSubjects();
    fetchUserSelectedSubjects();
  }, [currentUser?.email, currentUser?.token, navigate]);

  const toggleSubject = (subjectId) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleContinue = async () => {
    if (selectedSubjects.length === 0) {
      alert("Please select at least one subject");
      return;
    }
    try {
      const res = await axios.post(
        `/api/question-type/setup-subject-profile`,
        {
          subjectIds: selectedSubjects,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        }
      );
      console.log(res);
      if (res.status === 200) {
        navigate("/home");
      }
    } catch (error) {
      navigate("/login");
      console.log(error);
    }
  };

  return (
    <div className="dark:bg-slate-900">
      <div className="container mx-auto px-4 py-12 h-screen ">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">Choose Your Subjects</h1>
          <p className="text-gray-600 max-w-2xl mx-auto dark:text-slate-300">
            Select the subjects you're interested in. This helps us personalize
            your learning experience.
          </p>
        </div>

        {subjects && subjects.length <= 2 && (
          <div className="text-center text-sm text-gray-400 mb-4">
            Showing limited subjects — more will appear as they're added.
          </div>
        )}

        <div
          className="grid gap-6 justify-center"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          }}
        >
          {subjects.length > 0 &&
            subjects.map((subject) => (
              <Card
                key={subject.id}
                className={`dark:bg-slate-800 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedSubjects.includes(subject.id)
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-purple-300"
                }`}
                onClick={() => toggleSubject(subject.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      <Checkbox
                        checked={selectedSubjects.includes(subject.id)}
                        onCheckedChange={() => toggleSubject(subject.id)}
                        className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="mb-4">
                        <BookOpen className="h-8 w-8 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-lg mb-1 dark:text-slate-300">
                        {subject.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-slate-300">
                        {subject.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            onClick={handleContinue}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 rounded-xl text-lg cursor-pointer"
            disabled={selectedSubjects.length === 0}
          >
            Continue
          </Button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          {selectedSubjects.length === 0
            ? "Please select at least one subject to continue"
            : `${selectedSubjects.length} subject${
                selectedSubjects.length > 1 ? "s" : ""
              } selected`}
        </div>
      </div>
    </div>
  );
}
