import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';

/**
 * Load Test for DistributorHub
 * Tests application performance under various load conditions
 * 
 * Run with: k6 run tests/performance/load-test.js
 */

// Custom metrics
const errorRate = new Rate('errors');
const apiResponseTime = new Trend('api_response_time');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 50 },   // Ramp up to 50 users
    { duration: '5m', target: 50 },   // Stay at 50 users
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 200 },  // Spike to 200 users
    { duration: '5m', target: 200 },  // Stay at 200 users
    { duration: '2m', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    // HTTP errors should be less than 1%
    'http_req_failed': ['rate<0.01'],
    
    // 95% of requests should be below 500ms
    'http_req_duration': ['p(95)<500'],
    
    // 99% of requests should be below 1000ms
    'http_req_duration': ['p(99)<1000'],
    
    // Custom error rate threshold
    'errors': ['rate<0.1'],
    
    // API response time thresholds
    'api_response_time': ['p(95)<300', 'p(99)<500'],
  },
};

// Base URL - update with your actual URL
const BASE_URL = __ENV.BASE_URL || 'https://attiacloudgalaxy.github.io/Disti-Supper-App';

export default function () {
  // Test homepage
  group('Homepage', () => {
    const res = http.get(`${BASE_URL}/`);
    
    check(res, {
      'homepage status is 200': (r) => r.status === 200,
      'homepage loads in < 2s': (r) => r.timings.duration < 2000,
    }) || errorRate.add(1);
    
    sleep(1);
  });

  // Test login page
  group('Login Page', () => {
    const res = http.get(`${BASE_URL}/login`);
    
    check(res, {
      'login page status is 200': (r) => r.status === 200,
      'login page loads in < 1.5s': (r) => r.timings.duration < 1500,
    }) || errorRate.add(1);
    
    sleep(1);
  });

  // Test dashboard (simulated authenticated request)
  group('Dashboard', () => {
    const res = http.get(`${BASE_URL}/executive-dashboard`);
    
    check(res, {
      'dashboard status is 200 or 302': (r) => r.status === 200 || r.status === 302,
      'dashboard loads in < 2.5s': (r) => r.timings.duration < 2500,
    }) || errorRate.add(1);
    
    sleep(1);
  });

  // Test static assets
  group('Static Assets', () => {
    const cssRes = http.get(`${BASE_URL}/assets/index.css`, {
      tags: { name: 'CSS' },
    });
    
    check(cssRes, {
      'CSS loads successfully': (r) => r.status === 200,
      'CSS loads in < 500ms': (r) => r.timings.duration < 500,
    }) || errorRate.add(1);
    
    sleep(0.5);
  });

  // Random think time between 1-3 seconds
  sleep(Math.random() * 2 + 1);
}

// Setup function - runs once per VU
export function setup() {
  console.log('Starting load test...');
  console.log(`Base URL: ${BASE_URL}`);
  return { startTime: new Date() };
}

// Teardown function - runs once after all VUs finish
export function teardown(data) {
  const endTime = new Date();
  const duration = (endTime - data.startTime) / 1000;
  console.log(`Load test completed in ${duration} seconds`);
}
