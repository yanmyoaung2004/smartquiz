import React from "react";

const ExamTable = ({ exams }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Exam History</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-blue-200">
            <th className="p-2 border">Exam Name</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Score</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam, idx) => (
            <tr key={idx} className="text-center">
              <td className="border p-2">{exam.name}</td>
              <td className="border p-2">{exam.date}</td>
              <td className="border p-2">{exam.score}</td>
              <td className="border p-2">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    exam.status === "Passed" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {exam.status}
                </span>
              </td>
              <td className="border p-2">
                <button className="bg-blue-500 text-white px-3 py-1 rounded">
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExamTable;
