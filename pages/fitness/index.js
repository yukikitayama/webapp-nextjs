import { Fragment } from "react";
import Head from "next/head";
import FitnessGrid from "../../components/fitness/fitness-grid";

const FitnessPage = () => {
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
