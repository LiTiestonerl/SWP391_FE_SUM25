import { FiBookmark, FiShare2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./NewsPage.css";

const NewsPage = () => {
  const NewsPageData = {
    featured: {
      id: "featured",
      title: "Stop smoking before it's too late",
      description:
        "The harmful effects of smoking are more serious than you think",
      image: "/images/nosmoking.jpg",
      category: "World News",
      date: "2024-01-10",
      content: `
        <p>Smoking causes irreversible damage to your lungs, heart, and entire body. If you are still smoking, it's time to act.</p>
        <p>Here are 5 reasons to quit today:</p>
        <ul class="list-disc ml-6">
          <li>Protect your family from secondhand smoke</li>
          <li>Improve your lung function</li>
          <li>Reduce risk of heart disease</li>
          <li>Save thousands of dollars a year</li>
          <li>Live a longer and healthier life</li>
        </ul>
      `,
    },
    categories: [
      {
        name: "Doctor Advice",
        articles: [
          {
            id: "1",
            title: "Cigarette Cravings: 10 Tips to Overcome Them",
            excerpt: "What should you do when you crave a cigarette?",
            image: "/images/doctor.jpg",
            date: "2024-01-20",
            content: `
              <p>Quitting smoking is not easy. Here are 10 helpful tips to overcome cravings:</p>
              <ol class="list-decimal ml-6 mt-2 space-y-1">
                <li>Chew gum or eat fruit</li>
                <li>Take deep breaths</li>
                <li>Go for a short walk</li>
                <li>Drink a glass of water</li>
                <li>Remind yourself of your reasons to quit</li>
                <li>Call a friend for support</li>
                <li>Delay for 10 minutes</li>
                <li>Practice mindfulness</li>
                <li>Use nicotine replacement if needed</li>
                <li>Stay busy and active</li>
              </ol>
            `,
          },
        ],
      },
      {
        name: "Harmful Effects of Smoking",
        articles: [
          {
            id: "2",
            title: "Top 10 Harmful Effects of Smoking",
            excerpt: "Smoking kills millions each year — and not just smokers.",
            image: "/images/harm.jpg",
            date: "2024-01-19",
            content: `
              <p>Here are 10 serious health risks linked to smoking:</p>
              <ul class="list-disc ml-6">
                <li>Lung cancer</li>
                <li>Heart disease</li>
                <li>Stroke</li>
                <li>Chronic bronchitis</li>
                <li>Emphysema</li>
                <li>Reduced fertility</li>
                <li>Weak immune system</li>
                <li>Vision problems</li>
                <li>Premature aging</li>
                <li>Shortened life span</li>
              </ul>
            `,
          },
        ],
      },
    ],
    trending: [
      {
        id: "3",
        title: "Exercise to quit smoking",
        views: 150000,
        image: "/images/run.jpg",
        content: `
  <p>Regular physical activity can help reduce cravings and withdrawal symptoms.</p>
  <p>Try jogging, cycling, or even a brisk 15-minute walk to distract your brain and boost mood naturally.</p>
  <p>Exercise doesn’t have to be intense. What matters most is consistency and movement. Here are more ideas you can try:</p>
  <ul class="list-disc ml-6 space-y-1">
    <li><strong>Dancing:</strong> A fun way to move your body while lifting your spirits.</li>
    <li><strong>Home workouts:</strong> Simple bodyweight exercises like push-ups, jumping jacks, or planks can be done anywhere.</li>
    <li><strong>Stretching or yoga:</strong> Helps you relax, breathe better, and refocus your mind.</li>
    <li><strong>Team sports:</strong> Playing soccer, badminton, or even a casual game of basketball can help shift your focus and create social support.</li>
  </ul>
  <p class="mt-4">Beyond reducing cravings, exercise helps your body heal from years of smoking. It improves your lung capacity, strengthens your heart, and releases endorphins — natural mood boosters that counteract stress and anxiety.</p>
  <p class="mt-2">The first few days after quitting are the toughest. That’s when movement becomes your secret weapon. Even a short walk can interrupt the urge to smoke and give you back control.</p>
  <p class="mt-2 font-semibold">Start small. Stay committed. Your body — and your future — will thank you.</p>
`,
      },
      {
        id: "4",
        title: "7 stages you must go through to successfully quit smoking",
        views: 120000,
        image: "/images/no.jpg",
        content: `
          <p>Quitting is a journey. You will go through these 7 psychological and physical stages:</p>
          <ol class="list-decimal ml-6">
            <li>Pre-contemplation</li>
            <li>Contemplation</li>
            <li>Preparation</li>
            <li>Action</li>
            <li>Maintenance</li>
            <li>Relapse (optional)</li>
            <li>Resolution</li>
          </ol>
        `,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        {/* Featured */}
        <section className="mb-12">
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={NewsPageData.featured.image}
              alt={NewsPageData.featured.title}
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-8">
              <span className="text-blue-400 font-semibold mb-2 block">
                {NewsPageData.featured.category}
              </span>
              <h1 className="text-4xl font-bold text-white mb-4">
                {NewsPageData.featured.title}
              </h1>
              <p className="text-gray-200 mb-4">
                {NewsPageData.featured.description}
              </p>
              <Link
                to={`/news/${NewsPageData.featured.id}`}
                state={{ article: NewsPageData.featured }}
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Read More
              </Link>
            </div>
          </div>
        </section>

        {/* Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {NewsPageData.categories.map((category, index) => (
              <section key={index} className="mb-12">
                <h2 className="text-2xl font-bold mb-6">{category.name}</h2>
                <div className="grid gap-6">
                  {category.articles.map((article) => (
                    <Link
                      key={article.id}
                      to={`/news/${article.id}`}
                      state={{ article }}
                      className="block"
                    >
                      <article className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                          <h3 className="font-semibold">{article.title}</h3>
                          <p className="text-gray-600 mb-4">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                              {article.date}
                            </span>
                            <div className="flex space-x-2">
                              <button className="p-2 text-white hover:bg-gray-100 rounded-full">
                                <FiBookmark />
                              </button>
                              <button className="p-2 text-white hover:bg-gray-100 rounded-full">
                                <FiShare2 />
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Trending */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Trending Now</h2>
              <div className="space-y-4">
                {NewsPageData.trending.map((article) => (
                  <Link
                    key={article.id}
                    to={`/news/${article.id}`}
                    state={{ article }}
                    className="block"
                  >
                    <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold">{article.title}</h3>
                        <p className="text-sm text-gray-500 mt-2">
                          {article.views.toLocaleString()} views
                        </p>
                      </div>
                    </div>
                  </Link>
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
