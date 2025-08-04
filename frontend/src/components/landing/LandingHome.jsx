import React from "react";
import { Link } from "react-router-dom";
import img from "../../assets/quiz.png";

const LandingHome = () => {
  return (
    <div className=" min-h-[70wh] flex flex-col md:flex-row md:justify-between items-center md:mx-32 mx-6 mt-10 dark:bg-slate-900 bg-white ">
      <div className=" md:w-2/4 text-center">
        <h2
          style={{ fontFamily: "Rubik, sans-serif" }}
          className="text-5xl font-semibold text-gray-900 leading-tight mt-3.5 dark:text-slate-100"
        >
          Practice With
        </h2>
        <span
          style={{ fontFamily: "Rubik, sans-serif" }}
          className="text-5xl font-semibold text-purple-900 dark:text-slate-100"
        >
          SmartQuiz
        </span>

        <p className="text-lightText mt-10 mb-12 text-start text-2xl">
          "Know who’s struggling before the test. Turn quizzes into complete
          learning experiences with resources that support every learner."
        </p>
        <hr className="my-7 mx-auto w-full" />
        <p className="mt-4 text-lg max-w-2xl mx-auto text-purple-800 dark:text-slate-100">
          "Fun, Fast, and Smart – Quizzes That Keep You Learning."
        </p>
        <div className="mt-7 flex justify-center space-x-4">
          <Link to="register" spy={"true"} smooth={"true"} duration={500}>
            <button className=" bg-purple-500 text-slate-100 px-6 py-3 rounded shadow-md text-lg cursor-pointer">
              Sign up for free
            </button>
          </Link>
          <Link to="learn_more" spy={"true"} smooth={"true"} duration={500}>
            <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded shadow-md text-lg">
              Learn More
            </button>
          </Link>
        </div>
      </div>

      <div className="w-full md:w-2/4">
        <img src={img} alt="img" />
      </div>
    </div>
  );
};

export default LandingHome;
