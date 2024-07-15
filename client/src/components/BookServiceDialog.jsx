import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useSelector } from "react-redux";
import { setBooking } from "state";
import { useNavigate } from "react-router-dom";

export default function FormDialog({ serviceId, serviceName }) {
  const [open, setOpen] = React.useState(false);
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const navigate = useNavigate()

  const handleBooking = async (event) => {
    const data = new FormData(event.currentTarget);
    const req = {
      serviceId: data.get('serviceId'),
      date: data.get('date')
    };
    try {
      const response = await fetch(`/bookings/${user.id}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(req)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      const resp = await response.json();
      setBooking(resp);
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

  const getMinDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  };
  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today.setFullYear(today.getFullYear() + 1));
    const day = String(maxDate.getDate()).padStart(2, '0');
    const month = String(maxDate.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = maxDate.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={() => user !== null ? handleClickOpen() : navigate('/auth/login')}>
        BOOK
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            handleBooking(event);
            handleClose();
          },
        }}
      >
        <DialogTitle>Book a Service with Us</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          <TextField
            required
            margin="dense"
            id="email"
            name="serviceId"
            value={serviceId}
            label={serviceName}
            type="hidden"
            fullWidth
            variant="standard"
            sx={{
              fontSize: "2rem"
            }}
          />
          <input
            type="date"
            required
            min={getMinDate()}
            max={getMaxDate()}
            name="date"
            id="date"
            className="w-[100%] p-4 border-2 outline-none"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
