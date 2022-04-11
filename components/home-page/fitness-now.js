import { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import {
  Typography,
  CircularProgress,
  Box,
  Alert,
  AlertTitle,
  Stack,
  Button,
} from "@mui/material";

export default function FitnessNow() {
  const [averageSleep, setAverageSleep] = useState();
  const [averageSteps, setAverageSteps] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // Make start and end date to get fitness data
      var start = new Date();
      start.setMonth(start.getMonth() - 2);
      start = new Date(start.getTime() - start.getTimezoneOffset() * 60 * 1000)
        .toISOString()
        .split("T")[0];
      var end = new Date();
      end = new Date(end.getTime() - end.getTimezoneOffset() * 60 * 1000)
        .toISOString()
        .split("T")[0];

      // Get average daily sleep
      const responseSleep = await fetch(
        `${process.env.apiGatewayUrl}/fitness/daily?data=sleep&start=${start}&end=${end}`
      );
      const responseSleepData = await responseSleep.json();
      let numSleep = 0;
      let sumSleepMinute = 0;
      responseSleepData.data.forEach((element) => {
        sumSleepMinute = sumSleepMinute + element.value;
        numSleep++;
      });
      const averageSleepHour = sumSleepMinute / numSleep / 60;
      setAverageSleep(averageSleepHour);

      // Get average daily steps
      const responseSteps = await fetch(
        `${process.env.apiGatewayUrl}/fitness/daily?data=steps&start=${start}&end=${end}`
      );
      const responseStepsData = await responseSteps.json();
      let numSteps = 0;
      let sumSteps = 0;
      responseStepsData.data.forEach((element) => {
        sumSteps = sumSteps + element.value;
        numSteps++;
      });
      const averageSteps = sumSteps / numSteps;
      setAverageSteps(averageSteps);

      setIsLoading(false);
    };

    fetchData();
  }, []);

  let sleepSeverity;
  if (averageSleep < process.env.averageSleepError) {
    sleepSeverity = "error";
  } else if (averageSleep < process.env.averageSleepWarning) {
    sleepSeverity = "warning";
  } else {
    sleepSeverity = "success";
  }

  let stepsSeverity;
  if (averageSteps < process.env.averageStepsError) {
    stepsSeverity = "error";
  } else if (averageSteps < process.env.averageStepsWarning) {
    stepsSeverity = "warning";
  } else {
    stepsSeverity = "success";
  }

  return (
    <Fragment>
      <Typography variant="h2" component="div" align="center">
        Fitness Now
      </Typography>
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      )}
      {!isLoading && (
        <Stack sx={{ width: "100%" }} spacing={2} pt={2}>
          <Alert
            severity={sleepSeverity}
            variant="filled"
            action={
              <Link href="/fitness" passHref>
                <Button color="inherit" size="large">
                  Detail
                </Button>
              </Link>
            }
          >
            <AlertTitle>Average Sleep</AlertTitle>
            {Math.round(averageSleep * 10) / 10} hours
          </Alert>
          <Alert
            severity={stepsSeverity}
            variant="filled"
            action={
              <Link href="/fitness" passHref>
                <Button color="inherit" size="large">
                  Detail
                </Button>
              </Link>
            }
          >
            <AlertTitle>Average Steps</AlertTitle>
            {Math.round(averageSteps)} steps
          </Alert>
        </Stack>
      )}
    </Fragment>
  );
}
