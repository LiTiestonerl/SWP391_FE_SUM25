import { FiBookmark, FiShare2 } from "react-icons/fi";
import "./NewsPage.css";

const NewsPage = () => {
  const NewsPage = {
    featured: {
      title: "Stop smoking before it's too late",
      description:
        "The harmful effects of smoking are more serious than you think",
      image: "/images/nosmoking.jpg",
      category: "World News",
      url: "https://tobaccofree.org/quit-smoking-for-better-health-the-top-10-reasons-to-quit/",
    },
    categories: [
      {
        name: "Doctor Advice",
        articles: [
          {
            title: "Cigarette Cravings: 10 Tips to Overcome Them",
            excerpt:
              "Why is it difficult to quit smoking? And what should you do when you crave a cigarette?",
            image: "/images/doctor.jpg",
            date: "2024-01-20",
            url: "https://cand.com.vn/y-te/loi-khuyen-cua-bac-si-de-cai-thuoc-la-thanh-cong-i716362/",
          },
        ],
      },
      {
        name: "Harmful Effects of Smoking",
        articles: [
          {
            title: "Top 10 Harmful Effects of Smoking",
            excerpt:
              "According to the report, in 2022, there will be about 1.3 billion smokers worldwide.",
            image: "/images/harm.jpg",
            date: "2024-01-19",
            url: "https://drbelalbinasaf.com/blog/10-harmful-effects-of-cigarette-smoking/",
          },
        ],
      },
    ],
    trending: [
      {
        title: "Exercise to quit smoking",
        views: 150000,
        image: "/images/run.jpg",
        url: "https://baobacgiang.vn/bg/suc-khoe/371838/cai-thuoc-la-hieu-qua-nho-tap-the-duc-thuong-xuyen.html",
      },
      {
        title: "7 stages you must go through to successfully quit smoking",
        views: 120000,
        image: "/images/no.jpg",
        url: "https://hellobacsi.com/thoi-quen-lanh-manh/bo-thuoc-la/cai-thuoc-la/",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        {/* Featured Section */}
        <section className="mb-12">
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={NewsPage.featured.image}
              alt={NewsPage.featured.title}
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-8">
              <span className="text-blue-400 font-semibold mb-2 block">
                {NewsPage.featured.category}
              </span>
              <h1 className="text-4xl font-bold text-black mb-4">
                {NewsPage.featured.title}
              </h1>
              <p className="text-gray-200 mb-4">
                {NewsPage.featured.description}
              </p>
              <a
                href={NewsPage.featured.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Read More
              </a>
            </div>
          </div>
        </section>

        {/* News Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Categories */}
          <div className="lg:col-span-2">
            {NewsPage.categories.map((category, index) => (
              <section key={index} className="mb-12">
                <h2 className="text-2xl font-bold mb-6 dark:text-black">
                  {category.name}
                </h2>
                <div className="grid gap-6">
                  {category.articles.map((article, idx) => (
                    <a
                      key={idx}
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <article className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                          <h3 className="font-semibold dark:text-white">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {article.date}
                            </span>
                            <div className="flex space-x-2">
                              <button className="p-2 text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                                <FiBookmark />
                              </button>
                              <button className="p-2 text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                                <FiShare2 />
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Trending Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-2xl font-bold mb-6 dark:text-black">
                Trending Now
              </h2>
              <div className="space-y-4">
                {NewsPage.trending.map((article, index) => {
                  const content = (
                    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow hover:shadow-lg transition">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold dark:text-white">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          {article.views.toLocaleString()} views
                        </p>
                      </div>
                    </div>
                  );

                  return article.url ? (
                    <a
                      key={index}
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={index}>{content}</div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default NewsPage;
