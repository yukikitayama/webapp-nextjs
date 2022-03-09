import Link from "next/link";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";

const pages = ["article", "expense", "fitness", "login"];

function Navigation() {
  return (
    <AppBar position="static">
      <Toolbar>
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
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;
