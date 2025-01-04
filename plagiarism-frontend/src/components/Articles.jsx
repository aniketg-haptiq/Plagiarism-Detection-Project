import React from "react";

const Articles = ({ articles }) => {
  return (
    <div>
      <h3 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Articles</h3>
      {articles.map((article, index) => (
        <div key={index} className="p-4">
          <div className="flex items-stretch justify-between gap-4 rounded-xl">
            <div className="flex flex-[2_2_0px] flex-col gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-[#141414] text-base font-bold leading-tight">{article.title}</p>
                <p className="text-neutral-500 text-sm font-normal leading-normal">{article.description}</p>
              </div>
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 flex-row-reverse bg-[#ededed] text-[#141414] text-sm font-medium leading-normal w-fit">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate"
                 >
                Read more
                </a>
              </button>
            </div>
            <div
              className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl flex-1"
              style={{ backgroundImage: `url(${article.urlToImage})` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Articles;
