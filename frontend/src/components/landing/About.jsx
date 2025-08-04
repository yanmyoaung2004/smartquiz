import React from "react";
import img from "../../assets/contactus.jpg";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import Heading from "./heading";

const About = () => {
  return (
    <div
      className="md:min-h-screen flex flex-col-reverse
    md:flex-row items-center gap-4 md:mx-32 mx-5 mt-5 "
    >
      <div className="w-full md:w2/4">
        <img src={img} alt="img" />
      </div>
      <div className="w-full md:w2/4 text-center space-y-9">
        <Heading title1="About" title2="Us?" />
        <div>
          <div
            style={{
              color: "#212121",
              fontFamily: "Poppins, sans-serif",
              marginTop: "30px",
              fontSize: "19px",
              textShadow: "initial",
            }}
            className="dark:text-slate-100"
          >
            Our Mission
          </div>
          <div className="">
            <h1
              style={{
                color: "#212121",
                marginTop: "30px",
                marginBottom: "10px",
                fontFamily: "Poppins, sans-serif",
                fontSize: "65px",
                fontWeight: "800",
                lineHeight: "111%",
                display: "inline",
              }}
              // className="text-red-600"
            >
              Motivate every student
            </h1>
          </div>
          <p className="w-full mt-5">
            Quizizz is more than gamified quizzes. We are assessment,
            instruction, and practice that motivate every student to mastery.
          </p>
        </div>
        <Link to="contact" spy={"true"} smooth={"true"} duration={500}>
          <Button className="text-lg bg-purple-200 text-purple-800">
            Contact Us
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default About;
