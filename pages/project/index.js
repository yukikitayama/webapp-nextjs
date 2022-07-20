import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import CreateTask from "../../components/project/create-task";
import Board from "../../components/project/board";

const ProjectPage = () => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="stretch"
    >
      <Grid item pb={2}>
        <Typography variant="h2" component="div" align="center">
          Project
        </Typography>
      </Grid>
      <Grid item pb={2}>
        <CreateTask />
      </Grid>
      <Grid item>
        <Board />
      </Grid>
    </Grid>
  );
};

export default ProjectPage;
