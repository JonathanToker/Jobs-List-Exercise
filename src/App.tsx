import { useState, useEffect } from "react";
import "./App.css";
//https://hacker-news.firebaseio.com/v0/jobstories.json - for ids
//https://hacker-news.firebaseio.com/v0/item/{id}.json - for job details given id

function App() {
  const [jobsIds, setJobsIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchJobIds = async () => {
      try {
        const res = await fetch(
          "https://hacker-news.firebaseio.com/v0/jobstories.json"
        );
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setJobsIds(data);
      } catch (error) {
        console.error("Failed to fetch jobs ids", error);
      }
    };
    fetchJobIds();
  }, []);
  console.log(jobsIds);
  return (
    <>
      <div className="container">
        <h1 className="main-title">Hacker News Jobs Board</h1>
        <div className="inner-container">
          <h1>Job title</h1>
          <p>Job description...</p>
          <div>By Company X, Date, Time</div>
        </div>
        <div className="inner-container">
          <h1>Job title</h1>
          <p>Job description...</p>
          <div>By Company X, Date, Time</div>
        </div>
      </div>
    </>
  );
}

export default App;
