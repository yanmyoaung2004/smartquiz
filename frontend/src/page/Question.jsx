import CreatedQuestionsList from "@/components/CreatedQuestionsList";
import { Layout } from "@/components/layout/Layout";
import React from "react";

const Home = () => {
  return (
    <Layout>
      <main className="flex-1 overflow-y-auto">
        <CreatedQuestionsList />
      </main>
    </Layout>
  );
};

export default Home;
