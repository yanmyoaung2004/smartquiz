import React from "react";

const ReviewCard = (props) => {
  return (
    <div
      className="w-full md:w-1/3 bg-pink-50 md:border-none p-5 dark:bg-slate-800
    rounded-lg hover:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] transition-all"
    >
      <article dir="rtl">
        {/* <div className='flex flex-row justify-center'> */}
        <img className="float-left w-1/3" src={props.img} alt="img" />
        <p className="text-sm leading-relaxed p-4 max-w-xl mx-auto">
          Maybe we can live without libraries, people like you and me. Maybe.
          Sure, we're too old to change the world, but what about that kid,
          sitting down, opening a book, right now, in a branch at the local
          library and finding drawings of pee-pees and wee-wees on the Cat in
          the Hat and the Five.
        </p>

        {/* </div> */}
      </article>
    </div>
  );
};

export default ReviewCard;
