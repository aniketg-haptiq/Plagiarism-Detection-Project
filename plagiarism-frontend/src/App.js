import React from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import Header from "./components/Header";
import PlagiarismForm from "./components/PlagiarismForm";
import MainPage from "./components/MainPage";
import Result from "./components/Result";

const AppRoutes = () => {
  const routes = useRoutes([
    { path: "/", element: <PlagiarismForm /> },
    { path: "/main", element: <MainPage /> },
    { path: "/result", element: <Result /> },
  ]);

  return routes;
};

const App = () => {
  return (
    <Router>
      <div
        className="relative flex size-full min-h-screen flex-col bg-neutral-50 group/design-root overflow-x-hidden"
        style={{ fontFamily: '"Be Vietnam Pro", "Noto Sans", sans-serif' }}
      >
        <div className="layout-container flex h-full grow flex-col">
          <Header />
          <div className="px-40 flex flex-1 justify-center py-5">
            <AppRoutes />
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
