import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import HighlightedMatch from "./HighlightedMatch";
import Plagresult from "./Plagresult";

const Result = () => {
  const location = useLocation();
  const { similarityPercentage, matchedText, highlightedText } = location.state || {};

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-neutral-50 group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Plagresult similarityPercentage={similarityPercentage} />
        <HighlightedMatch highlightedText={highlightedText} matchedText={matchedText} />
      </div>
    </div>
  );
};

export default Result;
