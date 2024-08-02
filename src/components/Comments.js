// src/components/Comments.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const Comments = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      const response = await axios.get(
        `http://localhost:4000/comments?videoId=${videoId}`
      );
      setComments(response.data.items);
    };
    fetchComments();
  }, [videoId]);

  const handleAddComment = async () => {
    await axios.post("http://localhost:4000/comments", {
      videoId,
      text: newComment,
    });
    setNewComment("");
    // Refresh comments
    const response = await axios.get(
      `http://localhost:4000/comments?videoId=${videoId}`
    );
    setComments(response.data.items);
  };

  const handleDeleteComment = async (commentId) => {
    await axios.delete(`http://localhost:4000/comments/${commentId}`);
    // Refresh comments
    const response = await axios.get(
      `http://localhost:4000/comments?videoId=${videoId}`
    );
    setComments(response.data.items);
  };

  const handleReplyComment = async (commentId) => {
    await axios.post("http://localhost:4000/comments/reply", {
      commentId,
      text: replyText,
    });
    setReplyText("");
    // Refresh comments
    const response = await axios.get(
      `http://localhost:4000/comments?videoId=${videoId}`
    );
    setComments(response.data.items);
  };

  return (
    <div>
      <h2>Comments</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            {comment.snippet.topLevelComment.snippet.textOriginal}
            <button onClick={() => handleDeleteComment(comment.id)}>
              Delete
            </button>
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Reply to comment"
            />
            <button onClick={() => handleReplyComment(comment.id)}>
              Reply
            </button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment"
      />
      <button onClick={handleAddComment}>Add Comment</button>
    </div>
  );
};

export default Comments;
