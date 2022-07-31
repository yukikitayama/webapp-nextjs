import { Fragment, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import ExpenseItem from "../../components/expense/expense-item";
import { produceLogToKafka } from "../../helper/kafka-util";

export default function NewItemPage() {
  const router = useRouter();

  useEffect(() => {
    produceLogToKafka(router.pathname);
  }, [router.pathname]);

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
