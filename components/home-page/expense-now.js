import { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

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

  let currentMonthSeverity;
  if (expense - budget > process.env.currentMonthExpenseError) {
    currentMonthSeverity = "error";
  } else if (expense - budget > process.env.currentMonthExpenseWarning) {
    currentMonthSeverity = "warning";
  } else {
    currentMonthSeverity = "success";
  }

  return (
    <Fragment>
      <Typography variant="h2" component="div" align="center">
        Expense Now
      </Typography>
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      )}
      {!isLoading && (
        <Stack
          sx={{ width: "100%" }}
          spacing={2}
          pt={2}
        >
          <Alert
            severity={currentMonthSeverity}
            variant="filled"
            action={
              <Link href="/expense" passHref>
                <Button color="inherit" size="large">
                  Detail
                </Button>
              </Link>
            }
          >
            <AlertTitle>Current Month Expense</AlertTitle>
            Spent ${expense} / Budget ${budget}
          </Alert>
        </Stack>
      )}
    </Fragment>
  );
}
