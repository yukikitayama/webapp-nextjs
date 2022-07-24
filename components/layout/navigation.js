import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";

import ThemeToggle from "./theme-toggle";
import pixel from "../../styles/pixel-me.module.css";

const pages = ["project", "article", "expense", "fitness", "login"];
const drawerItems = ["Home", "Project", "Article", "Expense", "Fitness", "Login"];

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
          sx={{ display: { xs: "block", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <div className={pixel["pixel-art-container"]}>
          <div className={pixel["pixel-me"]}></div>
        </div>

        <Link href="/" passHref>
          <Typography
            variant="h6"
            component="a"
            // sx={{ mr: 2, display: "flex" }}
            sx={{
              mr: 2,
              ml: 2,
              display: "flex",
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "15px",
            }}
            // sx={{ mr: 1, display: "flex", fontFamily: "'VT323', monospace", fontSize: "30px" }}
          >
            {/* Yuki&apos;s */}
            {/* Yuki&apos;s Web App */}
            Yuki&apos;s App
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

        <ThemeToggle />
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;
