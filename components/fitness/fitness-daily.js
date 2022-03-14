import { Fragment, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
  Label,
} from "recharts";
import { Typography, CircularProgress, Box } from "@mui/material";

export default function FitnessDaily(props) {
  const [dailyData, setDailyData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      var start = new Date();
      start.setMonth(start.getMonth() - 2);
      start = new Date(start.getTime() - start.getTimezoneOffset() * 60 * 1000)
        .toISOString()
        .split("T")[0];
      var end = new Date();
      end = new Date(end.getTime() - end.getTimezoneOffset() * 60 * 1000)
        .toISOString()
        .split("T")[0];
      const response = await fetch(
        `${process.env.apiGatewayUrl}/fitness/daily?data=${props.data}&start=${start}&end=${end}`
      );
      const responseData = await response.json();
      setDailyData(responseData.data);

      setIsLoading(false);
    };

    fetchData();
  }, [props.data]);

  return (
    <Fragment>
      <Typography variant="h2" align="center">
        {props.title}
      </Typography>
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      )}
      {/* {!isLoading && ( */}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={dailyData}
            margin={{ top: 10, right: 50, left: 5, bottom: 10 }}
          >
            <XAxis dataKey="date" />
            {props.yAxisDomain ? (
              <YAxis
                label={{
                  value: `${props.yAxisLabel}`,
                  angle: -90,
                  position: "insideLeft",
                  // fill: mode === "dark" ? "#ffffff" : "#000000",
                  fill: "#ffffff",
                }}
                type="number"
                domain={[props.yAxisDomain.min, props.yAxisDomain.max]}
              />
            ) : (
              <YAxis
                label={{
                  value: `${props.yAxisLabel}`,
                  angle: -90,
                  position: "insideLeft",
                  // fill: mode === "dark" ? "#ffffff" : "#000000",
                  fill: "#ffffff",
                }}
              />
            )}
            <Line
              type="monotone"
              dataKey="value"
              dot={false}
              stroke="#80cbc4"
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="movingAverage"
              dot={false}
              stroke="#cddc39"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
            <ReferenceLine
              y={props.target}
              stroke="#ffffff"
              strokeDasharray="3 3"
            >
              <Label value="Target" position="right" fill="#ffffff" />
            </ReferenceLine>
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      {/* )} */}
    </Fragment>
  );
}
