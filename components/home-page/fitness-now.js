import { Fragment, useState, useEffect } from "react";
import { Typography, CircularProgress, Box } from "@mui/material";

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
      })
      const averageSleepHour = (sumSleepMinute / numSleep) / 60;
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
      })
      const averageSteps = (sumSteps / numSteps);
      setAverageSteps(averageSteps);

      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <Fragment>
      <Typography variant="h4" component="div" align="center">
        Fitness Now
      </Typography>
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      )}
      {!isLoading && (
        <Box>
          <Typography variant="h2" component="div" align="center">
            Sleep: {Math.round(averageSleep * 10) / 10} hours
          </Typography>
          <Typography variant="h2" component="div" align="center">
            Steps: {Math.round(averageSteps)} steps
          </Typography>
        </Box>
      )}
    </Fragment>
  );
}
