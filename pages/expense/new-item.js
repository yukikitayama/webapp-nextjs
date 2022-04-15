import { Fragment } from "react";
import Head from "next/head";
import ExpenseItem from "../../components/expense/expense-item";

export default function NewItemPage() {
  return (
    <Fragment>
      <Head>
        <title>Add New Expense Item</title>
        <meta
          name="description"
          content="Add a new expense item to expense database."
        />
      </Head>
      <ExpenseItem />
    </Fragment>
  );
}
