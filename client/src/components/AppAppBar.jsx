import * as React from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "state";
import { useNavigate } from "react-router-dom";

function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const isLoggedIn = user !== null;

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const scrollToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: "smooth" });
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
      setOpen(false);
    }
  };

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: "transparent",
          backgroundImage: "none",
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            variant="regular"
            sx={(theme) => ({
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
              borderRadius: "999px",
              bgcolor:
                theme.palette.mode === "light"
                  ? "rgba(255, 255, 255, 0.4)"
                  : "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(24px)",
              maxHeight: 40,
              border: "1px solid",
              borderColor: "divider",
              boxShadow:
                theme.palette.mode === "light"
                  ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                  : "0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)",
            })}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                ml: "-18px",
                px: 0,
              }}
            >
              <Link
                className="m-2 p-5"
                href="/dashboard"
                sx={{
                  fontWeight: "bold",
                  color: "Highlight",
                  fontSize: "1.5rem",
                  textDecoration: "none",
                }}
              >
                CleanPro Services
              </Link>
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <MenuItem
                  onClick={() => navigate("/dashboard")}
                  sx={{ py: "6px", px: "12px" }}
                >
                  <Typography variant="body2" color="text.primary">
                    Dashboard
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    if (
                      window.location.pathname !== "/" &&
                      window.location.pathname !== "/dashboard"
                    ) {
                      navigate("/dashboard");
                    } else {
                      scrollToSection("services");
                    }
                  }}
                  sx={{ py: "6px", px: "12px" }}
                >
                  <Typography variant="body2" color="text.primary">
                    Services
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    if (
                      window.location.pathname !== "/" &&
                      window.location.pathname !== "/dashboard"
                    ) {
                      navigate("/dashboard");
                    } else {
                      scrollToSection("testimonials");
                    }
                  }}
                  sx={{ py: "6px", px: "12px" }}
                >
                  <Typography variant="body2" color="text.primary">
                    Testimonials
                  </Typography>
                </MenuItem>
                {user && user.type === "worker" && (
                  <MenuItem
                    onClick={() => {
                      if (
                        window.location.pathname !== "/" &&
                        window.location.pathname !== "/dashboard"
                      ) {
                        navigate("/dashboard");
                      } else {
                        scrollToSection("highlights");
                      }
                    }}
                    sx={{ py: "6px", px: "12px" }}
                  >
                    <Typography variant="body2" color="text.primary">
                      Job Listings
                    </Typography>
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => {
                    if (
                      window.location.pathname !== "/" &&
                      window.location.pathname !== "/dashboard"
                    ) {
                      navigate("/dashboard");
                    } else {
                      scrollToSection("faq");
                    }
                  }}
                  sx={{ py: "6px", px: "12px" }}
                >
                  <Typography variant="body2" color="text.primary">
                    FAQ
                  </Typography>
                </MenuItem>
              </Box>
            </Box>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 0.5,
                alignItems: "center",
              }}
            >
              {!isLoggedIn ? (
                <>
                  <Button
                    color="primary"
                    variant="text"
                    size="small"
                    component="a"
                    href="/auth/login"
                  >
                    Sign in
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    size="small"
                    component="a"
                    href="/auth/signup"
                  >
                    Sign up
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="flex flex-col font-bold"
                    color="primary"
                    variant="contained"
                    size="small"
                    component="a"
                    href={`/profile/${user.id}`}
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    Account
                    <div className="text-xs bg-gray-300 px-2 rounded-full font-bold">
                      {user ? user.type : ""}
                    </div>
                  </Button>
                  <Button
                    color="error"
                    variant="contained"
                    size="small"
                    onClick={() => dispatch(setLogout())}
                  >
                    Logout
                  </Button>
                </>
              )}
            </Box>
            <Box sx={{ display: { sm: "", md: "none" } }}>
              <Button
                variant="text"
                color="primary"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ minWidth: "30px", p: "4px" }}
              >
                <MenuIcon />
              </Button>
              <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <Box
                  sx={{
                    minWidth: "60dvw",
                    p: 2,
                    backgroundColor: "background.paper",
                    flexGrow: 1,
                    gap: "10px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "end",
                      flexGrow: 1,
                    }}
                  ></Box>
                  <MenuItem
                    onClick={() => navigate("/dashboard")}
                    color="text.primary"
                    variant="body2"
                  >
                    <Typography variant="body2" color="text.primary">
                      Dashboard
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      if (
                        window.location.pathname !== "/" &&
                        window.location.pathname !== "/dashboard"
                      ) {
                        navigate("/dashboard");
                      } else {
                        scrollToSection("services");
                      }
                    }}
                  >
                    Services
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      if (
                        window.location.pathname !== "/" &&
                        window.location.pathname !== "/dashboard"
                      ) {
                        navigate("/dashboard");
                      } else {
                        scrollToSection("testimonials");
                      }
                    }}
                  >
                    Testimonials
                  </MenuItem>
                  {user && user.type === "worker" && (
                    <MenuItem
                      onClick={() => {
                        if (
                          window.location.pathname !== "/" &&
                          window.location.pathname !== "/dashboard"
                        ) {
                          navigate("/dashboard");
                        } else {
                          scrollToSection("jobs");
                        }
                      }}
                    >
                      Job Listings
                    </MenuItem>
                  )}
                  <MenuItem
                    onClick={() => {
                      if (
                        window.location.pathname !== "/" &&
                        window.location.pathname !== "/dashboard"
                      ) {
                        navigate("/dashboard");
                      } else {
                        scrollToSection("faq");
                      }
                    }}
                  >
                    FAQ
                  </MenuItem>
                  <Divider />
                  <MenuItem>
                    {!isLoggedIn ? (
                      <>
                        <Button
                          color="primary"
                          variant="text"
                          size="small"
                          component="a"
                          href="/auth/login"
                        >
                          Sign in
                        </Button>
                        <Button
                          color="primary"
                          variant="contained"
                          size="small"
                          component="a"
                          href="/auth/signup"
                        >
                          Sign up
                        </Button>
                      </>
                    ) : (
                      <div className="flex flex-col w-[100%]">
                        <Button
                          color="primary"
                          variant="contained"
                          size="small"
                          component="a"
                          href={`/profile/${user.id}`}
                          sx={{
                            margin: "5px",
                            padding: "5px",
                          }}
                        >
                          Account
                        </Button>
                        <Button
                          color="error"
                          variant="contained"
                          size="small"
                          onClick={() => dispatch(setLogout())}
                          sx={{
                            margin: "5px",
                            padding: "5px",
                          }}
                        >
                          Logout
                        </Button>
                      </div>
                    )}
                  </MenuItem>
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}

AppAppBar.propTypes = {
  mode: PropTypes.oneOf(["dark", "light"]).isRequired,
  toggleColorMode: PropTypes.func.isRequired,
};

export default AppAppBar;
