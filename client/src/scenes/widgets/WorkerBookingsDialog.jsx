import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useSelector, useDispatch } from "react-redux";
import FlexBetween from "components/FlexBetween";
import { Typography, Box } from "@mui/material";
import { setBooking } from "state";

export default function WorkerJobDialog({
  jobId,
  workerName,
  serviceName,
  price,
  status,
}) {
  const [open, setOpen] = React.useState(false);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user)

  const handleJobComplete = async () => {
    try {
      const response = await fetch(`/${user.id}/complete_booking/${jobId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      const resp = await response.json();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        VIEW JOB DETAILS
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            handleJobComplete();
            handleClose();
          },
        }}
      >
        <DialogTitle>Job Details</DialogTitle>
        <DialogContent>
          <FlexBetween gap="5rem" className="m-2 p-2">
            <Box>
              <Typography
                className="p-1 border-b-2"
                sx={{ fontSize: "1rem", color: "Highlight" }}
              >
                Service
              </Typography>
              <Typography className="pb-2" sx={{ fontSize: "1rem" }}>
                {serviceName}
              </Typography>
            </Box>
            <Box>
              <Typography
                className="p-1 border-b-2"
                sx={{ fontSize: "1rem", color: "Highlight" }}
              >
                Worker
              </Typography>
              <Typography className="pb-2" sx={{ fontSize: "1rem" }}>
                {workerName}
              </Typography>
            </Box>
          </FlexBetween>
          <Box fullWidth sx={{ justifyContent: "center", display: "flex" }}>
            <Typography
              className="p-1 border-b-2"
              sx={{ fontSize: "1rem", color: "Highlight" }}
            >
              Total Price:&nbsp;
            </Typography>
            <Typography className="pt-1" sx={{ fontSize: "1rem" }}>
              KSH. {price}
            </Typography>
          </Box>
          <Box fullWidth sx={{ justifyContent: "center", display: "flex" }}>
            <Typography
              className="p-1 border-b-2"
              sx={{ fontSize: "1rem", color: "Highlight" }}
            >
              Status:&nbsp;
            </Typography>
            <Typography className="pt-1" sx={{ fontSize: "1rem" }}>
              {status}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
            <FlexBetween className="w-[100%]">
              <Button sx={{ color: "green" }} onClick={handleClose}>
                Close
              </Button>
              <Button
                disabled={status === "completed"}
                sx={{
                  color: "white",
                  fontSize: "1rem",
                  backgroundColor: "Highlight",
                  "&:hover": { opacity: "70%", backgroundColor: "Highlight" },
                  "&.Mui-disabled": {
                    color: "rgba(0, 0, 0, 0.26)",
                    borderColor: "rgba(0, 0, 0, 0.26)",
                    backgroundColor: "rgba(0, 0, 0, 0.12)",
                  },
                }}
                type="submit"
              >
                MARK AS COMPLETED
              </Button>
            </FlexBetween>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
