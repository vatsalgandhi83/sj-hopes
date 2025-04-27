import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  useTheme,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Home,
  Login,
  Logout,
  People,
  ListAlt,
  Business,
  Task,
} from "@mui/icons-material";
import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
  isLoggedIn?: boolean;
  onLoginClick?: () => void;
  userType?: "caseworker" | "admin";
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  isLoggedIn,
  onLoginClick,
  userType,
  onLogout,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <AppBar
        position="sticky"
        color="default"
        elevation={1}
        sx={{
          background: "linear-gradient(90deg, #1a237e 0%, #283593 100%)",
          color: "white",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 4 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              edge="start"
              color="inherit"
              component={Link}
              href="/"
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <Home />
            </IconButton>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                background: "linear-gradient(45deg, #fff 30%, #e3f2fd 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              SJ Hopes
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                display: { xs: "none", sm: "block" },
              }}
            >
              | Housing & Homeless Services
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isLoggedIn ? (
              <>
                {/* Shelters Tab (Admin only) */}
                {userType === "admin" && (
                  <Button
                    color="inherit"
                    startIcon={<Business />}
                    component={Link}
                    href="/admin/shelters"
                    sx={{ textTransform: "none" }}
                  >
                    Shelters
                  </Button>
                )}
                {/* Clients Tab (Caseworker only) */}
                {userType === "caseworker" && (
                  <Button
                    color="inherit"
                    startIcon={<People />}
                    component={Link}
                    href="/clients"
                    sx={{ textTransform: "none" }}
                  >
                    Clients
                  </Button>
                )}
                {userType === "caseworker" && (
                  <Button
                    color="inherit"
                    startIcon={<ListAlt />}
                    component={Link}
                    href="/opportunities"
                    sx={{ textTransform: "none" }}
                  >
                    Opportunities
                  </Button>
                )}
                {userType === "admin" && (
                  <Button
                    color="inherit"
                    startIcon={<Task />}
                    component={Link}
                    href="/admin/opportunities"
                    sx={{ textTransform: "none" }}
                  >
                    Work Opportunities
                  </Button>
                )}
                <IconButton
                  color="inherit"
                  onClick={handleMenuClick}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  <Logout />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      borderRadius: 2,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <MenuItem onClick={handleLogout}>
                    <Logout fontSize="small" sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                startIcon={<Login />}
                onClick={onLoginClick}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  "&:hover": {
                    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                  },
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 4,
          px: 2,
          mt: "auto",
          background: "linear-gradient(90deg, #1a237e 0%, #283593 100%)",
          color: "white",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              © {new Date().getFullYear()} SJ Hopes. All rights reserved.
            </Typography>
            <Box sx={{ display: "flex", gap: 3 }}>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                About
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                Contact
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                Privacy Policy
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
