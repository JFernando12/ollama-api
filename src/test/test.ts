import axios from "axios";

const API_URL = "http://localhost:3000/comparar-frases"; // Replace with your API URL
const totalRequests = 1000; // Total number of requests
const concurrentRequests = 50; // Number of concurrent requests

let successCount = 0;
let failureCount = 0;
let responseTimes: number[] = [];

/**
 * Function to make an API request
 */
const makeRequest = async (): Promise<void> => {
    const startTime = Date.now();
    try {
        await axios.post(API_URL, {
            frase1: "cuaderno de pasta dura y hojas de cuadro chico",
            frase2: "servicios de lavanderia",
        });
        successCount++;
    } catch (error) {
        failureCount++;
    }
    const endTime = Date.now();
    responseTimes.push(endTime - startTime);
};

/**
 * Function to run requests in batches
 */
const runStressTest = async () => {
    const requestBatches: Promise<void>[] = [];

    for (let i = 0; i < totalRequests; i++) {
        requestBatches.push(makeRequest());

        // Wait for a batch to finish before starting the next one
        if (requestBatches.length >= concurrentRequests) {
            await Promise.allSettled(requestBatches);
            requestBatches.length = 0; // Clear batch
        }
    }

    // Process any remaining requests
    if (requestBatches.length > 0) {
        await Promise.allSettled(requestBatches);
    }

    // Print results
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length || 0;
    console.log("Test Completed");
    console.log(`Total Requests: ${totalRequests}`);
    console.log(`Successful Requests: ${successCount}`);
    console.log(`Failed Requests: ${failureCount}`);
    console.log(`Average Response Time: ${avgResponseTime.toFixed(2)} ms`);
};

// Run the stress test
runStressTest();
