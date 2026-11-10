---
title: Metrics
description: Visibility into your API performance and compute unit (CU) consumption
---

The Metrics Dashboard in Birdeye Data provides visibility into your API performance and compute unit (CU) consumption. This section is essential for developers, analysts, and operations teams who need to monitor how APIs are being used, detect potential issues, and optimize integration efficiency.

Whether you're tracking live WebSocket activity or historical REST API usage, the Metrics Dashboard enables you to break down key usage patterns by method, status code, and latency.

<Frame>
  <img src="https://files.readme.io/53e5a5b149af8bc7659db5e43030ef371b8c8f821e6d2a42c84fe2a8e9c7ce97-Usage_-_Metrics.png" alt="Dashboard - Metrics" />
</Frame>

## Select API Type

- Toggle between APIs and WebSocket tabs at the top to choose the data stream you wish to monitor.
- Choose Time Range
  - Use the time filter to adjust your view:
    - 1H – Last 1 Hour
    - 1D – Last 24 Hours
    - 7D – Last 7 Days
    - 30D – Last 30 Days

## Metrics Overview (Panels Explained)

1. **Call Methods Over Time**
   Visualizes the frequency of different API methods (e.g., /price, /pair) over your selected time range.
2. **CU Usage (Compute Units)**
   Shows compute unit consumption trends, helping you track and optimize costs.
3. **Call Methods**
   Displays a summary of the API methods being used, sorted by usage frequency.
4. **Status Code Distribution**
   Breaks down HTTP status codes (e.g., 200, 400, 500) to help you identify failed or errored calls.
5. **Status Codes Over Time**
   Allows you to monitor the health of your API traffic with a timeline of status code occurrences.
6. **Response Time**
   Provides an average response time for your API calls, key for tracking performance and latency.

## No Data Displayed?

If you're seeing "No data":

- Confirm that your API calls have been made during the selected time range.
- Ensure your API keys are correctly configured and in use.
- Check that the correct data stream (API or WebSocket) is selected.
