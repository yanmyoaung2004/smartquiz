import { Layout } from "@/components/layout/Layout";
import React from "react";
import { Dashboard } from "./Dashboard";

const Home = () => {
  return (
    <Layout>
      <main className="flex-1 overflow-y-auto  ">
        <Dashboard />
      </main>
    </Layout>
  );
};

export default Home;
