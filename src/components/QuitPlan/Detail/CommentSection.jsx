import React, { useState, useEffect } from "react";
import { Input, Button, Avatar, Tooltip, Dropdown, Divider } from "antd";
import {
  SmileOutlined,
  DeleteOutlined,
  EditOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const REACTIONS = [
  { emoji: "❤️", label: "Love" },
  { emoji: "😂", label: "Haha" },
  { emoji: "😮", label: "Wow" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😡", label: "Angry" },
];

const CommentSection = ({ day }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(`comments-${day.id}`);
    let initialComments = saved ? JSON.parse(saved) : [];

    const hasCoach = initialComments.some((c) => c.isCoach);

    if (!hasCoach) {
      const completed = day.tasks.filter((t) => t.done).length;
      const total = day.tasks.length;

      let coachText = "";
      if (completed === 0) {
        coachText = "Let's try to start at least one task today. You can do it! 💪";
      } else if (completed < total) {
        coachText = `Good job! You've completed ${completed}/${total} tasks. Keep going!`;
      } else {
        coachText = "Excellent! You’ve completed all your tasks today. 🎉";
      }

      const coachComment = {
        id: `coach-${day.id}`,
        text: coachText,
        time: Date.now(),
        reaction: null,
        isCoach: true,
        coachName: "Coach Alex",
        coachAvatar: "https://i.pravatar.cc/40?img=12",
        replies: []
      };

      initialComments.unshift(coachComment);
      localStorage.setItem(`comments-${day.id}`, JSON.stringify(initialComments));
    }

    setComments(initialComments);
  }, [day]);

  const saveComments = (updated) => {
    setComments(updated);
    localStorage.setItem(`comments-${day.id}`, JSON.stringify(updated));
  };

  const addComment = () => {
    if (!comment.trim()) return;

    if (replyingTo) {
      const updated = comments.map((c) =>
        c.id === replyingTo
          ? {
              ...c,
              replies: [
                ...(c.replies || []),
                {
                  id: Date.now(),
                  text: comment,
                  time: Date.now(),
                },
              ],
            }
          : c
      );
      saveComments(updated);
      setReplyingTo(null);
    } else {
      const newComment = {
        id: Date.now(),
        text: comment.trim(),
        time: Date.now(),
        reaction: null,
        replies: [],
      };
      saveComments([newComment, ...comments]);
    }

    setComment("");
  };

  const handleEditComment = (item) => {
    setComment(item.text);
    const updated = comments.filter((c) => c.id !== item.id);
    saveComments(updated);
  };

  const handleDeleteComment = (item) => {
    const updated = comments.filter((c) => c.id !== item.id);
    saveComments(updated);
  };

  const handleReact = (id, label) => {
    const updated = comments.map((c) =>
      c.id === id ? { ...c, reaction: c.reaction === label ? null : label } : c
    );
    saveComments(updated);
  };

  const renderReplies = (replies = []) =>
    replies.map((r) => (
      <div key={r.id} className="ml-6 mt-2 bg-gray-50 p-2 rounded border">
        <div className="flex items-center gap-2 mb-1 text-xs">
          <Avatar src="https://i.pravatar.cc/40?img=8" size={18} />
          <span className="font-medium text-gray-700">You</span>
          <span className="text-gray-400">· {dayjs(r.time).fromNow()}</span>
        </div>
        <div className="text-sm text-gray-700">{r.text}</div>
      </div>
    ));

  return (
    <>
      <Divider orientation="left" className="-mx-6 mb-2 text-sm font-semibold text-gray-700">
        <MessageOutlined className="mr-2 text-[#1f845a]" /> Comments
      </Divider>

      <Input.TextArea
        rows={2}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={replyingTo ? "Replying to coach..." : "Leave a comment..."}
        onPressEnter={(e) => {
          if (!e.shiftKey) {
            e.preventDefault();
            addComment();
          }
        }}
      />
      <div className="text-right mt-2 mb-4">
        <Button type="primary" onClick={addComment}>
          {replyingTo ? "Reply" : "Comment"}
        </Button>
      </div>

      <div className="space-y-3 pr-2">
        {comments.map((item) => (
          <div key={item.id} className="bg-white border rounded p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Avatar
                src={
                  item.isCoach
                    ? item.coachAvatar
                    : "https://i.pravatar.cc/40?img=8"
                }
                size="small"
              />
              <div>
                <div className="text-sm">
                  <span className="text-[15px] font-bold text-gray-800">
                    {item.isCoach ? item.coachName : "You"}
                  </span>
                  <span className="text-gray-500 ml-1 text-xs">
                    · {dayjs(item.time).fromNow()}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-2 text-sm whitespace-pre-wrap text-gray-700">
              {item.text}
            </div>

            <div className="flex items-center gap-[2px] mt-3 text-xs">
              {item.reaction && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-sm">
                  <span>
                    {REACTIONS.find((r) => r.label === item.reaction)?.emoji ||
                      "😊"}
                  </span>
                </div>
              )}
              <Dropdown
                placement="topLeft"
                overlay={
                  <div className="bg-white p-2 rounded shadow flex gap-2">
                    {REACTIONS.map((r) => (
                      <Tooltip key={r.label} title={r.label}>
                        <div
                          className="text-2xl cursor-pointer hover:scale-110 transition-transform"
                          onClick={() => handleReact(item.id, r.label)}
                        >
                          {r.emoji}
                        </div>
                      </Tooltip>
                    ))}
                  </div>
                }
                trigger={["click"]}
              >
                <Button
                  shape="circle"
                  size="small"
                  icon={<SmileOutlined />}
                  className="border-none"
                />
              </Dropdown>

              {item.isCoach ? (
                <>
                  <span className="text-gray-400">•</span>
                  <Button
                    type="text"
                    size="small"
                    onClick={() => setReplyingTo(item.id)}
                    style={{ fontSize: "11px" }}
                    className="!px-1 !h-auto"
                  >
                    Reply
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-gray-400">•</span>
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => handleEditComment(item)}
                    style={{ fontSize: "11px" }}
                    className="!px-1 !h-auto"
                  >
                    Edit
                  </Button>
                  <span className="text-gray-400">•</span>
                  <Button
                    type="text"
                    size="small"
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => handleDeleteComment(item)}
                    style={{ fontSize: "11px" }}
                    className="!px-1 !h-auto"
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>

            {renderReplies(item.replies)}
          </div>
        ))}
      </div>
    </>
  );
};

export default CommentSection;
