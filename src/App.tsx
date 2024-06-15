import { useState, useEffect } from "react";
import "./App.css";
//https://hacker-news.firebaseio.com/v0/jobstories.json - for ids
//https://hacker-news.firebaseio.com/v0/item/{id}.json - for job details given id
function App() {
  const [jobsIds, setJobsIds] = useState<number[]>([]);
  const [jobsDetails, setJobsDetails] = useState<unknown[]>([]);
  const [itemsCount, setItemsCount] = useState(0);
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
      const slicedIds = data.slice(itemsCount * 4, itemsCount * 4 + 4);
      fetchJobsDetails(slicedIds);
    } catch (error) {
      console.error("Failed to fetch jobs ids", error);
    }
  };
  const fetchJobsDetails = async (ids: number[]) => {
    try {
      const responsesArr = await Promise.all(
        ids.map((id) =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        )
      );
      const jobsInfoArr = await Promise.all(
        responsesArr.map((res) => res.json())
      );
      if (jobsDetails.length > 0) {
        setJobsDetails((prev) => [...prev, ...jobsInfoArr]);
      } else {
        setJobsDetails(jobsInfoArr);
      }
    } catch (error) {
      console.error("failed to get jobs info:", error);
    }
  };
  useEffect(() => {
    fetchJobIds();
  }, []);
  useEffect(() => {
    const slicedIds = jobsIds.slice(itemsCount * 4, itemsCount * 4 + 4);
    fetchJobsDetails(slicedIds);
  }, [itemsCount]);
  const loadMore = () => {
    setItemsCount((prev) => prev + 1);
  };
  console.log(jobsDetails);
  return (
    <>
      <div className="container">
        <h1 className="main-title">Hacker News Jobs Board</h1>
        {jobsDetails.length > 0 ? (
          jobsDetails.map((job, index) => {
            return (
              <div className="inner-container" key={index}>
                <h1>By {job.by}</h1>
                <p>{job.title}</p>
                <a href={`${job.url}`} target="_blank">
                  By Company X, Date, Time
                </a>
              </div>
            );
          })
        ) : (
          <div className="loader-wrapper">
            <div className="lds-roller">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )}
        <button onClick={loadMore}>Load More</button>
      </div>
    </>
  );
}

export default App;
