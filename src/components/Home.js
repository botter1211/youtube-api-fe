import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import CommentForm from "./CommentForm";
import ReplyForm from "./ReplyForm";
import { useNavigate } from "react-router-dom";
import { fDate } from "../utils/formatTime";
import Login from "./Login";
import {
  Avatar,
  Button,
  Container,
  CssBaseline,
  Toolbar,
  Box,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ToggleColorMode from "./ToggleColorMode";

const Home = () => {
  const [activities, setActivities] = useState([]);
  const [comments, setComments] = useState({});
  const navigate = useNavigate();
  const hasLoggin = window.localStorage.getItem("userToken");
  const handleLogout = () => {
    // Clear user session (e.g., remove tokens from localStorage)
    localStorage.removeItem("userToken");
    // Redirect to login page
    navigate("/login");
  };

  useEffect(() => {
    const fetchActivities = async () => {
      const response = await axios.get("http://localhost:4000/activities");
      setActivities(response.data.items);

      // Fetch comments for each activity
      const commentsData = {};
      for (const activity of response.data.items) {
        const upload = activity.contentDetails.upload;
        if (upload) {
          const videoId = upload.videoId;
          const commentsResponse = await axios.get(
            `http://localhost:4000/comments?videoId=${videoId}`
          );
          commentsData[videoId] = commentsResponse.data.items;
        }
      }
      setComments(commentsData);
    };
    if (hasLoggin) {
      fetchActivities();
    }
  }, [hasLoggin]);

  const handleCommentAdded = async (videoId) => {
    const commentsResponse = await axios.get(
      `http://localhost:4000/comments?videoId=${videoId}`
    );
    setComments((prevComments) => ({
      ...prevComments,
      [videoId]: commentsResponse.data.items,
    }));
  };
  // const handleReplyAdded = (newReply) => {
  //   const parentId = newReply.snippet.parentId;
  //   const videoId = newReply.snippet.videoId;
  //   setComments((prevComments) => ({
  //     ...prevComments,
  //     [videoId]: prevComments[videoId].map((comment) =>
  //       comment.id === parentId
  //         ? {
  //             ...comment,
  //             replies: {
  //               comments: [...(comment.replies?.comments || []), newReply],
  //             },
  //           }
  //         : comment
  //     ),
  //   }));
  // };
  const handleDeleteComment = async (commentId, videoId) => {
    await axios.delete(`http://localhost:4000/comments/${commentId}`);
    handleCommentAdded(videoId);
  };

  const [mode, setMode] = useState("light");
  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
          background: {
            dark: "hsl(230, 17%, 14%)",
            light: "hsl(0, 0%, 100%)",
          },
          transitionDelay: "2s",
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        {!hasLoggin ? (
          <div>
            <Toolbar sx={{ justifyContent: "flex-end", mr: "20px" }}>
              <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
            </Toolbar>
            <Login />
          </div>
        ) : (
          <div>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                pt: 2,
                alignItems: "center",
              }}
            >
              <Toolbar sx={{ justifyContent: "flex-end", mr: "20px" }}>
                <ToggleColorMode
                  mode={mode}
                  toggleColorMode={toggleColorMode}
                />
              </Toolbar>
              <Button variant="contained" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
            <h1>Activities</h1>
          </div>
        )}

        <ul>
          {activities.map((activity) => (
            <>
              <Card sx={{ display: "flex", m: 1 }}>
                <CardContent sx={{ flex: 1 }}>
                  <Typography component="h2" variant="h5">
                    {activity?.snippet.title}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    paragraph
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {activity?.snippet.description}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",

                      alignItems: "center",
                      p: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      Published on {fDate(activity.snippet.publishedAt)}
                    </Typography>
                  </Box>
                  {activity.contentDetails.upload && (
                    <>
                      <CommentForm
                        videoId={activity.contentDetails.upload.videoId}
                        onCommentAdded={() =>
                          handleCommentAdded(
                            activity.contentDetails.upload.videoId
                          )
                        }
                      />
                      <ul>
                        {comments[activity.contentDetails.upload.videoId]?.map(
                          (comment) => (
                            <li key={comment.id}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Avatar
                                    alt={
                                      comment.snippet.topLevelComment.snippet
                                        .authorDisplayName
                                    }
                                    src={
                                      comment.snippet.topLevelComment.snippet
                                        .authorProfileImageUrl
                                    }
                                  />
                                  <p>
                                    <strong>
                                      {
                                        comment.snippet.topLevelComment.snippet
                                          .authorDisplayName
                                      }
                                      :
                                    </strong>{" "}
                                    {
                                      comment.snippet.topLevelComment.snippet
                                        .textOriginal
                                    }
                                  </p>
                                </Box>
                                <button
                                  onClick={() =>
                                    handleDeleteComment(
                                      comment.id,
                                      activity.contentDetails.upload.videoId
                                    )
                                  }
                                >
                                  Delete Comment
                                </button>
                              </Box>
                              <ReplyForm
                                commentId={comment.id}
                                onReplyAdded={() =>
                                  handleCommentAdded(
                                    activity.contentDetails.upload.videoId
                                  )
                                }
                              />
                              {comment.replies && (
                                <ul>
                                  {comment.replies.comments.map((reply) => (
                                    <>
                                      <li key={reply.id}>
                                        <Box
                                          sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            <Avatar
                                              alt={
                                                comment.snippet.topLevelComment
                                                  .snippet.authorDisplayName
                                              }
                                              src={
                                                comment.snippet.topLevelComment
                                                  .snippet.authorProfileImageUrl
                                              }
                                            />
                                            <p>
                                              <strong>
                                                {
                                                  reply.snippet
                                                    .authorDisplayName
                                                }
                                                :
                                              </strong>{" "}
                                              {reply.snippet.textOriginal}
                                            </p>
                                          </Box>
                                          <button
                                            onClick={() =>
                                              handleDeleteComment(
                                                reply.id,
                                                activity.contentDetails.upload
                                                  .videoId
                                              )
                                            }
                                          >
                                            Delete Reply
                                          </button>
                                        </Box>
                                      </li>
                                    </>
                                  ))}
                                </ul>
                              )}
                            </li>
                          )
                        )}
                      </ul>
                    </>
                  )}
                </CardContent>
              </Card>
              {/* <li key={activity.id}>
                <h2>{activity.snippet.title}</h2>
                <p>Published At {fDate(activity.snippet.publishedAt)}</p>

                {activity.contentDetails.upload && (
                  <>
                    <CommentForm
                      videoId={activity.contentDetails.upload.videoId}
                      onCommentAdded={() =>
                        handleCommentAdded(
                          activity.contentDetails.upload.videoId
                        )
                      }
                    />
                    <ul>
                      {comments[activity.contentDetails.upload.videoId]?.map(
                        (comment) => (
                          <li key={comment.id}>
                            <p>
                              <strong>
                                {
                                  comment.snippet.topLevelComment.snippet
                                    .authorDisplayName
                                }
                                :
                              </strong>{" "}
                              {
                                comment.snippet.topLevelComment.snippet
                                  .textOriginal
                              }
                            </p>
                            <button
                              onClick={() =>
                                handleDeleteComment(
                                  comment.id,
                                  activity.contentDetails.upload.videoId
                                )
                              }
                            >
                              Delete
                            </button>
                            <ReplyForm
                              commentId={comment.id}
                              onReplyAdded={() =>
                                handleCommentAdded(
                                  activity.contentDetails.upload.videoId
                                )
                              }
                            />
                            {comment.replies && (
                              <ul>
                                {comment.replies.comments.map((reply) => (
                                  <li key={reply.id}>
                                    <p>
                                      <strong>
                                        {reply.snippet.authorDisplayName}:
                                      </strong>{" "}
                                      {reply.snippet.textOriginal}
                                    </p>
                                    <button
                                      onClick={() =>
                                        handleDeleteComment(
                                          reply.id,
                                          activity.contentDetails.upload.videoId
                                        )
                                      }
                                    >
                                      Delete
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        )
                      )}
                    </ul>
                  </>
                )}
              </li> */}
            </>
          ))}
        </ul>
      </Container>
    </ThemeProvider>
  );
};

