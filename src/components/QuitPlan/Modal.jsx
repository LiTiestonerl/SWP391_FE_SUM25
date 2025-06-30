import React, { useState } from 'react';
import { notify } from './QuitPlan';
import './modal.css';

const Modal = ({
  day,
  weekIndex,
  dayIndex,
  plansByWeek,
  handleSaveEdit,
  closeModal,
  toggleDayCompletion,
  pushComment,
  handleMenuAction,
}) => {
  const [planDraft, setPlanDraft] = useState(day.plan);
  const [editing, setEditing] = useState(false);
  const [cmt, setCmt] = useState('');
  const [askUndo, setAskUndo] = useState(false);
  const [showMenu, setMenu] = useState(false);
  const [showHist, setHist] = useState(false);

  const completeHandler = () => {
    if (day.completed) setAskUndo(true);
    else {
      toggleDayCompletion(weekIndex, dayIndex);
      notify('success', 'Day marked as completed!', `complete-${dayIndex}`);
    }
  };

  const saveAll = () => {
    let didEdit = false;
    let didComment = false;

    if (editing && planDraft.trim() !== day.plan) {
      handleSaveEdit(weekIndex, dayIndex, planDraft);
      didEdit = true;
    }
    if (cmt.trim()) {
      pushComment(weekIndex, dayIndex, cmt.trim());
      didComment = true;
    }

    if (didEdit && didComment) notify('success', 'Plan & comment saved', `save-both-${dayIndex}`);
    else if (didEdit) notify('success', 'Plan updated successfully', `edit-${dayIndex}`);
    else if (didComment) notify('success', 'Comment added successfully', `comment-${dayIndex}`);
    else notify('info', 'No changes to save!', `no-change-${dayIndex}`);

    setEditing(false);
    setCmt('');
    setMenu(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveAll();
    }
  };

  const handleMenuClick = (action) => {
    handleMenuAction(weekIndex, dayIndex, action);
    setMenu(false);

    if (action === 'highlight') {
      notify('info', day.highlight ? 'Highlight removed' : 'Plan highlighted', `highlight-${dayIndex}`);
    } else if (action === 'copy') {
      notify('success', 'Plan copied to clipboard', `copy-${dayIndex}`);
    } else if (action === 'share') {
      notify('info', 'Plan shared successfully', `share-${dayIndex}`);
    }
  };

  const HistoryPop = () => (
    <div className="confirmation-overlay">
      <div
        className="confirmation-details"
        style={{
          maxWidth: 600,
          maxHeight: 500,
          width: '90vw',
          textAlign: 'left',
        }}
      >
        <h4 className="mb-3 font-semibold">All comments</h4>
        <div
          className="comment-history"
          style={{
            maxHeight: 360,
            overflowY: 'auto',
            paddingRight: '4px',
          }}
        >
{day.commentHistory
  .slice()
  .reverse()
  .map((h, i) => (
            <div key={i} className="comment-item">
              <p>
                <span className="comment-timestamp">
                  {new Date(h.timestamp).toLocaleDateString()}{' '}
                  {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="comment-text"> – {h.text}</span>
              </p>
            </div>
          ))}
        </div>
        <button className="confirm-btn mt-4" onClick={() => setHist(false)}>Close</button>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className={`modal-container ${day.completed && 'completed'} ${day.highlight && 'highlighted'}`}>
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <div className="header-main">
              <h3 className="week-title">Week {plansByWeek[weekIndex].id}</h3>
              <span className="divider">•</span>
              <h3 className="day-title">Day {dayIndex + 1}</h3>
              {day.highlight && <span className="text-red-500 ml-2">★</span>}
            </div>
            <p className="date-display">
              {day.date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>

          <div className="header-actions relative">
            <button onClick={completeHandler} className={`mark-btn ${day.completed && 'completed'}`}>
              {day.completed ? '✓ Completed' : 'Mark as Completed'}
            </button>

            <button className="menu-btn" onClick={() => setMenu(!showMenu)}>⋮</button>

            {showMenu && (
              <div className="menu-dropdown" style={{ top: 'calc(100% + 6px)', right: 0 }}>
                <button onClick={() => handleMenuClick('highlight')}>
                  {day.highlight ? 'Remove highlight' : 'Highlight'}
                </button>
                <button onClick={() => handleMenuClick('copy')}>Copy</button>
                <button onClick={() => handleMenuClick('share')}>Share</button>
              </div>
            )}

            <button onClick={closeModal} className="close-btn">✕</button>
          </div>
        </div>

        {/* Content */}
        <div className="modal-content">
          {/* Plan */}
          <div className="section">
            <div className="section-header">
              <h4>Plan</h4>
              {!editing && <button className="edit-btn" onClick={() => setEditing(true)}>Edit</button>}
            </div>
            {editing ? (
              <textarea
                className="plan-input"
                value={planDraft}
                onChange={(e) => setPlanDraft(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Edit your plan..."
              />
            ) : (
              <div className="plan-text">{planDraft}</div>
            )}
          </div>

          {/* Comment input */}
          <div className="section">
            <div className="section-header"><h4>Add Comment</h4></div>
            <textarea
              className="comment-input"
              value={cmt}
              onChange={(e) => setCmt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a comment..."
              maxLength={500}
            />
          </div>

          {/* Comment history preview */}
          {day.commentHistory.length > 0 && (
            <div className="section">
              <div className="section-header">
                <h4>History</h4>
                <button className="history-btn" onClick={() => setHist(true)}>View all</button>
              </div>
              <div
                className="comment-history"
                style={{
                  maxHeight: 100,
                  overflowY: 'auto',
                  paddingRight: '4px',
                }}
              >
                {day.commentHistory
                  .slice()
                  .reverse()
                  .map((h, i) => (
                    <div key={i} className="comment-item">
                      <p>
                        <span className="comment-timestamp">
                          {new Date(h.timestamp).toLocaleDateString()}{' '}
                          {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="comment-text"> – {h.text}</span>
                      </p>
                    </div>
                ))}
              </div>
            </div>
          )}

          {/* Save button */}
          <div className="action-buttons">
            <button className="save-btn" onClick={saveAll}>Save All Changes</button>
          </div>
        </div>

        {/* Undo overlay */}
        {askUndo && (
          <div className="confirmation-overlay">
            <div className="confirmation-details">
              <p>Do you want to mark this as not completed?</p>
              <div className="dialog-buttons">
                <button
                  className="confirm-btn"
                  onClick={() => {
                    toggleDayCompletion(weekIndex, dayIndex);
                    setAskUndo(false);
                    notify('info', 'Day marked as incomplete!', `undo-${dayIndex}`);
                  }}
                >
                  OK
                </button>
                <button className="cancel-btn" onClick={() => setAskUndo(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {showHist && <HistoryPop />}
      </div>
    </div>
  );
};

export default Modal;
