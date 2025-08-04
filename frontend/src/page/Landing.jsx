import LandingHome from "@/components/landing/LandingHome";
import LandingNav from "@/components/landing/LandingNav";
import About from "@/components/landing/About";
import React from "react";
import Courses from "@/components/landing/Courses";
import Reviews from "@/components/landing/Reviews";
import Contact from "@/components/landing/Contact";
import LandingFooter from "@/components/landing/LandingFooter";

const Landing = () => {
  return (
    <div
      style={{ fontFamily: "Quicksand, sans-serif" }}
      className="dark:bg-slate-900 bg-white"
    >
      <LandingNav />

      <main className="dark:bg-slate-900 bg-white">
        <div id="home">
          <LandingHome />
        </div>

        <div id="about">
          <About />
        </div>

        <div id="courses">
          <Courses />
        </div>

        <div id="reviews">
          <Reviews />
        </div>

        <div id="contact">
          <Contact />
        </div>
      </main>
      <LandingFooter />
    </div>
  );
};

export default Landing;
