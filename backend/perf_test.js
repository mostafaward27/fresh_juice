const http = require('http');

const PORT = process.env.PORT || 5000;
const PATH = '/api/auth/login';
const CONCURRENT_REQUESTS = 100;

const payload = JSON.stringify({
  email: 'user@mshabar.com',
  password: 'user123'
});

const options = {
  hostname: 'localhost',
  port: PORT,
  path: PATH,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

function makeRequest() {
  return new Promise((resolve) => {
    const start = Date.now();
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const latency = Date.now() - start;
        resolve({
          statusCode: res.statusCode,
          latency,
          success: res.statusCode === 200
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        statusCode: 0,
        latency: Date.now() - start,
        success: false,
        error: err.message
      });
    });

    req.write(payload);
    req.end();
  });
}

async function runLoadTest() {
  console.log(`Starting load test: sending ${CONCURRENT_REQUESTS} concurrent requests to http://localhost:${PORT}${PATH}...`);
  const startTime = Date.now();
  
  const promises = [];
  for (let i = 0; i < CONCURRENT_REQUESTS; i++) {
    promises.push(makeRequest());
  }

  const results = await Promise.all(promises);
  const totalDuration = Date.now() - startTime;

  let successCount = 0;
  let failCount = 0;
  let totalLatency = 0;
  let minLatency = Infinity;
  let maxLatency = 0;
  const statusCodes = {};

  results.forEach(res => {
    if (res.success) {
      successCount++;
    } else {
      failCount++;
    }
    totalLatency += res.latency;
    if (res.latency < minLatency) minLatency = res.latency;
    if (res.latency > maxLatency) maxLatency = res.latency;

    statusCodes[res.statusCode] = (statusCodes[res.statusCode] || 0) + 1;
  });

  const avgLatency = (totalLatency / CONCURRENT_REQUESTS).toFixed(1);
  const throughput = (CONCURRENT_REQUESTS / (totalDuration / 1000)).toFixed(1);

  console.log('\n--- Load Test Results ---');
  console.log(`Total Requests: ${CONCURRENT_REQUESTS}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Status Codes:`, statusCodes);
  console.log(`Total Duration: ${totalDuration}ms`);
  console.log(`Avg Latency: ${avgLatency}ms`);
  console.log(`Min Latency: ${minLatency}ms`);
  console.log(`Max Latency: ${maxLatency}ms`);
  console.log(`Throughput: ${throughput} req/s`);
  console.log('-------------------------\n');
}

runLoadTest().catch(console.error);
