import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import dayjs from 'dayjs';

const moods = [
  { emoji: '😊', label: 'Happy',   color: 'text-yellow-500' },
  { emoji: '😐', label: 'Neutral', color: 'text-gray-500'   },
  { emoji: '😟', label: 'Worried', color: 'text-orange-500' },
  { emoji: '😣', label: 'Stressed',color: 'text-red-500'    },
];

const QuitJournal = () => {
  const [entries, setEntries] = useState(() =>
    JSON.parse(localStorage.getItem('quitJournal') || '{}')
  );

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [note, setNote] = useState('');
  const [mood, setMood] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const dateKey = dayjs(selectedDate).format('YYYY-MM-DD');
  const entry = entries[dateKey];

  useEffect(() => {
    setNote(entry?.note || '');
    setMood(entry?.mood || '');
    setEditMode(!entry); // Nếu có entry thì mặc định read-only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const handleSave = () => {
    const updated = {
      ...entries,
      [dateKey]: {
        note,
        mood,
        lastEdited: dayjs().format('MMMM D, YYYY, h:mm A'),
      },
    };
    setEntries(updated);
    localStorage.setItem('quitJournal', JSON.stringify(updated));
    setEditMode(false); // về lại read-only
  };

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const key = dayjs(date).format('YYYY-MM-DD');
    const e = entries[key];
    if (!e) return null;
    const color = moods.find((m) => m.emoji === e.mood)?.color || '';
    return (
      <span
        title={`${e.mood} • ${e.note?.slice(0, 20) || ''}`}
        className={`block text-center text-sm ${color}`}
        style={{ lineHeight: 1, marginTop: 2 }}
      >
        {e.mood}
      </span>
    );
  };

  return (
    <div className="bg-white shadow rounded-xl px-6 py-5">
      <h2 className="text-xl font-semibold text-emerald-800 mb-3 flex items-center gap-1">
        📝 Quit Journal
      </h2>

      {/* Calendar được căn giữa */}
      <div className="flex justify-center">
        <Calendar
          onClickDay={(val) => {
            setSelectedDate(val);
            setShowModal(true);
          }}
          value={selectedDate}
          tileContent={tileContent}
          calendarType="gregory"
          locale="en-US"
          className="rounded-lg shadow-sm border-none"
        />
      </div>

      <p className="text-sm text-gray-500 mt-2 text-center">
        📌 Click a day to write or view your diary entry.
      </p>

      {/* ========= MODAL ========= */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur flex items-center justify-center z-[100]"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-xl p-6 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header + Edit */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-emerald-700">
                Entry for {dayjs(selectedDate).format('MMMM D, YYYY')}
              </h3>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                >
                  Edit
                </button>
              )}
            </div>

            {/* Mood */}
            <div>
              <p className="text-sm text-gray-600 mb-1">Mood:</p>
              <div className="flex gap-2">
                {moods.map((m) => (
                  <button
                    key={m.label}
                    disabled={!editMode}
                    onClick={() => editMode && setMood(m.emoji)}
                    className={`border rounded px-2 py-1 text-xl transition ${
                      mood === m.emoji
                        ? 'bg-green-100 border-green-500'
                        : 'hover:bg-gray-100'
                    } ${!editMode && 'opacity-50 cursor-default'}`}
                    title={m.label}
                  >
                    {m.emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <textarea
              readOnly={!editMode}
              className={`w-full border rounded p-2 min-h-[90px] ${
                !editMode && 'bg-gray-100 text-gray-600'
              }`}
              placeholder="Write your diary..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            {/* Last edited */}
            {entry?.lastEdited && (
              <p className="text-xs text-gray-500">
                Last edited: {entry.lastEdited}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              {editMode && (
                <button
                  onClick={handleSave}
                  className="flex-1 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                >
                  Save
                </button>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 border rounded hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuitJournal;
