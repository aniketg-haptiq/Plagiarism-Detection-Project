import React from "react";

const Plagresult = ({ similarityPercentage }) => { 
  const similarityLevel = similarityPercentage > 50 ? "High Similarity" : "Low Similarity";
  const bgColor = similarityPercentage > 50 ? "bg-red-500" : "bg-green-500";

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <p className="text-[#141414] text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
            huhh..Your Plagiarism Results Are Ready!
          </p>
        </div>

        {/* Display the similarity percentage or congratulatory message if 0% */}
        {similarityPercentage === 0 ? (
          <h2 className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
            Congratulations! No Plagiarism Found.
          </h2>
        ) : (
          <>
            <h2 className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Similarity: {similarityPercentage}%
            </h2>
            <div className="flex flex-col gap-3 p-4">
              <div className="flex gap-6 justify-between">
                <p className="text-[#141414] text-base font-medium leading-normal">{similarityLevel}</p>
              </div>
              <div className="rounded bg-[#dbdbdb]">
                <div
                  className={`h-2 rounded ${bgColor}`}
                  style={{ width: `${similarityPercentage}%` }}
                ></div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Plagresult;
