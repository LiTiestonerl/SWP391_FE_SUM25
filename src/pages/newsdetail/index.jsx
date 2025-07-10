import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NewsDetailPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const article = state?.article;

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Article not found</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <img
        src={article.image}
        alt={article.title}
        className="w-full h-96 object-cover rounded-xl mb-6"
      />
      <h1 className="text-4xl font-bold mb-4 text-gray-900">
        {article.title}
      </h1>
      <p className="text-gray-600 mb-6">
        {article.date && <span className="italic">Published: {article.date}</span>}
      </p>
      <div
        className="text-lg leading-relaxed text-gray-800"
        dangerouslySetInnerHTML={{
          __html:
            article.content ||
            article.excerpt ||
            article.description ||
            "No content available.",
        }}
      ></div>
    </div>
  );
};

export default NewsDetailPage;
