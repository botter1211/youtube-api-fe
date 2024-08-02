import React, { useState } from "react";
import axios from "axios";
import { Stack, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const ReplyForm = ({ commentId, onReplyAdded }) => {
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post("http://localhost:4000/comments/reply", {
      commentId,
      text,
    });
    setText("");
    onReplyAdded(response.data); // Pass the new reply data
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Reply to comment"
        required
      />
      <button type="submit">Submit</button> */}
      <Stack direction="row" alignItems="center">
        <TextField
          fullWidth
          size="small"
          value={text}
          placeholder="Reply to comment"
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

export default ReplyForm;
