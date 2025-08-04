import React from "react";
import personImg1 from "../../assets/mikasa.jpg";
import personImg2 from "../../assets/cherry.jpg";
import personImg4 from "../../assets/mikasa.jpg";
import Heading from "./heading";
import ReviewCard from "./ReviewCard";

const Reviews = () => {
  return (
    <div className="min-h-[8ovh] flex flex-col items-center justify-center md:px-32 px-5 my-19">
      <Heading title1="Our" title2="Reviews" />

      <div className="flex flex-col md:flex-row gap-5 mt-5">
        <ReviewCard img={personImg1} />
        <ReviewCard img={personImg2} />
        <ReviewCard img={personImg4} />
      </div>
    </div>
  );
};

export default Reviews;
