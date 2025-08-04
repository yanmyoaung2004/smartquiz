import React from "react";

import webImg from "../../assets/web.png";
import appImg from "../../assets/webPhoto.png";
import quizImg from "../../assets/Online Quiz.png";
import digitalImg from "../../assets/numbers.jpg";
import CoursesCard from "./CoursesCard";
import Heading from "./heading";

const Courses = () => {
  return (
    <div className="min-h-screen flex flex-col items-center md:px-32 px-5 my-5">
      <Heading title1="Our" title2="Courses" />

      <div className="flex flex-wrap justify-center gap-6 mt-6">
        <CoursesCard img={webImg} title="Web Development" />
        <CoursesCard img={appImg} title="App Development" />
        <CoursesCard img={quizImg} title="IP" />
        <CoursesCard img={digitalImg} title="Mathematics" />
      </div>
    </div>
  );
};

export default Courses;
