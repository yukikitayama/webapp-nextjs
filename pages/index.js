import { Fragment } from 'react';
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import Hero from '../components/home-page/hero'
import FeaturedArticle from '../components/home-page/featured-article'

export default function Home() {
  return (
    <Fragment>
      <Head>
        <title>Yuki&apos;s Web App</title>
        <meta name="description" content="Home page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Hero />
      <FeaturedArticle />
    </Fragment>
  )
}
