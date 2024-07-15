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
import { setJobs } from "state";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@mui/material";
import { useEffect } from "react";

export default function AvailableJobs() {
  const token = useSelector((state) => state.token);
  const jobs = useSelector((state) => state.jobs);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

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
        const response = await fetch(`/available_jobs`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }
        const resp = await response.json();
        dispatch(setJobs({ jobs: resp }));
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, [token, dispatch]);

  const handleApply = async (jobId) => {
    try {
      const response = await fetch(`/${user.id}/apply_booking/${jobId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      const resp = await response.json();
      // Optionally update state or handle response
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Box>
      <Title>Available Jobs</Title>
      <Divider />
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Service Name</TableCell>
            <TableCell align="center">Pricing (KSH)</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        {!jobs || jobs.length === 0 ? (
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={5}
                className="m-2 p-2"
                sx={{ textAlign: "center" }}
              >
                No Jobs Available
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {jobs.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.date}</TableCell>
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
                  {titleCase(row.service_name)}
                </TableCell>
                <TableCell align="center">{`${row.price}`}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleApply(row.id)} // Pass a function reference here
                    sx={{
                      backgroundColor: "#00D5FA",
                      color: "black",
                    }}
                  >
                    APPLY
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </Box>
  );
}
