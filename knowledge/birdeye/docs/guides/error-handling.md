---
title: "Error Handling"
description: "Common HTTP error codes returned by Birdeye APIs, their causes, and example responses"
metadata:
  robots: "noindex"
next:

---

Learn how to effectively handle errors when using Birdeye APIs. Understand the different types of errors that may be encountered, along with detailed explanations of their potential causes. This session provides insights into error response structures and practical tips for troubleshooting and resolving issues seamlessly.

## **400 Bad Request:**

- Message: "Invalid request parameters or payload."
- Possible Causes: This error occurs when the provided request parameters or payload are invalid, missing, or improperly formatted. Check the API documentation for the correct format and required parameters.
- Example Response:

```json
{
  "success": false,
  "message": "Invalid request parameters or payload."
}
```

## **401 Unauthorized:**

- Message: "Unauthorized. Authentication required."
- Possible Causes: This error arises when the user lacks proper authentication credentials or the provided credentials are incorrect. Ensure that you include valid authentication tokens or credentials in your request headers.
- Example Response:

```json
jsonCopy code{
  "success": false,
  "message": "Unauthorized. Authentication required."
}
```

## **403 Forbidden:**

- Message: "Access Denied. You don't have permission to access this resource."
- Possible Causes: This error is returned when the user's account lacks the necessary permissions to access the requested resource. Ensure that your user account has the required access privileges.
- Example Response:

```json
jsonCopy code{
  "success": false,
  "message": "Access Denied. You don't have permission to access this resource."
}
```

## **422 Unprocessable Entity:**

- Message: "Invalid data. Please check the provided data and try again."
- Possible Causes: This error occurs when the provided data is not valid according to the expected format or validation rules. Check the API documentation for details on the required data format.
- Example Response:

```json
jsonCopy code{
  "success": false,
  "message": "Invalid data. Please check the provided data and try again."
}
```

## **429 Too Many Requests:**

- Message: "Too many requests. Please wait and try again later."
- Possible Causes: This error is triggered when the client exceeds the rate limit for API requests. It's advised to review the API rate limits and ensure that your requests comply with the allowed rate.
- Example Response:

```json
jsonCopy code{
  "success": false,
  "message": "Too many requests. Please wait and try again later."
}
```

## **500 Internal Server Error:**

- Message: "Internal Server Error. Something went wrong on the server."
- Possible Causes: This error is raised when there is an unexpected issue on the server-side, such as a database error or an unhandled exception. It's typically not caused by the client's actions.
- Example Response:

```json
jsonCopy code{
  "success": false,
  "message": "Internal Server Error. Something went wrong on the server."
}
```
