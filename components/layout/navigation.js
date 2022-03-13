import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Drawer,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const pages = ["article", "expense", "fitness", "login"];
const drawerItems = ["Home", "Article", "Expense", "Fitness", "Login"];

function Navigation() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setIsDrawerOpen(open);
  };

  // Function to programmatically navigate a user to a page
  // when an item in drawer side-menu is clicked
  const drawerNavigateToPageHandler = (event) => {
    const page = event.target.textContent;
    if (page === "Home") {
      router.push("/");
    } else {
      router.push(`/${page.toLowerCase()}`);
    }
  };

  // Left side-drawer content when drawer is open
  const drawerList = (
    <Box
      sx={{ width: 200 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {drawerItems.map((text, index) => (
          <ListItem disablePadding key={text}>
            <ListItemButton
              onClick={(event) => drawerNavigateToPageHandler(event)}
            >
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky">
      <Toolbar>
        <IconButton
          onClick={toggleDrawer(true)}
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { xs: "block", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Link href="/" passHref>
          <Typography
            variant="h6"
            component="a"
            sx={{ mr: 2, display: "flex" }}
          >
            Yuki&apos;s Web App
          </Typography>
        </Link>

        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
          {pages.map((page) => (
            <Link key={page} href={`/${page}`} passHref>
              <Button sx={{ my: 2, color: "white", display: "block" }}>
                {page}
              </Button>
            </Link>
          ))}
        </Box>
        <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
          {drawerList}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;
