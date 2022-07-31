import { Fragment, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import ExpenseItem from "../../../components/expense/expense-item";
import { produceLogToKafka } from "../../../helper/kafka-util";

export default function UpdateItemPage() {
  const router = useRouter();

  useEffect(() => {
    const path = `expense/update-item/${router.query.id}`;
    produceLogToKafka(path);
  }, [router.query]);

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
