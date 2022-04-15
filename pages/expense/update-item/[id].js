import { Fragment } from "react";
import Head from "next/head";
import ExpenseItem from "../../../components/expense/expense-item";

export default function UpdateItemPage() {
  return (
    <Fragment>
      <Head>
        <title>Update Existing Expense Item</title>
        <meta name="description" content="Update the existing expense item or delete if necessary." />
      </Head>
      <ExpenseItem />
    </Fragment>
  );
}
