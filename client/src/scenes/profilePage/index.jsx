import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import UserWidget from "scenes/widgets/UserWidget";
import AppAppBar from "components/AppAppBar";
import Bookings from "scenes/widgets/Bookings";
import FlexBetween from "components/FlexBetween";
import AvailableJobs from "scenes/widgets/AvailableJobs";
import ReviewsWidget from "scenes/widgets/Reviews";
import { updateUser, setReviews } from "state";

const ProfilePage = () => {
  const currentUser = useSelector((state) => state.user);
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const dispatch = useDispatch();
  const [errors, setErrors] = useState(null);

  const getUser = async () => {
    const response = await fetch(`/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    console.log(data);
    setUser(data);
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/workers/${userId}/reviews`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = response.json();
        throw new Error(errorData.error);
      }
      const resp = await response.json();
      dispatch(
        setReviews({
          reviews: resp,
        })
      );
    } catch (error) {
      setErrors(error.message);
    }
  };

  useEffect(() => {
    getUser();
    fetchReviews();
  }, [userId, token, dispatch, setReviews, setErrors]); // Fetch user when userId or token changes

  useEffect(() => {
    if (currentUser.id === userId && user) {
      dispatch(
        updateUser({
          user: user,
        })
      );
    }
  }, [user, currentUser.id, userId, dispatch]); // Update user in store when user state changes

  if (!user) return null; // Return null while waiting for user data

  const showBookings = currentUser.id === user.id;
  const showJobs = currentUser.type === 'worker' 
  const showReviews = user.type === "worker";

  return (
    <FlexBetween>
      <AppAppBar />
      <Box
        mt="100px"
        width="100%"
        padding="2rem"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent={showBookings && showReviews ? "flex-start" : "center"}
      >
        <Box
          width={showBookings && showReviews ? "auto" : "50%"}
          display="flex"
          justifyContent="center"
        >
          <UserWidget userId={user.id} user={user} />
        </Box>

        <Box className="flex flex-col gap-10">
          {showBookings && <Bookings />}
          {showJobs && <AvailableJobs />}
        </Box>

        {showReviews && (
          <Box width={showBookings && showReviews ? "auto" : "50%"}>
            <ReviewsWidget />
          </Box>
        )}
      </Box>
    </FlexBetween>
  );
};

export default ProfilePage;
