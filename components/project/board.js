import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";

import TaskCard from "./task-card";

const Board = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const closing = useSelector((state) => state.project.closing);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await fetch(`${process.env.apiGatewayUrl}/project`);
      const data = await response.json();
      setTasks(data);
      setIsLoading(false);
    };

    fetchData();
  }, [closing]);

  return (
    <Grid container spacing={2} direction="row" alignItems="flex-start">
      {isLoading && (
        <Grid item xs={12}>
          <Stack alignItems="center">
            <CircularProgress />
          </Stack>
        </Grid>
      )}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }} square elevation={3}>
          <Alert
            icon={false}
            severity="warning"
            variant="outlined"
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            TO DO
          </Alert>
          {!isLoading && tasks.filter((task) => task.status === "to do").map((task) => (
            <Grid item key={task.id} my={1}>
              <TaskCard task={task} cardType="project"/>
            </Grid>
          ))}
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }} square elevation={3}>
          <Alert
            icon={false}
            severity="info"
            variant="outlined"
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            IN PROGRESS
          </Alert>
          {!isLoading &&
            tasks
              .filter((task) => task.status === "in progress")
              .map((task) => (
                <Grid item key={task.id} my={1}>
                  <TaskCard task={task} cardType="project" />
                </Grid>
              ))}
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }} square elevation={3}>
          <Alert
            icon={false}
            severity="success"
            variant="outlined"
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            DONE
          </Alert>
          {!isLoading && tasks.filter((task) => task.status === "done").map((task) => (
            <Grid item key={task.id} my={1}>
              <TaskCard task={task} cardType="project" />
            </Grid>
          ))}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Board;
