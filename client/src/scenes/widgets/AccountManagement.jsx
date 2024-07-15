import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FlexBetween from "components/FlexBetween";
import { Box } from "@mui/material";
import { Settings } from "@mui/icons-material";
import { EditOutlined } from "@mui/icons-material";
import Divider from "@mui/material/Divider";
import { updateUser } from "state";
import PaymentMethods from "./AddPaymentMethod";

const EditableTextField = ({ label, initialValue, onUpdate }) => {
  const [isDisabled, setIsDisabled] = React.useState(true);
  const [showEditIcon, setShowEditIcon] = React.useState(true);
  const [value, setValue] = React.useState(initialValue);
  const inputRef = React.useRef(null);

  const handleEditClick = () => {
    setIsDisabled(false);
    setShowEditIcon(false);
    setTimeout(() => inputRef.current && inputRef.current.focus(), 0); // Ensures the focus is set after the state update
  };

  const handleBlur = () => {
    setIsDisabled(true);
    setShowEditIcon(true);
    onUpdate(value); // Notify parent component of the updated value
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <FlexBetween>
      <TextField
        margin="dense"
        id={label}
        label={label}
        fullWidth
        variant="outlined"
        value={value}
        disabled={isDisabled}
        sx={{ outline: "none" }}
        inputRef={inputRef}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      {showEditIcon && (
        <EditOutlined cursor="pointer" onClick={handleEditClick} />
      )}
    </FlexBetween>
  );
};

export default function ManageAccount() {
  const [open, setOpen] = React.useState(false);
  const [updatedUser, setUpdatedUser] = React.useState({});
  const user = useSelector((state) => state.user); // Adjust according to your slice
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token); // Adjust according to your slice

  const handleManageAccount = async () => {
    // Prepare updated user data for API call
    const updatedData = { ...updatedUser };
    delete updatedData.paymentMethods; // Exclude payment methods from the update
    console.log(updatedData);
    try {
      const response = await fetch(`/users/${user.id}/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      dispatch(updateUser(updatedData));
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await handleManageAccount();
    handleClose();
  };

  const handleUpdateField = (fieldName, newValue) => {
    // Update local state with new value
    setUpdatedUser((prevUser) => ({
      ...prevUser,
      [fieldName]: newValue,
    }));
  };

  return (
    <React.Fragment>
      <Settings
        onClick={handleClickOpen}
        sx={{
          cursor: "pointer",
        }}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Manage Account</DialogTitle>
		<h1 className="font-bold text-lg text-center" >Personal Details</h1>
        <DialogContent>
          <EditableTextField
            label="Email Address"
            initialValue={user.email}
            onUpdate={(value) => handleUpdateField("email", value)}
          />
          <FlexBetween gap="1rem">
            <EditableTextField
              label="First Name"
              initialValue={user.firstname}
              onUpdate={(value) => handleUpdateField("firstname", value)}
            />
            <EditableTextField
              label="Last Name"
              initialValue={user.lastname}
              onUpdate={(value) => handleUpdateField("lastname", value)}
            />
          </FlexBetween>
          <FlexBetween>
            <EditableTextField
              label="Location"
              initialValue={user.location}
              onUpdate={(value) => handleUpdateField("location", value)}
            />
            <EditableTextField
              label="Phone Number"
              initialValue={user.phone}
              onUpdate={(value) => handleUpdateField("phone", value)}
            />
          </FlexBetween>
          {user.type == "client" && (
            <Box>
              <Divider />
              <PaymentMethods />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <FlexBetween className="w-[100%] font-bold text-md">
            <Box>
              <Button sx={{ color: "green" }} onClick={handleClose}>
                Close
              </Button>
              <Button
                sx={{
                  color: "white",
                  fontSize: "1rem",
                  backgroundColor: "Highlight",
                  "&:hover": {
                    opacity: "70%",
                    backgroundColor: "Highlight",
                  },
                  "&.Mui-disabled": {
                    color: "rgba(0, 0, 0, 0.26)",
                    borderColor: "rgba(0, 0, 0, 0.26)",
                    backgroundColor: "rgba(0, 0, 0, 0.12)",
                  },
                }}
                type="submit"
              >
                SAVE CHANGES
              </Button>
            </Box>
          </FlexBetween>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
