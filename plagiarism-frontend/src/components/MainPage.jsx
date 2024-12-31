import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import PlagiarismDetection from "./PlagiarismDetection";
import Articles from "./Articles";

const MainPage = () => {
  const location = useLocation();
  const { state } = location;
  const articles = state?.articles || []; // Retrieve articles from navigation state

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-neutral-50 group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <PlagiarismDetection articles={articles}/>
        <Articles articles={articles} />
      </div>
    </div>
  );
};

export default MainPage;
