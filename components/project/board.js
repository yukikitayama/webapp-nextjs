import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

const Board = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }} variant="outlined" square>TO DO</Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }} variant="outlined" square>IN PROGRESS</Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }} variant="outlined" square>DONE</Paper>
      </Grid>
    </Grid>
  );
};

export default Board;