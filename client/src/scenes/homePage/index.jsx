import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Orders from "scenes/widgets/Bookings";
import AppAppBar from "components/AppAppBar";
import Hero from "components/Hero";
import Highlights from "components/Highlights";
import Footer from "components/Footer";
import {
  Typography,
  InputBase,
  InputLabel
} from "@mui/material";
import Testimonials from "components/Testimonials";
import FAQ from "components/FAQ";
const HomePage = () => {
  const user = useSelector((state) => state.user)

  return (
    <Box>
      <AppAppBar />
      <Box className="mt-[100px] p-2 flex justify-center"
      fullWidth
      >
        <Typography className="pr-5 m-2 font-bold text-3xl"
        sx={{
          fontSize: "2rem",
          fontWeight: "bold",
          color: "Highlight"
        }}
        >
          Karibu,&nbsp;{user.firstname}
        </Typography>
        <InputBase type="search" placeholder="Search Services"
        className="m-2 py-2 px-5 rounded-full"
        sx={{
          width: "50%",
          border: "2px solid gray",
          float: "left",
        }}
        />
      </Box>
      <Orders />
      <Highlights />
      <Testimonials />
      <FAQ />
      <Footer />
    </Box>
  );
};

export default HomePage;
