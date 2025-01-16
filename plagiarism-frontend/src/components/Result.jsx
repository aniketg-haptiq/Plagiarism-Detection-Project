import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import HighlightedMatch from "./HighlightedMatch";
import Plagresult from "./Plagresult";
import ParaphrasingTool from "./ParaphrasingTool";

const Result = ({ isLoggedIn }) => {
  const location = useLocation();
  const { similarityPercentage, matchedText, highlightedText, inputText } = location.state || {};

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-neutral-50 group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col gap-6">
        <Plagresult similarityPercentage={similarityPercentage} />
        
        {similarityPercentage > 0 && (
          <HighlightedMatch highlightedText={highlightedText} matchedText={matchedText} />
        )}

        {similarityPercentage > 50 && (
          <ParaphrasingTool inputText={inputText} isLoggedIn={isLoggedIn}/>
        )}
      </div>
    </div>
  );
};

export default Result;
