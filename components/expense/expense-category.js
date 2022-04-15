import { Fragment, useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import {
  PieChart,
  Pie,
  Tooltip,
  LabelList,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function ExpenseCategory() {
  const [expense, setExpense] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      var startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 5);
      startDate = new Date(
        startDate.getTime() - startDate.getTimezoneOffset() * 60 * 1000
      );
      startDate.setDate(1);
      startDate = startDate.toISOString().split("T")[0];
      // End date is today
      var endDate = new Date();
      endDate = new Date(
        endDate.getTime() - endDate.getTimezoneOffset() * 60 * 1000
      )
        .toISOString()
        .split("T")[0];

      const response = await fetch(
        `${process.env.apiGatewayUrl}/expense/get?type=category&startDate=${startDate}&endDate=${endDate}`
      );
      const data = await response.json();

      // console.log(data);

      setExpense(data);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const colors = [
    "#80cbc4",
    // "#80deea",
    "#81d4fa",
    // "#90caf9",
    "#9fa8da",
    // "#b39ddb",
    "#ce93d8",
    // "#f48fb1",
    "#ef9a9a",
    // "#bcaaa4",
    "#ffab91",
    // "#ffcc80",
    "#ffe082"
  ];

  return (
    <Fragment>
      <Typography variant="h2" component="div">
        Category
      </Typography>
      {isLoading && (
        <Box sx={{ display: "flex" }}>
          <CircularProgress color="secondary" />
        </Box>
      )}
      {!isLoading && (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={expense}
              dataKey="expense"
              nameKey="category"
              startAngle={90}
              endAngle={-270}
              outerRadius="90%"
            >
              {
                expense.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))
              }
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Fragment>
  );
}
