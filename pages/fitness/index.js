import { Fragment, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import FitnessGrid from "../../components/fitness/fitness-grid";
import { produceLogToKafka } from "../../helper/kafka-util";

const FitnessPage = () => {
  const router = useRouter();

  useEffect(() => {
    produceLogToKafka(router.pathname);
  }, [router.pathname]);

  return (
    <Fragment>
      <Head>
        <title>Yuki&apos;s Fitness</title>
        <meta
          name="description"
          content="Records Yuki's fitness data and visualize it to gain insight."
        />
      </Head>
      <FitnessGrid />
    </Fragment>
  );
};

export default FitnessPage;
