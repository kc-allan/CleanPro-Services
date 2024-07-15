import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import { Divider } from "@mui/material";
import { Typography, Box } from "@mui/material";
import Badge from "@mui/material/Badge";
import { setBookings } from "state";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import ReviewAndPaymentDialog from "./ViewBooking";
import WorkerJobDialog from "./WorkerBookingsDialog";

export default function Bookings() {
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const bookings = useSelector((state) => state.bookings);
  const dispatch = useDispatch();

  const titleCase = (str) => {
    str = str.toLowerCase().split(" ");
    for (let i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(" ");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/bookings/${user.id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }
        const resp = await response.json();
        dispatch(setBookings({ bookings: resp }));
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, [user.id, token, dispatch]);

  return (
    <Box>
      <Title>Recent Bookings</Title>
      <Divider />
      <Table size="small">
        <TableHead className="text-center">
          <TableRow>
            <TableCell>Posted On</TableCell>
            <TableCell>Date Due</TableCell>
            <TableCell>Date Completed</TableCell>
            <TableCell>Worker</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Payment Method</TableCell>
            <TableCell align="center">Pricing (KSH)</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        {(!bookings || bookings.length === 0) ? (
          <TableCell
            colSpan={6}
            className="m-2 p-2"
            sx={{ textAlign: "center" }}
          >
            No Booking History
          </TableCell>
        ) : (
          <TableBody>
            {bookings.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.created_at}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.completed_on ? row.completed_on : '-'}</TableCell>
                <TableCell>
                  {row.worker_id ? row.worker_name : "Not Assigned"}
                </TableCell>
                <TableCell>
                  <Badge
                    color={row.status === "completed" ? "success" : "warning"}
                    variant="dot"
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <Typography
                      className="rounded-full"
                      sx={{
                        backgroundColor: "gray",
                        width: "100px",
                        textAlign: "center",
                        color: "white",
                      }}
                    >
                      {row.status}
                    </Typography>
                  </Badge>
                </TableCell>
                <TableCell align="center">
                  {row.paymentMethod ? row.paymentMethod : "None"}
                </TableCell>
                <TableCell align="center">{`${row.price}`}</TableCell>
                <TableCell align="center">
                  {user.type === 'client' ? (
                    <ReviewAndPaymentDialog
                      bookingId={row.id}
                      workerName={row.worker_name ? row.worker_name : 'Not Assigned'}
                      serviceName={titleCase(row.service_name)}
                      price={row.price}
                      status={row.status}
                      paymentMethod={user.paymentMethods}
                    />
                  ) : (
                    <WorkerJobDialog
                      serviceName={row.service_name}
                      workerName="Assigned to You"
                      jobId={row.id}
                      status={row.status}
                      price={row.price}
                      onJobComplete={(updatedBooking) => {
                        dispatch(setBookings({
                          bookings: bookings.map(booking => 
                            booking.id === updatedBooking.id ? updatedBooking : booking
                          )
                        }));
                      }}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </Box>
  );
}
