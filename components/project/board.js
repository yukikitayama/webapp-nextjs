import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";

import TaskCard from "./task-card";

const Board = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await fetch(`${process.env.apiGatewayUrl}/project`);
      const data = await response.json();
      setTasks(data);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <Grid container spacing={2}>
      {isLoading && (
        <Grid item xs={12}>
          <CircularProgress />
        </Grid>
      )}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }} square elevation={3}>
          TO DO
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }} square elevation={3}>
          IN PROGRESS
          {!isLoading &&
            tasks
              .filter((task) => task.status === "in progress")
              .map((task) => (
                <Grid item key={task.id}>
                  <TaskCard task={task} />
                </Grid>
              ))}
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }} square elevation={3}>
          DONE
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Board;
