import React from 'react'
import Link from 'next/link'
import Typed from 'react-typed'

import styles from './index.module.css'

function LandingPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.landingContainer}>
        <h1 className={styles.heading}>Bam Makes It</h1>
        <Typed
          className={styles.typed}
          strings={['Fast', 'Simple', 'Easy']}
          typeSpeed={120}
          backSpeed={140}
          loop
        />
        <p className={styles.description}>
          Designed specifically for web developers, the best way to create
          payment intents.
        </p>
      </div>
      <p className={styles.button}>
        <Link className={styles.cta} href="/docs">
          Get started <span>→</span>
        </Link>
      </p>
    </div>
  )
}

export default LandingPage
