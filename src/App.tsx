import { useState, useEffect } from "react";
import "./App.css";
//https://hacker-news.firebaseio.com/v0/jobstories.json - for ids
//https://hacker-news.firebaseio.com/v0/item/{id}.json - for job details given id
function App() {
  const [jobsIds, setJobsIds] = useState<number[]>([]);
  const [jobsDetails, setJobsDetails] = useState<unknown[]>([]);
  const [itemsCount, setItemsCount] = useState<[number, number]>([0, 4]);
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
  const fetchRange = async (range: [number, number]) => {
    const promises: Promise<unknown>[] = [];
    const newJobsDetails: unknown[] = [];
    for (let i = range[0]; i < range[1]; i++) {
      if (jobsIds.length > i) {
        const jobDetails = fetch(
          `https://hacker-news.firebaseio.com/v0/item/${jobsIds[i]}.json`
        )
          .then((res) => res.json())
          .then((data) => newJobsDetails.push(data));
        promises.push(jobDetails);
      }
    }
    try {
      await Promise.all(promises);
      return newJobsDetails;
    } catch (error) {
      console.error("Failed fetching all data:", error);
      return [];
    }
  };
  useEffect(() => {
    fetchJobIds();
  }, []);
  useEffect(() => {
    if (jobsIds.length > 0) {
      fetchRange(itemsCount)
        .then((resultsArr) =>
          setJobsDetails((prev) => [...prev, ...resultsArr])
        )
        .catch((error) => console.error("failed to make fetchRange:", error));
    }
  }, [jobsIds, itemsCount]);
  console.log(jobsDetails);
  const loadMore = () => {
    setItemsCount((prev) => [prev[1], prev[1] + 4]);
  };
  return (
    <>
      <div className="container">
        <h1 className="main-title">Hacker News Jobs Board</h1>
        {jobsDetails.map((job, index) => {
          return (
            <div className="inner-container" key={index}>
              <h1>By {job.by}</h1>
              <p>{job.title}</p>
              <a href={`${job.url}`} target="_blank">
                By Company X, Date, Time
              </a>
            </div>
          );
        })}
        <button onClick={loadMore}>Load More</button>
      </div>
    </>
  );
}

export default App;
