import React from "react";
import { Link } from "react-router-dom";

const LandingFooter = () => {
  return (
    <div>
      <div className=" dark:bg-slate-900 flex flex-col md:flex-row justify-between p-5 bg-white border-2 border-lightText rounded-lg md:px-32 px-5">
        <div className="flex flex-col md:flex-row gap-5 font-medium p-1 text-lg">
          <Link
            to="home"
            spy={"true"}
            smooth={"true"}
            duration={500}
            className="hover:text-brightPurple transition-all cursor-pointer"
          >
            Home
          </Link>
          <Link
            to="about"
            spy={"true"}
            smooth={"true"}
            duration={500}
            className="hover:text-brightPurple transition-all cursor-pointer"
          >
            About
          </Link>
          <Link
            to="courses"
            spy={"true"}
            smooth={"true"}
            duration={500}
            className="hover:ext-brightPurple transition-all cursor-pointer"
          >
            Courses
          </Link>
          <Link
            to="reviews"
            spy={"true"}
            smooth={"true"}
            duration={500}
            className="hover:text-brightPurple transition-all cursor-pointer"
          >
            Reviews
          </Link>
          <Link
            to="contact"
            spy={"true"}
            smooth={"true"}
            duration={500}
            className="hover:text-brightPurple transition-all cursor-pointer"
          >
            Contact
          </Link>
        </div>
        <div>
          <Link to="/" className="font-semibold text-2xl p-1 cursor-pointer">
            Smart Quiz
          </Link>
        </div>
      </div>
      <div className="text-center mt-4">
        <p>
          @copyright developed by
          <span className="text-purple-500 px-2">smartquiz programmers</span>
          All rights reserved
        </p>
      </div>
    </div>
  );
};

export default LandingFooter;
