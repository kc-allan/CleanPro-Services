import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import { AddCircleOutline, Close, CloseOutlined } from "@mui/icons-material";
import { updateUser } from "state";
import { Typography, Divider } from "@mui/material";
import FlexBetween from "components/FlexBetween";

const PaymentMethods = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    cardNumber: "",
    cardHolder: "",
  });
  const token = useSelector((state) => state.token);
  const [errors, setErrors] = useState(null);
  const [message, setMessage] = useState(null);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleAddPaymentMethod = async () => {
    console.log(user);
    const updatedUser = {
      ...user,
      paymentMethods: [...user.paymentMethods, newPaymentMethod],
    };
    try {
      const response = await fetch(`/payments/${user.id}/add_method`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPaymentMethod),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      const resp = await response.json();
      dispatch(updateUser(updatedUser));
      setShowAddForm(false);
      setMessage(resp.message);
    } catch (error) {
      setErrors(error.message);
      setTimeout(() => {
        setErrors(null);
      }, 3000);
    }
    setNewPaymentMethod({ cardNumber: "", cardHolder: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPaymentMethod((prevMethod) => ({
      ...prevMethod,
      [name]: value,
    }));
  };
  const handleRemoveMethod = async (id) => {
    try {
      const response = await fetch(`/payments/${user.id}/delete_method/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = response.json();
        throw new Error(errorData.error);
      }
      const resp = await response.json();
      setMessage(resp.message);
    } catch (error) {
      setErrors(error.message);
    }
  };

  return (
    <Box mt={4}>
      {message && (
        <Box className="bg-green-400 m-2 p-2 text-white font-bold text-center rounded-sm">
          {message}
        </Box>
      )}
      {errors && (
        <Box className="bg-red-400 m-2 p-2 text-white font-bold text-center rounded-sm">
          {errors}
        </Box>
      )}
      <Button
        variant="outlined"
        onClick={() => setShowAddForm(!showAddForm)}
        sx={{ mb: 2 }}
      >
        {showAddForm ? "Cancel Adding" : "Add Payment Method"}
      </Button>
      {showAddForm && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="cardNumber"
              label="Card Number"
              variant="outlined"
              fullWidth
              value={newPaymentMethod.cardNumber}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="cardHolder"
              label="Card Holder"
              variant="outlined"
              fullWidth
              value={newPaymentMethod.cardHolder}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddPaymentMethod}
              startIcon={<AddCircleOutline />}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      )}
      {user.paymentMethods && user.paymentMethods.length > 0 && (
        <Box>
          <h1 className="font-bold text-lg text-center mb-2">
            Payment Methods
          </h1>
          {user.paymentMethods.map((method) => (
            <>
              <Divider />
              {method.default}
              {method.default && (
                <h1 className="text-center text-xs font-bold text-green-500">
                  default
                </h1>
              )}
              <FlexBetween className="m-2">
                <Box className="flex items-center gap-2">
                  <h1 className="text-xs font-bold">Card Holder</h1>
                  <Typography className="m-1 p-1 border-dashed border-2">
                    {method.account_holder_name}
                  </Typography>
                </Box>
                <Box className="flex items-center gap-2">
                  <h1 className="text-xs font-bold">Account Number</h1>
                  <Typography className="m-1 p-1 border-dashed border-2">
                    {method.account_number}
                  </Typography>
                  <CloseOutlined
                    onClick={() => handleRemoveMethod(method.id)}
                    sx={{
                      color: "red",
                      cursor: "pointer",
                    }}
                  />
                </Box>
              </FlexBetween>
            </>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PaymentMethods;
