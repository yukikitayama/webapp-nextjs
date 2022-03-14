import { Fragment, useState, useEffect } from "react";
import { Typography, CircularProgress, Box } from "@mui/material";

export default function ExpenseNow() {
  const [budget, setBudget] = useState();
  const [expense, setExpense] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // Compute current budget
      const today = new Date();
      let startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      const daysSpentCurrentMonth = Math.ceil(
        (today.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
      );
      const month = today.getMonth() + 1;
      const year = today.getFullYear();
      const numDaysCurrentMonth = new Date(year, month, 0).getDate();
      const currentBudget =
        process.env.rent +
        ((process.env.budget - process.env.rent) / numDaysCurrentMonth) *
          daysSpentCurrentMonth;

      setBudget(Math.round(currentBudget));

      // Compute cumulative sum of expenses in the current month
      startDate = new Date(today.getFullYear(), today.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      const endDate = new Date(
        today.getTime() - today.getTimezoneOffset() * 60 * 1000
      )
        .toISOString()
        .split("T")[0];
      const response = await fetch(
        `${process.env.apiGatewayUrl}/expense?type=daily&startDate=${startDate}&endDate=${endDate}`
      );
      // expenses is JSON of { expenses: [{ totalExpense: NUMBER, date: STRING }, ...] }
      const expenses = await response.json();
      let currentExpense = 0;
      expenses.expenses.forEach((expense) => {
        currentExpense = currentExpense + expense.totalExpense;
      });

      setExpense(Math.round(currentExpense));

      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <Fragment>
      <Typography variant="h4" component="div" align="center">
        Expense Now
      </Typography>
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      )}
      {!isLoading && (
        <div>
          <Typography variant="h2" component="div" align="center">
            Budget: ${budget}
          </Typography>
          <Typography variant="h2" component="div" align="center">
            Expense: ${expense}
          </Typography>
          <Typography variant="h2" component="div" align="center">
            {budget - expense > 0 ? `Good` : `Exceed: $${expense - budget}`}
          </Typography>
        </div>
      )}
    </Fragment>
  );
}
