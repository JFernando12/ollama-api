import axios from "axios";
import { Worker, isMainThread, parentPort, workerData } from "worker_threads";

const API_URL: string = "https://pokeapi.co/api/v2/pokemon/ditto"; // Replace with your API URL
const REQUESTS_PER_WORKER: number = 100; // Requests per worker
const WORKERS: number = 5; // Number of workers

// Function to send a request
const sendRequest = async (): Promise<{ status: number | string; time: string }> => {
  try {
    const startTime = Date.now();
    const response = await axios.get(API_URL);
    const endTime = Date.now();
    return { status: response.status, time: `${endTime - startTime}ms` };
  } catch (error: any) {
    console.log('Error1: ', error);
    return { status: error.response ? error.response.status : "Error", time: "N/A" };
  }
};

// Worker thread logic
if (!isMainThread) {
  (async () => {
    let results: { status: number | string; time: string }[] = [];
    for (let i = 0; i < workerData.requests; i++) {
      results.push(await sendRequest());
    }
    parentPort?.postMessage(results);
  })();
} else {
  const workers: Worker[] = [];
  let completedRequests: number = 0;
  let successfulResponses: number = 0;
  let failedResponses: number = 0;

  console.log(`Starting stress test with ${WORKERS} workers, each sending ${REQUESTS_PER_WORKER} requests...`);

  for (let i = 0; i < WORKERS; i++) {
    const worker = new Worker(__filename, { workerData: { requests: REQUESTS_PER_WORKER } });

    worker.on("message", (results: { status: number | string; time: string }[]) => {
      completedRequests += results.length;
      successfulResponses += results.filter(r => r.status === 200).length;
      failedResponses += results.filter(r => r.status !== 200).length;

      console.log(`Worker ${i + 1} completed. Total Requests: ${completedRequests}`);

      if (completedRequests === WORKERS * REQUESTS_PER_WORKER) {
        console.log("\n=== Stress Test Results ===");
        console.log(`Total Requests: ${completedRequests}`);
        console.log(`Successful Responses (200): ${successfulResponses}`);
        console.log(`Failed Responses: ${failedResponses}`);
      }
    });

    worker.on("error", (err) => console.error(`Worker ${i + 1} error:`, err));
    workers.push(worker);
  }
}
