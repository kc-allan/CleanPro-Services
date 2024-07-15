import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useState, useEffect } from "react";
import FormDialog from "./BookServiceDialog";
import FlexBetween from "./FlexBetween";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";

function createData(id, name, description, price) {
  return { id, name, description, price };
}

const titleCase = (str) => {
  str = str.toLowerCase().split(" ");
  for (let i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(" ");
};
export default function Highlights() {
  const [items, setItems] = useState([]);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/services", {
          method: "GET",
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }
        const resp = await response.json();
        const temp = resp.map((val) =>
          createData(val.id, val.name, val.description, val.price)
        );
        setItems(temp);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, []);
  console.log(items);
  return (
    <Box
      id="services"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: "white",
        bgcolor: "#06090a",
      }}
    >
      <Container
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: "100%", md: "60%" },
            textAlign: { sm: "left", md: "center" },
          }}
        >
          <Typography component="h2" variant="h4">
            Our Services
          </Typography>
          <Typography variant="body1" sx={{ color: "grey.400" }}>
            Explore why our product stands out: adaptability, durability,
            user-friendly design, and innovation. Enjoy reliable customer
            support and precision in every detail.
          </Typography>
        </Box>
        {(user && user.type === "client") || user === null ? (
          <Grid container spacing={2.5}>
            {items.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Stack
                  direction="column"
                  color="inherit"
                  component={Card}
                  spacing={1}
                  useFlexGap
                  sx={{
                    p: 3,
                    height: "100%",
                    border: "1px solid",
                    borderColor: "grey.800",
                    background: "transparent",
                    backgroundColor: "grey.900",
                  }}
                >
                  <div>
                    <FlexBetween>
                      <Typography fontWeight="bold" gutterBottom>
                        {titleCase(item.name)}
                      </Typography>
                      <Typography
                        gutterBottom
                        sx={{
                          color: "#FF5A5F",
                          border: "4px solid #FF5A5F",
                          borderRadius: "50%",
                          minWidth: "60px",
                          height: "60px",
                          fontSize: "20px",
                          textAlign: "center",
                          lineHeight: "60px",
                        }}
                      >
                        KSH. {item.price}/hr
                      </Typography>
                    </FlexBetween>
                    <Typography variant="body2" sx={{ color: "grey.400" }}>
                      {item.description}
                    </Typography>
                  </div>
                  <FormDialog
                    serviceId={item.id}
                    serviceName={titleCase(item.name)}
                  />
                </Stack>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Button
            className="flex flex-col font-bold"
            color="primary"
            variant="contained"
            size="small"
            component="a"
            href={`/profile/${user.id}`}
            sx={{
              fontWeight: "bold",
              padding: "1rem",
              marginTop: "1rem",
            }}
          >
            Check Out Job Listings
          </Button>
        )}
      </Container>
    </Box>
  );
}
