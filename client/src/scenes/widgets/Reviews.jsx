import { Box, Typography, Divider, Grid } from "@mui/material";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Rating from "@mui/material/Rating";
import Title from "./Title";
import { setReviews } from "state"; // Adjust the import path as needed

const ReviewsWidget = () => {
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const reviews = useSelector((state) => state.reviews);
  const dispatch = useDispatch();

  const getReviews = async () => {
    try {
      const response = await fetch(`/workers/${user.id}/reviews`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const resp = await response.json();
      dispatch(setReviews({ reviews: resp }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getReviews();
  }, [user.id, token]); // Fetch reviews when component mounts or when user.id or token changes

  return (
    <Box>
      <Title>Ratings & Reviews</Title>
      <Divider />
      {!reviews || reviews.length === 0 ? (
        <Typography className="m-2 p-2" textAlign="center">
          No Reviews yet
        </Typography>
      ) : (
        <Box>
          {reviews.map((review, index) => (
            <Box key={index} sx={{ my: 2, p: 2, border: "1px solid #ccc", borderRadius: 4 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6">{review.client_name}</Typography>
                </Grid>
				<Grid item xs={12}>
                  <Typography>{review.comment}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Rating name="read-only" value={review.rating} readOnly />
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ReviewsWidget;
