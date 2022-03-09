import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";

const pages = ["Article", "Expense", "Fitness", "Login"];

function Navigation() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ mr: 2, display: 'flex' }}>
          Yuki&apos;s Web App
        </Typography>
        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
          {pages.map((page) => (
            <Button key={page} sx={{ my: 2, color: "white", display: "block" }}>
              {page}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;
