import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import Board from "../../components/project/board";

const ProjectPage = () => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Grid item>
        <Typography variant="h2" component="div" align="center">
          Project
        </Typography>
      </Grid>
      <Grid item>
        <Board />
      </Grid>
    </Grid>
  );
};

export default ProjectPage;
