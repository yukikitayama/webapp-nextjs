import { Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import CreateTask from "../../components/project/create-task";
import Board from "../../components/project/board";
import CreateTaskDialog from "../../components/project/create-task-dialog";
import UpdateTaskDialog from "../../components/project/update-task-dialog";
import { produceLogToKafka } from "../../helper/kafka-util";

const ProjectPage = () => {
  const router = useRouter();

  useEffect(() => {
    produceLogToKafka(router.pathname);
  }, [router.pathname]);

  return (
    <Fragment>
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
      <CreateTaskDialog />
      <UpdateTaskDialog />
    </Fragment>
  );
};

export default ProjectPage;
