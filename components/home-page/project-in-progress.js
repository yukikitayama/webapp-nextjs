import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";

import TaskCard from "../project/task-card";

function ProjectInProgress() {
  const [isLoading, setIsLoading] = useState(false);
  const [tasksInProgress, setTasksInProgress] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await fetch(`${process.env.apiGatewayUrl}/project`);
      const data = await response.json();
      setTasksInProgress(
        data.filter((element) => element.status === "in progress")
      );
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Typography variant="h2" component="div" align="center">
          Project in Progress
        </Typography>
      </Grid>
      {isLoading && (
        <Grid item>
          <Stack alignItems="center">
            <CircularProgress />
          </Stack>
        </Grid>
      )}
      <Grid item>
        <Grid container justifyContent="center" spacing={2}>
          {!isLoading &&
            tasksInProgress.map((task) => (
              <Grid item key={task.id} xs={12} md={6}>
                <TaskCard task={task} cardType="home" />
              </Grid>
            ))}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ProjectInProgress;
