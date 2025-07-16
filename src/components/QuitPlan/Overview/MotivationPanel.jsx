import React from 'react';

const quotes = [
  "Every cigarette avoided is a step toward freedom.",
  "You're stronger than your cravings.",
  "Small steps every day lead to big changes.",
  "You got this! Keep going 💪",
  "Your lungs are healing every second!",
];

const getRandomQuote = () =>
  quotes[Math.floor(Math.random() * quotes.length)];

const MotivationPanel = () => {
  const handleEmergency = () => {
    alert("Here are some quick tips:\n\n• Drink water slowly\n• Chew gum\n• Breathe deeply\n• Go for a walk\n• Distract yourself for 15 mins");
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-emerald-700">🌟 Motivation</h3>
      <p className="italic text-gray-700 text-sm">“{getRandomQuote()}”</p>
      <button
        onClick={handleEmergency}
        className="px-4 py-2 bg-red-600 text-white text-sm rounded shadow hover:bg-red-700"
      >
        🚨 I Have a Craving
      </button>
    </div>
  );
};

export default MotivationPanel;
