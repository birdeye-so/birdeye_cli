---
description: "''"
title: Iframe
excerpt: ''
deprecated: false
hidden: true
metadata:
  title: ''
  description: ''
  robots: index
next:
  description: ''
---
# Birdeye Iframe Usage Instructions

Embedding Birdeye charts into your website or application is a breeze with our versatile iframe feature. Follow these simple instructions to customize and integrate the Birdeye iframe seamlessly:

<Embed url="https://birdeye.so/tv-widget/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263?chain=solana&viewMode=pair&chartInterval=1D&chartType=Candle&chartTimezone=Asia%2FBangkok&chartLeftToolbar=show&theme=dark" href="https://birdeye.so/tv-widget/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263?chain=solana&viewMode=pair&chartInterval=1D&chartType=Candle&chartTimezone=Asia%2FBangkok&chartLeftToolbar=show&theme=dark" typeOfEmbed="iframe" height="500px" width="100%" iframe="true" />

## 1 - Choose Your Token

Use the token BONK (DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263) as an example token address.

## 2 - Configure Iframe UI

* Visit our dedicated page to configure your iframe:

```
https://birdeye.so/tv-widget-builder/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263?chain=solana
```

You can access this page from the token page using the embedded icon right above token chart

<Image align="center" src="https://files.readme.io/5718fcf398fca254cbe0e78d0be3cb1c97227205258cf3445cef77cd70eb126c-image.png" />

<br />

* Use the Setting Panel to configure the iframe UI to make it fit to your UI.
* <Image align="center" src="https://files.readme.io/c7b268c5b64d762ec7829d9892b0919de58d686345052b374f549acbff3cb454-image.png" />

  Display price chart of a Pair (Market): If you want to display price chart of a specific pair (market) instead of overall token price chart, you can select the pair in the Token name dropdown, or search by token name, or search by pair address.

  <Image align="center" src="https://files.readme.io/d39324a3cb3cab7c2af6c1cc1dfd8334a66cf0a0fa7d72455f4a669064731e50-image.png" />

## 4 - Embed the Iframe

Copy and paste the generated URL into the src attribute of an HTML iframe tag on your website or application.

### Example HTML:

```
<iframe
  width="100%"
  height="600"
  src="https://birdeye.so/tv-widget/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263?chain=solana&viewMode=pair&chartInterval=1D&chartType=CANDLE&chartTimezone=Asia%2FSingapore&chartLeftToolbar=show&theme=dark"
  frameborder="0"
  allowfullscreen
></iframe>
```

## 5 - Customize and Enjoy

Feel free to experiment with different chart types, timeframes, and toolbar visibility to tailor the iframe to your specific needs.

Happy charting! 📈✨