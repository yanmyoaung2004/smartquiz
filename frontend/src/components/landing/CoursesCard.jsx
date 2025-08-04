import React from "react";

const CoursesCard = (props) => {
  return (
    <div
      className='flex flex-col items-center justify-between bg-purple-50 border-2 md:border-none md:w-2/5 dark:bg-slate-800 dark:border dark:border-slate-300 p-10 
    cursor-pointer rounded-lg transition-all""
    '
    >
      <div className="w-3/5">
        <img src={props.img} alt="img" />
      </div>
      <div>
        <h3 className="font-semibold text-lg text-center my-5">
          {props.title}
        </h3>
        <p className="text-lightText text-center md:text-start dark:text-slate-300">
          Lorem ipsum dolor, sit amet consectetur sunt impedit dicta repellendus
          iste, architecto animi nobis ut reprehenderit.
        </p>
      </div>
    </div>
  );
};

export default CoursesCard;
