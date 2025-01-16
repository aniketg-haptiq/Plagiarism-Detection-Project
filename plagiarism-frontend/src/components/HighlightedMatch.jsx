import React from "react";

const HighlightedMatch = ({ highlightedText, matchedText }) => {
  const highlightMatchedText = (highlightedText, matchedText) => {
    if (!highlightedText || !matchedText) return highlightedText;

    const index = highlightedText.indexOf(matchedText);

    if (index !== -1) {
      const beforeMatch = highlightedText.slice(0, index);
      const match = highlightedText.slice(index, index + matchedText.length);
      const afterMatch = highlightedText.slice(index + matchedText.length);


      return (
        <>
          <mark className="bg-green-300">{beforeMatch}</mark>
          <mark className="bg-red-300">{match}</mark>
          <mark className="bg-green-300">{afterMatch}</mark>
        </>
      );
    }

    return highlightedText;
  };

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <p className="text-[#141414] text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
            Plagiarism Report
          </p>
        </div>
        <div className="flex flex-col gap-3 p-4">
          <div className="rounded bg-[#dbdbdb] p-4">
            <div className="flex flex-col gap-9">
              <div>
              <p className="text-neutral-500 text-lg font-normal leading-normal">
                {highlightMatchedText(highlightedText, matchedText)}
              </p>
              </div>
              {matchedText && (
                <div className="gap-5">
                <h3>Matched Text</h3>
                <p className="text-neutral-500 text-sm font-normal leading-normal">{matchedText}</p>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HighlightedMatch;
