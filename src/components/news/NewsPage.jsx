import {
  FiSearch,
  FiBookmark,
  FiShare2,
  FiSun,
  FiMoon,
  FiMenu,
} from "react-icons/fi";
import './NewsPage.css';

const NewsPage = () => {
  const NewsPage = {
    featured: {
      title: "Global Climate Summit Reaches Historic Agreement",
      description:
        "World leaders unite to combat climate change with groundbreaking commitments",
      image: "https://images.unsplash.com/photo-1516937941344-00b4e0337589",
      category: "World News",
    },
    categories: [
      {
        name: "Doctor Advice",
        articles: [
          {
            title: "Next Generation AI Breakthrough",
            excerpt:
              "Revolutionary AI model shows human-like reasoning capabilities",
            image:
              "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
            date: "2024-01-20",
          },
        ],
      },
      {
        name: "Sports",
        articles: [
          {
            title: "Historic Victory in World Cup Final",
            excerpt: "Dramatic penalty shootout decides championship",
            image:
              "https://images.unsplash.com/photo-1517927033932-35943d37c322",
            date: "2024-01-19",
          },
        ],
      },
    ],
    trending: [
      {
        title: "Space Tourism Takes Off",
        views: 150000,
        image: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7",
      },
      {
        title: "Revolutionary Electric Vehicle Launch",
        views: 120000,
        image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7",
      },
    ],
  };

  return (
    <div className={"min-h-screen bg-gray-100"}>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Featured News */}
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
              <h1 className="text-4xl font-bold text-white mb-4">
                {NewsPage.featured.title}
              </h1>
              <p className="text-gray-200 mb-4">
                {NewsPage.featured.description}
              </p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">
                Read More
              </button>
            </div>
          </div>
        </section>

        {/* News Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* News Categories Section */}
          <div className="lg:col-span-2">
            {NewsPage.categories.map((category, index) => (
              <section key={index} className="mb-12">
                <h2 className="text-2xl font-bold mb-6 dark:text-black">
                  {category.name}
                </h2>
                <div className="grid gap-6">
                  {category.articles.map((article, idx) => (
                    <article
                      key={idx}
                      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition"
                    >
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <h3
                          className={`font-semibold ${
                            article.title === "Space Tourism Takes Off"
                              ? "text-white"
                              : "dark:text-white"
                          }`}
                        >
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
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                              <FiBookmark />
                            </button>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                              <FiShare2 />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Trending News Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-2xl font-bold mb-6 dark:text-black">
                Trending Now
              </h2>
              <div className="space-y-4">
                {NewsPage.trending.map((article, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow hover:shadow-lg transition"
                  >
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
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default NewsPage;
