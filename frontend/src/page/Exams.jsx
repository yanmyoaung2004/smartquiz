import { Layout } from "@/components/layout/Layout";
import React from "react";
import ExamListPage from "./ExamListPage";
import { useSelector } from "react-redux";
import ExamListForUser from "./ExamListForUser";

const Exams = () => {
  const { currentUser } = useSelector((state) => state.user);
  const isAdmin = currentUser?.role.some((r) => r.name === "ROLE_ADMIN");
  const isTeacher = currentUser?.role.some((r) => r.name === "ROLE_TEACHER");

  if (!(isAdmin || isTeacher)) {
    return <ExamListForUser />;
  } else {
    return (
      <Layout>
        <main className="flex-1 overflow-y-auto">
          <ExamListPage />
        </main>
      </Layout>
    );
  }
};

export default Exams;
