import React from "react";

const HighlightedMatch = ({ highlightedText, matchedText }) => {
  // Function to highlight the matched text
  const highlightMatchedText = (highlightedText, matchedText) => {
    // If no matchedText or highlightedText, return the highlightedText as is
    if (!highlightedText || !matchedText) return highlightedText;

    // Find the index of the matchedText in the highlightedText
    const index = highlightedText.indexOf(matchedText);

    // If matchedText is found, split the highlightedText into three parts: before, match, after
    if (index !== -1) {
      const beforeMatch = highlightedText.slice(0, index);
      const match = highlightedText.slice(index, index + matchedText.length);
      const afterMatch = highlightedText.slice(index + matchedText.length);

      // Return the JSX with the matchedText wrapped in a <mark> for highlighting
      return (
        <>
          {beforeMatch}
          <mark className="bg-yellow-300">{match}</mark>
          {afterMatch}
        </>
      );
    }

    // If matchedText is not found, return the highlightedText as is
    return highlightedText;
  };

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <p className="text-[#141414] text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
            Matched Text
          </p>
        </div>
        <div className="flex flex-col gap-3 p-4">
          <div className="flex gap-6 justify-between">
            <p className="text-[#141414] text-base font-medium leading-normal">Highlighted Match:</p>
          </div>
          <div className="rounded bg-[#dbdbdb] p-4">
            <div className="flex flex-col gap-3">
              <p className="text-neutral-500 text-sm font-normal leading-normal">
                {highlightMatchedText(highlightedText, matchedText)}
              </p>
              <p className="text-neutral-500 text-sm font-normal leading-normal">{matchedText}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HighlightedMatch;
