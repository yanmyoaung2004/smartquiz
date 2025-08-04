import React from "react";

const ChapterStrength = ({ strengths }) => {
  const getColor = (level) => {
    switch (level) {
      case "Strong":
        return "bg-green-400";
      case "Moderate":
        return "bg-yellow-400";
      case "Weak":
        return "bg-red-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Chapter Strengths</h2>
      {strengths.map((item, idx) => (
        <div key={idx} className="mb-4">
          <div className="flex justify-between mb-1">
            <span>{item.name}</span>
            <span>{item.level}</span>
          </div>
          <div className="w-full bg-gray-200 h-3 rounded">
            <div
              className={`${getColor(item.level)} h-3 rounded`}
              style={{ width: `${item.percent}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChapterStrength;
