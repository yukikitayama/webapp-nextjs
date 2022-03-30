import { Fragment } from "react";
import Link from "next/link";
import { Grid, Typography, Button } from "@mui/material";

import ExpenseCard from "../../components/expense/expense-card";
import MonthlyExpense from "../../components/expense/monthly-expense";
import ExpenseTrend from "../../components/expense/expense-trend";
import ExpenseTable from "../../components/expense/expense-table";
import ExpenseCategory from "../../components/expense/expense-category";

const ExpensePage = () => {
  return (
    <Fragment>
      <Grid container spacing={2} pt={2} pb={10}>
        <Grid item xs={12} md={4}>
          <ExpenseCard content={<MonthlyExpense />} />
        </Grid>
        <Grid item xs={12} md={4}>
          <ExpenseCard content={<ExpenseTrend />} />
        </Grid>
        <Grid item xs={12} md={4}>
          <ExpenseCard content={<ExpenseCategory />} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h2" component="div" align="center">
            Ledger
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Link href="/expense/new-item" passHref>
            <Button
              variant="contained"
              sx={{ width: { xs: "100%", md: "30%" } }}
            >
              Add New Item
            </Button>
          </Link>
        </Grid>
        <Grid item xs={12}>
          <ExpenseTable />
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default ExpensePage;
