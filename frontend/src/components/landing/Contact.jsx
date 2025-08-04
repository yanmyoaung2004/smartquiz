import React from "react";

import { Button } from "../ui/button";
import img from "../../assets/4220713.jpg";
import Heading from "./heading";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center md:mx-32 mx-5 mt-10">
      <Heading title1="Contact" title2="Us" />

      <div className="flex flex-col md:flex-row justify-between w-full">
        <form className="w-full md:w-2/5 space-y-5 pt-20">
          <div className="flex flex-col">
            <label htmlFor="userName">Your Name</label>
            <input
              className="py-3 px-2 rounded-lg hover:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] transition-all"
              type="text"
              name="userName"
              id="userName"
              placeholder="Enter Your Name"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="useEmail">Your Email</label>
            <input
              className="py-3 px-2 rounded-lg hover:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] transition-all"
              type="email"
              name="userEmail"
              id="userEmail"
              placeholder="Enter Your Email"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="useNumber">Your Number</label>
            <input
              className="py-3 px-2 rounded-lg hover:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] transition-all"
              type="text"
              name="userNumber"
              id="userNumber"
              placeholder="Enter Your Number"
            />
          </div>

          <div className="flex flex-row justify-center">
            <Button className="bg-purple-600 text-slate-100 hover:bg-purple-800">
              Send Message
            </Button>
          </div>
        </form>

        <div className="w-2xl md:w2/4">
          <img src={img} alt="img" />
        </div>
      </div>
    </div>
  );
};

export default Contact;