export default Home;

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// import CommentForm from "./CommentForm";
// import ReplyForm from "./ReplyForm";
// import { useNavigate } from "react-router-dom";
// import { fDate } from "../utils/formatTime";

// const Home = () => {
//   const [activities, setActivities] = useState([]);
//   const [comments, setComments] = useState({});
//   const navigate = useNavigate();
//   const handleLogout = () => {
//     // Clear user session (e.g., remove tokens from localStorage)
//     localStorage.removeItem("userToken");
//     // Redirect to login page
//     navigate("/login");
//   };

//   useEffect(() => {
//     const fetchActivities = async () => {
//       const token = localStorage.getItem("userToken");
//       const response = await axios.get("http://localhost:5000/activities", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setActivities(response.data.items);

//       // Fetch comments for each activity
//       const commentsData = {};
//       for (const activity of response.data.items) {
//         const upload = activity.contentDetails.upload;
//         if (upload) {
//           const videoId = upload.videoId;
//           const commentsResponse = await axios.get(
//             `http://localhost:5000/comments?videoId=${videoId}`,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );
//           commentsData[videoId] = commentsResponse.data.items;
//         }
//       }
//       setComments(commentsData);
//     };
//     fetchActivities();
//   }, []);

//   const handleCommentAdded = (newComment) => {
//     const videoId = newComment.snippet.videoId;
//     setComments((prevComments) => ({
//       ...prevComments,
//       [videoId]: [...(prevComments[videoId] || []), newComment],
//     }));
//   };

