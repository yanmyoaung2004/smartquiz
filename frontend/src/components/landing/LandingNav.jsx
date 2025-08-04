import { Menu } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ModeToggle } from "../ModeToggle";

const LandingNav = () => {
  const [menu, setMenu] = useState(false);

  const handleChange = () => {
    setMenu(!menu);
  };

  return (
    <div>
      <div className="flex flex-row justify-between p-5 md:px-32 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:bg-slate-900">
        <div>
          <Link
            to="/"
            className="font-semibold text-3xl p-1 cursor-pointer text-purple-900 dark:text-slate-100 "
          >
            Smart Quiz
          </Link>
        </div>
        <nav className="hidden md:flex  items-center gap-5 font-medium p-1 cursor-pointer">
          <Link
            to="home"
            spy={"true"}
            smooth={"true"}
            duration={500}
            className="hover:text-purple-500 transition-all cursor-pointer"
          >
            Home
          </Link>
          <Link
            to="about"
            spy={"true"}
            smooth={"true"}
            duration={500}
            className="hover:text-purple-500 transition-all cursor-pointer"
          >
            About
          </Link>
          <Link
            to="courses"
            spy={"true"}
            smooth={"true"}
            duration={500}
            className="hover:text-purple-500 transition-all cursor-pointer"
          >
            Courses
          </Link>
          <Link
            to="reviews"
            spy={"true"}
            smooth={"true"}
            duration={500}
            className="hover:text-purple-500 transition-all cursor-pointer"
          >
            Reviews
          </Link>
          <Link
            to="contact"
            spy={"true"}
            smooth={"true"}
            duration={500}
            className="hover:text-purple-500 transition-all cursor-pointer"
          >
            Contact
          </Link>
          <ModeToggle />
        </nav>

        <div className="flex md:hidden" onClick={handleChange}>
          <div className="p-2">
            <Menu size={22} />
          </div>
        </div>
      </div>

      <div
        className={`${
          menu ? "translate-x-0" : " -translate-x-full"
        } md:hidden flex flex-col absolute bg-white left-0 top-20 font-medium text-2xl text-center pt-8 pb-4 gap-8 w-full h-fit transition-transform duration-300`}
      >
        <Link
          to="home"
          spy={"true"}
          smooth={"true"}
          duration={500}
          className="hover:text-purple-500 transition-all cursor-pointer"
        >
          Home
        </Link>
        <Link
          to="about"
          spy={"true"}
          smooth={"true"}
          duration={500}
          className="hover:text-purple-500 transition-all cursor-pointer"
        >
          About
        </Link>
        <Link
          to="courses"
          spy={"true"}
          smooth={"true"}
          duration={500}
          className="hover:text-purple-500 transition-all cursor-pointer"
        >
          Courses
        </Link>
        <Link
          to="reviews"
          spy={"true"}
          smooth={"true"}
          duration={500}
          className="hover:text-purple-500 transition-all cursor-pointer"
        >
          Reviews
        </Link>
        <Link
          to="contact"
          spy={"true"}
          smooth={"true"}
          duration={500}
          className="hover:text-purple-500 transition-all cursor-pointer"
        >
          Contact
        </Link>
      </div>
    </div>
  );
};

export default LandingNav;
