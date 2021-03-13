import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [loading,setLoading] = useState(true)
  const [activities,setActivities] = useState({})
  const [athlete,setAthlete] = useState({})
  const [stats,setStats] = useState({})

  const ACTIVITIES_ENDPOINT = `https://www.strava.com/api/v3/athlete/activities?access_token=`
  const ATHLETE_ENDPOINT = `https://www.strava.com/api/v3/athlete`

  const clientID = '63025'
  const clientSecret = 'REDACTED'
  const refreshToken = 'REDACTED'
  const REFRESH_ENDPOINT = `https://www.strava.com/oauth/token?client_id=${clientID}&client_secret=${clientSecret}&refresh_token=${refreshToken}&grant_type=refresh_token`

  useEffect(() => {
    fetch(REFRESH_ENDPOINT, {
      method: 'POST'
    })
    .then(res => res.json())
    .then(data => (getActivities(data.access_token), getAthlete(data.access_token)))
  }, [REFRESH_ENDPOINT])

  const getActivities = (access) =>{
    // console.log(callActivities + access)
      fetch(ACTIVITIES_ENDPOINT + access)
      .then(res => res.json())
      .then(data => setActivities(data), setLoading(false))
      .catch(e => console.log(e))
  }

  function showActivities(){
    activities && console.log(activities)
    return (<>{loading ?
    <>Loading, please wait...</>
    :
    <div>{activities.length}</div>
    }</>)
  }

  const getAthlete = (access) =>{
    // console.log(callActivities + access)
      fetch(ATHLETE_ENDPOINT + `?access_token=` + access)
      .then(res => res.json())
      .then(data => (setAthlete(data), setLoading(false), getStats(access,data.id)))
      .catch(e => console.log(e))
  }

  const getStats = (access,id) => {
    fetch(ATHLETE_ENDPOINT + `s/${id}/stats?access_token=` + access)
    .then(res => res.json())
    .then(data => setStats(data), setLoading(false), console.log(stats))
    .catch(e => console.log(e))
  }

  function showAthlete(){
    athlete && console.log(athlete)
    return (<>{loading ?
    <>Loading, please wait...</>:
    <div>Hi, {athlete.firstname} {athlete.lastname}</div>
    }
    </>)
  }

  function getMiles(i) {
    return i*0.000621371192;
  }

  function getTime(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    
    var hDisplay = h > 0 ? h + (h == 1 ? " hour & " : " hours & ") : ""
    var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : ""
    
    return hDisplay + mDisplay 
}

function getDate(d){
  const date = new Date(d)
  return date.toLocaleString('default', {month: 'long', year: 'numeric'})
}

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <a href="https://strava.com">Strava Stats</a>
        </h1>

        {/* {showActivities()} */}
        {showAthlete()}

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h3>Member Since {getDate(athlete?.created_at) || 'Never'}</h3>
            {/* <p>Find in-depth information about Next.js features and API.</p> */}
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h3>{stats?.all_ride_totals?.count || '0'} Rides</h3>
            {/* <p>Learn about Next.js in an interactive course with quizzes!</p> */}
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h3>{getMiles(stats?.all_ride_totals?.distance).toFixed(2) || '0'} Miles</h3>
            {/* <p>Discover and deploy boilerplate example Next.js projects.</p> */}
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h3>{getTime(stats?.all_ride_totals?.elapsed_time) || '0 hours & 0 minutes'} Spent Biking</h3>
            {/* <p> */}
              {/* Instantly deploy your Next.js site to a public URL with Vercel. */}
            {/* </p> */}
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}


/*
http://localhost/exchange_token?state=&code=126e6b1b026c417b259277c45c4515e30a2b47c3&scope=read,activity:read_all


https://www.strava.com/oauth/token\?client_id\=63025\&client_secret\=626bc9a89605dd8e67a54a434b730f05083b0ac0\&code\=d58715d382c700ecf42f575d7f98954ea981d66d\&grant_type\=authorization_code

refresh: 37e9481a255d31ddabd867579dfcf508c69c24a1

access: 1a05b7de5ce910cb84ecedf99af8cd02ed8a6296

*/