//   const handleReplyAdded = (newReply) => {
//     const parentId = newReply.snippet.parentId;
//     const videoId = newReply.snippet.videoId;
//     setComments((prevComments) => ({
//       ...prevComments,
//       [videoId]: prevComments[videoId]?.map((comment) =>
//         comment.id === parentId
//           ? {
//               ...comment,
//               replies: {
//                 comments: [...(comment.replies?.comments || []), newReply],
//               },
//             }
//           : comment
//       ),
//     }));
//   };

//   const handleDeleteComment = async (commentId, videoId) => {
//     const token = localStorage.getItem("userToken");
//     await axios.delete(`http://localhost:5000/comments/${commentId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     setComments((prevComments) => ({
//       ...prevComments,
//       [videoId]: prevComments[videoId]?.filter(
//         (comment) => comment.id !== commentId
//       ),
//     }));
//   };

//   return (
//     <div>
//       <h1>Activities</h1>
//       <div>
//         <button onClick={handleLogout}>Logout</button>
//       </div>
//       <ul>
//         {activities.map((activity) => (
//           <li key={activity.id}>
//             <h2>{activity.snippet.title}</h2>
//             <p>Published At {fDate(activity.snippet.publishedAt)}</p>
//             {activity.contentDetails.upload && (
//               <>
//                 <CommentForm
//                   videoId={activity.contentDetails.upload.videoId}
//                   onCommentAdded={handleCommentAdded}
//                 />
//                 <ul>
//                   {comments[activity.contentDetails.upload.videoId]?.map(
//                     (comment) => (
//                       <li key={comment.id}>
//                         <p>
//                           <strong>
//                             {
//                               comment.snippet.topLevelComment.snippet
//                                 .authorDisplayName
//                             }
//                             :
//                           </strong>{" "}
//                           {comment.snippet.topLevelComment.snippet.textOriginal}
//                         </p>
//                         <button
//                           onClick={() =>
//                             handleDeleteComment(
//                               comment.id,
//                               activity.contentDetails.upload.videoId
//                             )
//                           }
//                         >
//                           Delete
//                         </button>
//                         <ReplyForm
//                           commentId={comment.id}
//                           onReplyAdded={() =>
//                             handleCommentAdded(
//                               activity.contentDetails.upload.videoId
//                             )
//                           }
//                         />
//                         {comment.replies && (
//                           <ul>
//                             {comment.replies.comments.map((reply) => (
//                               <li key={reply.id}>
//                                 <p>
//                                   <strong>
//                                     {reply.snippet.authorDisplayName}:
//                                   </strong>{" "}
//                                   {reply.snippet.textOriginal}
//                                 </p>
//                                 <button
//                                   onClick={() =>
//                                     handleDeleteComment(
//                                       reply.id,
//                                       activity.contentDetails.upload.videoId
//                                     )
//                                   }
//                                 >
//                                   Delete
//                                 </button>
//                               </li>
//                             ))}
//                           </ul>
//                         )}
//                       </li>
//                     )
//                   )}
//                 </ul>
//               </>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Home;
