---
title: Pricing (included Data Download)
deprecated: false
hidden: true
metadata:
  robots: index
---
Welcome to **Birdeye Data Services** pricing guide. Below are the details of our pricing plans designed to meet the diverse needs of developers, businesses, and enterprises.

# Summary

<Table align={["left","left","left","left","left","left"]}>
  <thead>
    <tr>
      <th style={{ textAlign: "left" }}>
        Package (X)
      </th>

      <th style={{ textAlign: "left" }}>
        Base Price (A)
      </th>

      <th style={{ textAlign: "left" }}>
        Included Compute Units (B)
      </th>

      <th style={{ textAlign: "left" }}>
        Data Access (D)
      </th>

      <th style={{ textAlign: "left" }}>
        Rate Limit (E)
      </th>

      <th style={{ textAlign: "left" }}>
        Cost per 1M additional CUs (F)
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td style={{ textAlign: "left" }}>
        **Standard**
      </td>

      <td style={{ textAlign: "left" }}>
        0
      </td>

      <td style={{ textAlign: "left" }}>
        0.3 Millions
      </td>

      <td style={{ textAlign: "left" }}>
        [Limited](https://docs.birdeye.so/docs/data-accessibility-by-packages)
      </td>

      <td style={{ textAlign: "left" }}>
        1 rps*
      </td>

      <td style={{ textAlign: "left" }}>
        No additional CUs
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        **Lite**
      </td>

      <td style={{ textAlign: "left" }}>
        $39
      </td>

      <td style={{ textAlign: "left" }}>
        1 Millions
      </td>

      <td style={{ textAlign: "left" }}>
        [Most APIs](https://docs.birdeye.so/docs/data-accessibility-by-packages)
      </td>

      <td style={{ textAlign: "left" }}>
        15 rps*
      </td>

      <td style={{ textAlign: "left" }}>
        $23
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        **Starter**
      </td>

      <td style={{ textAlign: "left" }}>
        $99
      </td>

      <td style={{ textAlign: "left" }}>
        3 Millions
      </td>

      <td style={{ textAlign: "left" }}>
        [Most APIs](https://docs.birdeye.so/docs/data-accessibility-by-packages)
      </td>

      <td style={{ textAlign: "left" }}>
        15 rps*
      </td>

      <td style={{ textAlign: "left" }}>
        $19.9
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        **Premium**
      </td>

      <td style={{ textAlign: "left" }}>
        $199
      </td>

      <td style={{ textAlign: "left" }}>
        10 Millions
      </td>

      <td style={{ textAlign: "left" }}>
        [Most APIs](https://docs.birdeye.so/docs/data-accessibility-by-packages)
      </td>

      <td style={{ textAlign: "left" }}>
        50 rps*
        1,000 rpm**
      </td>

      <td style={{ textAlign: "left" }}>
        $9.9
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        **Business**
      </td>

      <td style={{ textAlign: "left" }}>
        $699
      </td>

      <td style={{ textAlign: "left" }}>
        50 Millions
      </td>

      <td style={{ textAlign: "left" }}>
        [All APIs + Websockets](https://docs.birdeye.so/docs/data-accessibility-by-packages)  ***
      </td>

      <td style={{ textAlign: "left" }}>
        100 rps*
        1,500 rpm**
      </td>

      <td style={{ textAlign: "left" }}>
        $6.9
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        **Business Classic**
      </td>

      <td style={{ textAlign: "left" }}>
        $999
      </td>

      <td style={{ textAlign: "left" }}>
        50 Millions CU APIs

        * 50 Millions CU WebSockets
      </td>

      <td style={{ textAlign: "left" }}>
        [All APIs + Websockets](https://docs.birdeye.so/docs/data-accessibility-by-packages) ****
      </td>

      <td style={{ textAlign: "left" }}>
        1,500 rpm**
      </td>

      <td style={{ textAlign: "left" }}>
        $5.9 for API  
        $3.5 for WS
        $4.9 for Data Download
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        **Enterprise**
      </td>

      <td style={{ textAlign: "left" }}>
        Custom
      </td>

      <td style={{ textAlign: "left" }}>
        Custom
      </td>

      <td style={{ textAlign: "left" }}>
        Custom
      </td>

      <td style={{ textAlign: "left" }}>
        Custom
      </td>

      <td style={{ textAlign: "left" }}>
        Custom
      </td>
    </tr>
  </tbody>
</Table>

* rps: request per second

** rpm: request per minute

*** Business package includes 500 websocket connections. See the[ Compute Uni Cost](https://docs.birdeye.so/docs/compute-unit-cost) for detail Compute Unit Per Byte.

**** Business Classic package includes 1000 websocket connections. See the[ Compute Uni Cost](https://docs.birdeye.so/docs/compute-unit-cost) for detail Compute Unit Per Byte.

**In case there are no used additional CUs**:

<Callout icon="🙂" theme="default">
  ### Total Cost = Base Price
</Callout>

**In case there are used additional CUs**:

Total Cost (by month) should be:

<Callout icon="🙂" theme="default">
  ### Total Cost = Base Price + Additional CUs * Overage Price
</Callout>

or in more exact terms:

<Callout icon="🤖" theme="default">
  ### Cost(X) = A(X) + [(T(X) - B(X))/1,000,000] * F(X)
</Callout>

in which,

* X = Package Type
* T = Total number of CUs used in the month
* A = Base price of X
* B = Number of remaining CUs in X
* F = Cost per 1,000,000 additional CUs in the X package
* T(X) - B(X) = Additional CUs (is equal to or greater than 0)

# Compute Unit Pricing

Compute units are a measure of the computational resources consumed by each API call. The pricing is based on the complexity and resource requirements of individual APIs. Please check the cost (in CUs) for each API in the session [Compute Units](https://docs.birdeye.so/docs/compute-unit-cost) cost.

# WebSocket pricing

* WebSocket data uses different pricing overage, contact Birdeye team for more details.

# Data Download pricing

The cost for data download (CSV. file) is calculated based on the number of rows of the exported/downloaded file. Please check the cost (in CUs) for each data type in the session [Compute Units](https://docs.birdeye.so/docs/compute-unit-cost) cost.

# Additional Information

* All prices are in USD.
* Prices are subject to change based on market conditions.
* For custom pricing inquiries, please contact our sales team.

***

To help you understand how the price are calculated, let’s go through an example:

**Assumptions**:

* You are STARTER package users
* Number of CUs remaining in your package is 3,000,000
* Base price of STARTER package is $99
* Cost per additional CUs in the STARTER package is $33
* Number of CUs used in the month includes:
  * 1,000,000 for API
  * 1,500,000 for WebSocket
  * 1,000,000 for Data Download

***

**Base price of STARTER package is $99. So,**:

* A(STARTER) = $99

**Calculate Total number of CUs used in the month - T(STARTER)**:

* T(STARTER) = CUs used for API + CUs used for WebSocket + CUs used for Data Download = 1,000,000 + 1,500,000 + 1,000,000 = 3,500,000

**Number of CUs remaining in the package is 3,000,000. So,**:

* B(STARTER) = 3,000,000

**Cost per 1,000,000 additional CUs (Overage Price) in the STARTER package is $33. So,**:

* F(STARTER) = $33

**Calculate the Additional CUs**:

* Additional CUs = Total number of CUs used in the month - Number of CUs remaining in the package = T(STARTER) - B(STARTER) = 500,000

**Calculate the cost of Additional CUs**:

* Cost of Additional CUs = (Additional CUs / 1,000,000) * F(STARTER) = (500,000 / 1,000,000) *$33 = $16.5

**Calculate the cost (by month) that the user needs to pay - Cost(STARTER)**:

* Cost(STARTER) = A(X) + [(T(X) - B(X)) / 1,000,000] * F(X) = $99 + [(3,500,000 - 3,000,000) / 1,000,000] * $33 = $115.5
* or Cost(STARTER) = A(STARTER) + Cost of Additional CUs = $99 + $16.5 = $115.5

***

**Summary**:

* You are STARTER package users and Number of CUs remaining in your package is 3,000,000.
* You spent 3,500,000 CUs for the services. So, the used Additional CUs is 500,000.
* When you renew your package, you will need to pay $115.5 including $99 for renewing STARTER package and $16.5 for used Additional CUs.

***

Thank you for choosing Birdeye Data Services. If you have any questions or need assistance, feel free to reach out to our support team.
