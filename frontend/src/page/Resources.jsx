"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, Edit, Delete } from "lucide-react";
import Layout from "@/components/layout/Layout";
import axios from "axios";
import { useSelector } from "react-redux";
import CustomPagination from "@/components/CustomPagination";
import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
} from "@radix-ui/react-dropdown-menu";
import QuestionTypeCreateModal from "@/components/QuestionTypeCreateModal";
import { handleSuccessToast } from "@/components/ToastService";
import QuestionTypeUpdateModal from "@/components/QuestionTypeUpdateModel";
import ChapterCreateModal from "@/components/ChapterCreateModal";
import ChapterUpdateModal from "@/components/ChapterUpdateModel";
import TopicCreateModal from "@/components/TopicCreateModal";
import TopicUpdateModal from "@/components/TopicUpdateModal";

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const [pageQuestionType, setPageQuestionType] = useState(0);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [pageChapters, setPageChapters] = useState(0);
  const [topics, setTopics] = useState([]);
  const [pageTopics, setPageTopics] = useState(0);

  const pageSize = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get(`api/question-type/all`, {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
        },
      });

      if (res.status === 200) {
        setQuestionTypes(res.data.questionTypes);
        setChapters(res.data.chapters);
        setTopics(res.data.topics);
      }
    };
    fetchUsers();
  }, [currentUser?.token]);

  // questionTypes
  const filteredQuestionTypes = questionTypes.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedQuestionType = filteredQuestionTypes.slice(
    pageQuestionType * pageSize,
    (pageQuestionType + 1) * pageSize
  );
  const totalPagesQuestionTypes = Math.ceil(questionTypes.length / pageSize);

  // chapters

  const filteredChapters = chapters.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedChapters = filteredChapters.slice(
    pageChapters * pageSize,
    (pageChapters + 1) * pageSize
  );
  const totalPagesChapters = Math.ceil(chapters.length / pageSize);

  // topics
  const filteredTopics = topics.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedTopics = filteredTopics.slice(
    pageTopics * pageSize,
    (pageTopics + 1) * pageSize
  );
  const totalPagesTopics = Math.ceil(topics.length / pageSize);

  const questionTypeOnCreate = (newData) => {
    setQuestionTypes((prev) => [...prev, newData]);
  };

  const chapterOnCreate = (newData) => {
    setChapters((prev) => [...prev, newData]);
  };

  const topicOnCreate = (newData) => {
    setTopics((prev) => [...prev, newData]);
  };

  const questionTypeOnUpdate = (newData) => {
    setQuestionTypes((prev) =>
      prev.map((qt) => (qt.id === newData.id ? newData : qt))
    );
  };
  const chapterOnUpdate = (newData) => {
    setChapters((prev) =>
      prev.map((qt) => (qt.id === newData.id ? newData : qt))
    );
  };

  const topicOnUpdate = (newData) => {
    setTopics((prev) =>
      prev.map((qt) => (qt.id === newData.id ? newData : qt))
    );
  };

  const deleteQuestionType = async (id) => {
    try {
      const res = await axios.delete(
        `/api/question-type/delete?questionTypeId=${id}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        }
      );
      if (res.status === 201) {
        setQuestionTypes(questionTypes.filter((qt) => qt.id !== id));
        handleSuccessToast("Successfully deleted!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteChapter = async (id) => {
    try {
      const res = await axios.delete(`/api/chapter/delete?chapterId=${id}`, {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
        },
      });
      if (res.status === 201) {
        setChapters(chapters.filter((qt) => qt.id !== id));
        handleSuccessToast("Successfully deleted!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTopic = async (id) => {
    try {
      const res = await axios.delete(`/api/topic/delete?topicId=${id}`, {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
        },
      });
      if (res.status === 201) {
        setTopics(topics.filter((qt) => qt.id !== id));
        handleSuccessToast("Successfully deleted!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex items-center mb-8 justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Resource Management
            </h1>
            <p className="text-muted-foreground">
              Manage learning materials, documents, and educational content.
            </p>
          </div>
        </div>

        <Tabs defaultValue="question-type" className="space-y-6">
          <TabsList>
            <TabsTrigger value="question-type">Question Type</TabsTrigger>
            <TabsTrigger value="chapters">Chapter</TabsTrigger>
            <TabsTrigger value="topics">Topic</TabsTrigger>
          </TabsList>

          <TabsContent value="question-type" className="space-y-4">
            <Card className={"dark:bg-slate-800"}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Question Type Management</CardTitle>
                    <CardDescription>
                      View and manage all question type in the system
                    </CardDescription>
                  </div>
                  <QuestionTypeCreateModal onCreate={questionTypeOnCreate} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search question type..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No.</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedQuestionType.map((user, i) => (
                        <TableRow key={user.id}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.description}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0  cursor-pointer"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                                <DropdownMenuSub>
                                  <QuestionTypeUpdateModal
                                    data={user}
                                    onUpdate={questionTypeOnUpdate}
                                  />
                                  <DropdownMenuSubTrigger
                                    className="flex items-center text-sm p-2 text-red-600 cursor-pointer"
                                    onClick={() => deleteQuestionType(user.id)}
                                  >
                                    <Delete className="mr-4 h-4 w-4" />
                                    Delete
                                  </DropdownMenuSubTrigger>
                                </DropdownMenuSub>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex justify-end items-center gap-2">
                    <CustomPagination
                      pageNumber={pageQuestionType}
                      totalPages={totalPagesQuestionTypes}
                      onPageChange={setPageQuestionType}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="chapters" className="space-y-4">
            <Card className={"dark:bg-slate-800"}>
              <div className="flex justify-between items-center px-6">
                <div>
                  <CardTitle>Chapter Management</CardTitle>
                  <CardDescription>
                    View and manage all chapters in the system
                  </CardDescription>
                </div>
                <ChapterCreateModal onCreate={chapterOnCreate} />
              </div>

              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search chapter..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No.</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedChapters.map((user, i) => (
                        <TableRow key={user.id}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                asChild
                                className="cursor-pointer"
                              >
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                                <DropdownMenuSub>
                                  <ChapterUpdateModal
                                    data={user}
                                    onUpdate={chapterOnUpdate}
                                  />
                                  <DropdownMenuSubTrigger
                                    className="flex items-center text-sm p-2 text-red-600 cursor-pointer"
                                    onClick={() => deleteChapter(user.id)}
                                  >
                                    <Delete className="mr-4 h-4 w-4" />
                                    Delete
                                  </DropdownMenuSubTrigger>
                                </DropdownMenuSub>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex justify-end items-center gap-2">
                    <CustomPagination
                      pageNumber={pageChapters}
                      totalPages={totalPagesChapters}
                      onPageChange={setPageChapters}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="topics" className="space-y-4">
            <Card className={"dark:bg-slate-800"}>
              <div className="flex justify-between items-center px-6">
                <div>
                  <CardTitle>Topic Management</CardTitle>
                  <CardDescription>
                    View and manage all topics in the system
                  </CardDescription>
                </div>
                <TopicCreateModal onCreate={topicOnCreate} />
              </div>

              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search topic..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No.</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedTopics.map((user, i) => (
                        <TableRow key={user.id}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.description}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                                <DropdownMenuSub>
                                  <TopicUpdateModal
                                    data={user}
                                    onUpdate={topicOnUpdate}
                                  />
                                  <DropdownMenuSubTrigger
                                    className="flex items-center text-sm p-2 text-red-600 cursor-pointer"
                                    onClick={() => deleteTopic(user.id)}
                                  >
                                    <Delete className="mr-4 h-4 w-4" />
                                    Delete
                                  </DropdownMenuSubTrigger>
                                </DropdownMenuSub>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex justify-end items-center gap-2">
                    <CustomPagination
                      pageNumber={pageTopics}
                      totalPages={totalPagesTopics}
                      onPageChange={setPageTopics}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
