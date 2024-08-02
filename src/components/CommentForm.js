import React, { useState } from "react";
import axios from "axios";
import { Stack, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const CommentForm = ({ videoId, onCommentAdded }) => {
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("https://youtube-api-be.onrender.com/comments", {
      videoId,
      text,
    });
    setText("");
    onCommentAdded();
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment"
        required
      />
      <button type="submit">Submit</button> */}
      <Stack direction="row" alignItems="center">
        <TextField
          fullWidth
          size="small"
          value={text}
          placeholder="Write a comment…"
          onChange={(e) => setText(e.target.value)}
          sx={{
            ml: 2,
            mr: 1,
            "& fieldset": {
              borderWidth: `1px !important`,
              borderColor: (theme) =>
                `${theme.palette.grey[500_32]} !important`,
            },
          }}
        />
        <IconButton type="submit">
          <SendIcon sx={{ fontSize: 30 }} />
        </IconButton>
      </Stack>
    </form>
  );
};

export default CommentForm;
