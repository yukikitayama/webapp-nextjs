import { Fragment, useEffect, useState } from "react";
// import { useSelector } from 'react-redux';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import {
  ComposedChart,
  Area,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { dateRange } from '../../helper/general-util';

const ExpenseTrend = () => {
  const [expense, setExpense] = useState();
  const [isLoading, setIsLoading] = useState(false);
  // const mode = useSelector((state) => state.mode.mode);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Make budget data
      const today = new Date();
      var startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      var endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      const dates = dateRange(startDate, endDate);
      const data = [];
      // Budget trend starts with paying rent at the beginning of a month
      var currentBudget = process.env.rent
      const budgetMinusRent = process.env.budget - process.env.rent;
      dates.forEach((date) => {
        data.push({ 
          date: date.toISOString().split("T")[0],
          budget: currentBudget
        });
        currentBudget = currentBudget + budgetMinusRent / dates.length;
      });

      // Get actual expense data
      startDate = (new Date(today.getFullYear(), today.getMonth(), 1)).toISOString().split('T')[0];
      endDate = (new Date(today.getFullYear(), today.getMonth() + 1, 0)).toISOString().split('T')[0];
      const response = await fetch(`${process.env.apiGatewayUrl}/expense?type=daily&startDate=${startDate}&endDate=${endDate}`);
      const expenses = await response.json();

      // Merge
      var cumulativeDailyExpense = 0;
      endDate = new Date();
      endDate = (new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60 * 1000)).toISOString().split('T')[0];
      const mergedData = [];
      data.forEach((element) => {
        var merged = {date: element.date, budget: element.budget};

        expenses.expenses.forEach((element) => {
          if (merged.date === element.date) {
            cumulativeDailyExpense = cumulativeDailyExpense + element.totalExpense;
            merged.cumulativeDailyExpense = cumulativeDailyExpense;
          }

        if (!merged.cumulativeDailyExpense && merged.date <= endDate) {
          merged.cumulativeDailyExpense = cumulativeDailyExpense;
        }
        });

        mergedData.push(merged)
      });

      setExpense(mergedData);

      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <Fragment>
      <Typography variant="h2" component="div">
        Trend
      </Typography>
      {isLoading && (
        <Box sx={{ display: "flex" }}>
          <CircularProgress color="secondary" />
        </Box>
      )}
      {!isLoading && <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={expense}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis label={{
            value: 'USD',
            angle: -90,
            position: 'insideLeft',
            // fill: mode === 'dark' ? '#ffffff' : '#000000'
            fill: '#ffffff'
          }}/>
          <Legend />
          <Area
            type="monotone"
            dataKey="cumulativeDailyExpense"
            fill="#80cbc4"
            stroke="#80cbc4"
          />
          <Line type="monotone" dot={false} dataKey="budget" stroke="#cddc39" />
        </ComposedChart>
      </ResponsiveContainer>}
    </Fragment>
  );
};

export default ExpenseTrend;