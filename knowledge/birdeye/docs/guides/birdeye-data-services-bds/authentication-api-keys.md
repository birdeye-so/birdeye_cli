---
description: "''"
title: Authentication & API Keys
excerpt: ''
deprecated: false
hidden: false
metadata:
  title: ''
  description: ''
  robots: index
next:
  description: ''
---
To utilize the Birdeye's APIs, an API key is required for authentication. You can obtain an API key by signing up for a Birdeye.so account and generating an API key in your BDS Dashboard. Include this API key in the headers of your API requests for authentication.

Here's a step-by-step guide on how to obtain an API key:

# 1 - Create a Birdeye Account

* A single Birdeye account can be used for both accessing website [birdeye.so](https://birdeye.so/) and using [Birdeye Data Services (BDS)](https://bds.birdeye.so/).
* You can create your Birdeye account using one of two methods:
  * Using birdeye.so sign-up page: [https://birdeye.so/user/sign-up](https://birdeye.so/user/sign-up). Please check out detailed instructions [HERE](https://docs.birdeye.so/docs/birdeye-account).
  * Using BDS sign-up page: [https://bds.birdeye.so/auth/sign-up](https://bds.birdeye.so/auth/sign-up).\
    **Note**: Both methods above result in one single account, and that account can be used in both systems. It is not possible to create two account in those two systems with the same email address.

# 2 - Get your API Keys

* **Log in to your BDS account:** use your email and password to log into BDS Dashboard using this link: [https://bds.birdeye.so/auth/sign-in](https://bds.birdeye.so/auth/sign-in)
* **Access the Security Tab:** On your Dashboard, look for a section labeled "Security" or similar. This is where you'll find options related to API keys and security settings.

<Image align="center" src="https://files.readme.io/894622c-Screenshot_2024-06-13_at_14.40.13.png" />

* **Generate API Key:** Within the Security section, you'll find an option to generate an API key. This might be labeled as "Generate Key" or something similar. Click on this option to initiate the API key generation process.

<Image align="center" src="https://files.readme.io/2c584aa-Screenshot_2024-03-08_at_17.55.37.png" />

* **Configure Key Settings (Optional):** Depending on the platform, you might have the option to configure settings for your API key. This could include specifying the access permissions or adding a name/description to the key for better organization.

<Image align="center" src="https://files.readme.io/f1929e0-Screenshot_2024-03-08_at_17.55.51.png" />

* **Generate the Key:** After configuring any optional settings, click the "Generate" or "Create" button to generate your API key. The system will create a unique API key associated with your Birdeye account.
* **Copy the API Key:** Once the API key is generated, you'll typically see it displayed on the screen. It might be a long string of alphanumeric characters. Make sure to copy this key and keep it in a secure place. You'll need to include this key in the headers of your API requests for authentication.

And that's it! You now have your API key from Birdeye.so, which you can use to authenticate your API requests and access the services provided by the Birdeye.so APIs.