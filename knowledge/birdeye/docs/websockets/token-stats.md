---
title: Token Stats
excerpt: SUBSCRIBE_TOKEN_STATS
deprecated: false
hidden: false
metadata:
  robots: index
---
# Subscribing to Real-Time token overview data (SUBSCRIBE_TOKEN_STATS)

`SUBSCRIBE_TOKEN_STATS` provides real-time updates on token overview data. This subscription is ideal for monitoring live token metrics such as price, volume, trade activity, and supply changes.<br />It serves as the real-time counterpart to the [GET /defi/token_overview](/data-api/stats/get-defi-token-overview) endpoint.

The instructions for each type of objects are described below.

<Warning>
  This method is currently supported only on the Solana, Base, BSC, Ethereum, Robinhood, Mantle, Polygon, Arbitrum, Optimism, Avalanche, ZKSync, Hyperevm, Megaeth, and Fogo networks.

  `intervals` supported: "1m", "5m", "15m", "30m", "1h", "2h", "4h", "6h", "8h", "24h"
</Warning>

## WebSocket URL:

```
wss://public-api.birdeye.so/socket/solana?x-api-key=YOUR-API-KEY
```

### Header

| Key                      | Value                       |
| ------------------------ | --------------------------- |
| `Origin`                 | ws\://public-api.birdeye.so |
| `Sec-WebSocket-Origin`   | ws\://public-api.birdeye.so |
| `Sec-WebSocket-Protocol` | echo-protocol               |

### Message

**Subscription**

```json
{
    "type": "SUBSCRIBE_TOKEN_STATS",
    "data": {
        "address": "So11111111111111111111111111111111111111112",
        "select": {
            "price": true,
            "trade_data": {
                "volume": true,
                "trade": true,
                "price_history": true,
                "volume_history": true,
                "price_change": true,
                "trade_history": true,
                "trade_change": true,
                "volume_change": true,
                "unique_wallet": true,
                "unique_wallet_change":false,
                 "intervals": ["1m", "5m", "15m", "30m", "1h", "2h", "4h", "6h", "8h", "24h"]
            },
            "fdv": true,
            "marketcap": true,
            "supply": true,
            "holder_data": true,
            "last_trade": true,
            "liquidity": true
        }
    }
}
```

On Solana, a valid address is required (e.g., 9SeRj4LjgENeKQujfxRNkGbXYPM3X2vr9C37Jg9AARfg).

A single connection supports querying multiple token addresses in one request, with a maximum of 100 addresses per call. (e.g., `"address": ["So11111111111111111111111111111111111111112" , "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN" , "2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv"`] )

## Selecting holder data on Solana

Set `data.select.holder_data` to `true` to include all supported holder metrics:

```json
{
  "holder_data": true
}
```

To return metrics only for specific holder tags, pass a non-empty `tags` array:

```json
{
  "holder_data": {
    "tags": ["insider", "sniper", "dev", "bundler"]
  }
}
```

Supported tags are `sniper`, `bundler`, `insider`, and `dev`. Tag values are case-sensitive. Both forms always include `top10_holder_percentage`; selecting tags also returns `{tag}_count` and `{tag}_held_percentage` for each requested tag.

Holder data is available only on Solana. Omitting `holder_data` or setting it to `false` excludes all holder fields. Fields with a value of `0` are preserved, while fields unavailable from the upstream data are omitted. Invalid types, empty tag arrays, unsupported tags, missing `tags`, or extra properties return an `Invalid select` error.

# Subscribing to Stats for Multiple Tokens

**SUBSCRIBE_TOKEN_STATS** replaces the existing tokens stats subscription for that connection and message type. If you want to add more tokens to your token stats subscription, you must send a new **SUBSCRIBE_TOKEN_STATS** message whose payload includes the full list of token addresses you want to receive token stats updates for— including both tokens you were already subscribed to and the new ones.

Example You first send: **SUBSCRIBE_TOKEN_STATS** for **So11111111111111111111111111111111111111112**

You will begin receiving:

Token stats events for **So11111111111111111111111111111111111111112**

Later, you want to subscribe to stats updates for an additional token: **JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN**

To do this, you must send **SUBSCRIBE_TOKEN_STATS** again with a payload containing both addresses: **SUBSCRIBE_TOKEN_STATS** with addresses: **\[So11111111111111111111111111111111111111112, JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN]**

Result

You continue receiving stats events for **So11111111111111111111111111111111111111112**

You start receiving stats events for **JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN**

The previous **SUBSCRIBE_TOKEN_STATS** subscription is overwritten by the new one (now containing both tokens)

**Unsubscription**

```json
{
    "type": "UNSUBSCRIBE_TOKEN_STATS",
    "data": {
        "address": "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN"
    }
}
```

### Output Example

```json
{
    "type": "TOKEN_STATS_DATA",
	  "data": {
		"address": "C9GVVfB6P67FEMvhD1YHyCVPrGLGbpAHtXgnJrig4MKY",
        "platform_name": "stonkfun",
        "graduated": true,
        "graduated_time": 1790091249,
        "price": 0.00004875536477818407,
        "last_trade_human_time": "2026-09-22T10:47:21",
        "last_trade_unix_time": 1753094841,
        "circulating_supply": 3266503718.5056014,
        "total_supply": 6999203720.020869,
        "top10_holder_percentage": 90.7482538753404,
        "sniper_count": 3,
        "bundler_count": 115,
        "insider_count": 0,
        "dev_count": 0,
        "sniper_held_percentage": 0.0000490689811,
        "bundler_held_percentage": 6.0628963147181,
        "insider_held_percentage": 0,
        "dev_held_percentage": 0,
        "volume_1m_usd": 49026.41297327426,
        "volume_1m": 667434088.4134629,
        "volume_buy_1m": 351126886.4542229,
        "volume_buy_1m_usd": 25986.075347272348,
        "volume_sell_1m": 316307201.95924,
        "volume_sell_1m_usd": 23040.337626001907,
        "trade_1m": 688,
        "buy_1m": 281,
        "sell_1m": 407,
        "price_history_1m": 0.00004875536477818407,
        "volume_history_1m": 1594906827.932156,
        "volume_history_1m_usd": 41153.56937250512,
        "volume_sell_history_1m_usd": 15628.765898687147,
        "volume_buy_history_1m_usd": 25524.80347381797,
        "price_change_1m_percent": 0,
        "trade_history_1m": 684,
        "buy_history_1m": 316,
        "sell_history_1m": 368,
        "trade_1m_change_percent": 0.5847953216374269,
        "buy_1m_change_percent": -11.075949367088606,
        "sell_1m_change_percent": 10.597826086956522,
        "volume_1m_change_percent": -58.15215806187181,
        "volume_buy_1m_change_percent": -64.17349536373766,
        "volume_sell_1m_change_percent": -48.55380334235138,
        "unique_wallet_1m": 249,
        "volume_5m_usd": 103102.23956110823,
        "volume_5m": 3532356662.8492913,
        "volume_buy_5m": 2177069749.4919972,
        "volume_buy_5m_usd": 58404.26239547065,
        "volume_sell_5m": 1355286913.357294,
        "volume_sell_5m_usd": 44697.977165637574,
        "trade_5m": 1428,
        "buy_5m": 632,
        "sell_5m": 796,
        "price_history_5m": 0.000005713473779015665,
        "volume_history_5m": 0,
        "volume_history_5m_usd": 0,
        "volume_sell_history_5m_usd": 0,
        "volume_buy_history_5m_usd": 0,
        "price_change_5m_percent": 753.3401335847873,
        "trade_history_5m": 0,
        "buy_history_5m": 0,
        "sell_history_5m": 0,
        "trade_5m_change_percent": null,
        "buy_5m_change_percent": null,
        "sell_5m_change_percent": null,
        "volume_5m_change_percent": null,
        "volume_buy_5m_change_percent": null,
        "volume_sell_5m_change_percent": null,
        "unique_wallet_5m": 336,
        "volume_30m_usd": 1366829.3607375324,
        "volume_30m": 2257825.6924440004,
        "volume_buy_30m": 1172585.030456,
        "volume_buy_30m_usd": 706769.6257229962,
        "volume_sell_30m": 1085240.6619880004,
        "volume_sell_30m_usd": 660059.7350145361,
        "trade_30m": 6961,
        "buy_30m": 3542,
        "sell_30m": 3419,
        "volume_history_30m": 1891967.984917,
        "volume_history_30m_usd": 1151063.2560477327,
        "volume_sell_history_30m_usd": 542627.1883311641,
        "volume_buy_history_30m_usd": 608436.0677165686,
        "price_change_30m_percent": 0.7034451034089814,
        "trade_history_30m": 7300,
        "buy_history_30m": 3746,
        "sell_history_30m": 3554,
        "trade_30m_change_percent": -4.6438356164383565,
        "buy_30m_change_percent": -5.445808862786973,
        "sell_30m_change_percent": -3.7985368598761955,
        "volume_30m_change_percent": 19.337415349713254,
        "volume_buy_30m_change_percent": 17.355263289649308,
        "volume_sell_30m_change_percent": 21.555755870562802,
        "unique_wallet_30m": 872,
        "volume_1h_usd": 2369309.1928942692,
        "volume_1h": 3905591.9729770003,
        "volume_buy_1h": 2029821.3635070003,
        "volume_buy_1h_usd": 1228939.4449818023,
        "volume_sell_1h": 1875770.60947,
        "volume_sell_1h_usd": 1140369.747912467,
        "trade_1h": 13196,
        "buy_1h": 6707,
        "sell_1h": 6489,
        "price_history_1h": 0.6075207638046215,
        "volume_history_1h": 3429726.1670990004,
        "volume_history_1h_usd": 2069932.9901114453,
        "volume_sell_history_1h_usd": 1165869.7367246232,
        "volume_buy_history_1h_usd": 904063.2533868221,
        "price_change_1h_percent": 0.8181445743576581,
        "trade_history_1h": 14402,
        "buy_history_1h": 7085,
        "sell_history_1h": 7317,
        "trade_1h_change_percent": -8.373836967087904,
        "buy_1h_change_percent": -5.335215243472124,
        "sell_1h_change_percent": -11.31611316113161,
        "volume_1h_change_percent": 13.874746341061572,
        "volume_buy_1h_change_percent": 35.2236520680655,
        "volume_sell_1h_change_percent": -2.7413593498410695,
        "unique_wallet_1h": 1437,
        "volume_2h_usd": 4282810.684122546,
        "volume_2h": 7075705.237234001,
        "volume_buy_2h": 3381695.0129840006,
        "volume_buy_2h_usd": 2043334.5141576885,
        "volume_sell_2h": 3694010.2242500004,
        "volume_sell_2h_usd": 2239476.169964857,
        "trade_2h": 26434,
        "buy_2h": 13180,
        "sell_2h": 13254,
        "price_history_2h": 0.6063547767506245,
        "volume_history_2h": 6893303.0001610005,
        "volume_history_2h_usd": 4123204.444135809,
        "volume_sell_history_2h_usd": 2037755.113346662,
        "volume_buy_history_2h_usd": 2085449.330789147,
        "price_change_2h_percent": 1.0120123492792037,
        "trade_history_2h": 25113,
        "buy_history_2h": 12719,
        "sell_history_2h": 12394,
        "trade_2h_change_percent": 5.260223788476088,
        "buy_2h_change_percent": 3.624498781350735,
        "sell_2h_change_percent": 6.938841374858802,
        "volume_2h_change_percent": 2.6460789126597266,
        "volume_buy_2h_change_percent": -2.9357435862631585,
        "volume_sell_2h_change_percent": 8.350117024740069,
        "unique_wallet_2h": 2596,
        "volume_4h_usd": 8379552.950957207,
        "volume_4h": 13933793.270382997,
        "volume_buy_4h": 7004135.598874,
        "volume_buy_4h_usd": 4209740.317892926,
        "volume_sell_4h": 6929657.671508998,
        "volume_sell_4h_usd": 4169812.6330642807,
        "trade_4h": 51847,
        "buy_4h": 26168,
        "sell_4h": 25679,
        "price_history_4h": 0.594915673250481,
        "volume_history_4h": 16115181.340853006,
        "volume_history_4h_usd": 9400106.00755909,
        "volume_sell_history_4h_usd": 4587212.788573528,
        "volume_buy_history_4h_usd": 4812893.218985564,
        "price_change_4h_percent": 2.9542823481647114,
        "trade_history_4h": 49996,
        "buy_history_4h": 25441,
        "sell_history_4h": 24555,
        "trade_4h_change_percent": 3.7022961836946955,
        "buy_4h_change_percent": 2.8575920757831845,
        "sell_4h_change_percent": 4.57747912848707,
        "volume_4h_change_percent": -13.536230367697147,
        "volume_buy_4h_change_percent": -15.010809488066545,
        "volume_sell_4h_change_percent": -11.992878440021276,
        "unique_wallet_4h": 4308,
        "volume_8h_usd": 17066532.375205405,
        "volume_8h": 28848660.361253,
        "volume_buy_8h": 14787909.828942003,
        "volume_buy_8h_usd": 8750498.560481448,
        "volume_sell_8h": 14060750.532311,
        "volume_sell_8h_usd": 8316033.8147239555,
        "trade_8h": 97640,
        "buy_8h": 49559,
        "sell_8h": 48081,
        "price_history_8h": 0.5606825478432808,
        "volume_history_8h": 13735997.243788,
        "volume_history_8h_usd": 7559098.0860442305,
        "volume_sell_history_8h_usd": 3840717.6276782625,
        "volume_buy_history_8h_usd": 3718380.458365968,
        "price_change_8h_percent": 9.240275861588927,
        "trade_history_8h": 55056,
        "buy_history_8h": 27497,
        "sell_history_8h": 27559,
        "trade_8h_change_percent": 77.34670154024992,
        "buy_8h_change_percent": 80.23420736807651,
        "sell_8h_change_percent": 74.46569178852643,
        "volume_8h_change_percent": 110.02232199995225,
        "volume_buy_8h_change_percent": 119.7829466686531,
        "volume_sell_8h_change_percent": 100.65053861899014,
        "unique_wallet_8h": 7487,
        "volume_24h_usd": 31377795.460723132,
        "volume_24h": 55157979.26257999,
        "volume_buy_24h": 28179370.839522,
        "volume_buy_24h_usd": 16042723.31421147,
        "volume_sell_24h": 26978608.423057996,
        "volume_sell_24h_usd": 15335072.146511663,
        "trade_24h": 198565,
        "buy_24h": 99895,
        "sell_24h": 98670,
        "price_history_24h": 0.5538567946828037,
        "volume_history_24h": 27728845.630605005,
        "volume_history_24h_usd": 14724976.832732132,
        "volume_sell_history_24h_usd": 7198790.159741187,
        "volume_buy_history_24h_usd": 7526186.672990945,
        "price_change_24h_percent": 10.586557364988488,
        "trade_history_24h": 109364,
        "buy_history_24h": 54904,
        "sell_history_24h": 54460,
        "trade_24h_change_percent": 81.56340294795362,
        "buy_24h_change_percent": 81.94484919131575,
        "sell_24h_change_percent": 81.1788468600808,
        "volume_24h_change_percent": 98.9191327954193,
        "volume_buy_24h_change_percent": 99.50077053786998,
        "volume_sell_24h_change_percent": 98.31521783016066,
        "unique_wallet_24h": 14036,
        "fdv": 4286950419.3528237,
        "marketcap": 2000704658.132653,
        "liquidity": 14376190.7797803
    }
}
```

**Response Parameters:**

| **Key**                    | **Data Type** | **Details**                                             | **Example**                                 |
| -------------------------- | ------------- | ------------------------------------------------------- | ------------------------------------------- |
| `address`                  | string        | Address of the token                                    | C9GVVfB6P67FEMvhD1YHyCVPrGLGbpAHtXgnJrig4MKY |
| `platform_name`            | string        | Platform launchpad associated with the token, when available. Data available since deployed      | stonkfun                                    |
| `graduated`                | boolean       | Whether the token has graduated, when available         | true                                       |
| `graduated_time`           | integer       | Unix timestamp when the token graduated, when available | 1790091249                                 |
| `price`                    | number        | Current token price in USD                              | 0.6124911619717852                          |
| `last_trade_human_time`    | string        | Last trade time (human-readable)                        | "2025-07-21T10:47:21"                       |
| `last_trade_unix_time`     | integer       | Last trade time (Unix timestamp)                        | 1753094841                                  |
| `circulating_supply`       | number        | Circulating supply of the token                         | 3,266,503,718.5056014                       |
| `total_supply`             | number        | Total supply of the token                               | 6,999,203,720.020869                        |
| `top10_holder_percentage`  | number        | Percentage of token supply held by the top 10 holders; returned when holder data is selected | 90.7482538753404 |
| `sniper_count`             | integer       | Number of holders tagged as snipers                     | 3                                           |
| `bundler_count`            | integer       | Number of holders tagged as bundlers                    | 115                                         |
| `insider_count`            | integer       | Number of holders tagged as insiders                    | 0                                           |
| `dev_count`                | integer       | Number of holders tagged as developers                  | 0                                           |
| `sniper_held_percentage`   | number        | Percentage of token supply held by sniper-tagged wallets | 0.0000490689811                            |
| `bundler_held_percentage`  | number        | Percentage of token supply held by bundler-tagged wallets | 6.0628963147181                            |
| `insider_held_percentage`  | number        | Percentage of token supply held by insider-tagged wallets | 0                                          |
| `dev_held_percentage`      | number        | Percentage of token supply held by developer-tagged wallets | 0                                        |
| `fdv`                      | number        | Fully Diluted Valuation (price × total supply)          | 4,286,950,419.3528237                       |
| `marketcap`                | number        | Market capitalization (price × circulating supply)      | 2,000,704,658.132653                        |
| `liquidity`                | number        | Total token liquidity in USD                            | 14,376,190.7797803                          |
| `volume_15m_usd`           | number        | Total 15-minute volume in USD                           | Varies                                      |
| `volume_30m_usd`           | number        | Total 30-minute volume in USD                           | 1,366,829.36                                |
| `volume_1h_usd`            | number        | Total 1-hour volume in USD                              | 2,369,309.19                                |
| `volume_2h_usd`            | number        | Total 2-hour volume in USD                              | 4,282,810.68                                |
| `volume_4h_usd`            | number        | Total 4-hour volume in USD                              | 8,379,552.95                                |
| `volume_6h_usd`            | number        | Total 6-hour volume in USD                              | Varies                                      |
| `volume_8h_usd`            | number        | Total 8-hour volume in USD                              | 17,066,532.38                               |
| `volume_24h_usd`           | number        | Total 24-hour volume in USD                             | 31,377,795.46                               |
| `trade_15m`                | integer       | Number of trades in the last 15 minutes                 | Varies                                      |
| `trade_30m`                | integer       | Number of trades in the last 30 minutes                 | 6,961                                       |
| `trade_1h`                 | integer       | Number of trades in the last 1 hour                     | 13,196                                      |
| `trade_2h`                 | integer       | Number of trades in the last 2 hours                    | 26,434                                      |
| `trade_4h`                 | integer       | Number of trades in the last 4 hours                    | 51,847                                      |
| `trade_6h`                 | integer       | Number of trades in the last 6 hours                    | Varies                                      |
| `trade_8h`                 | integer       | Number of trades in the last 8 hours                    | 97,640                                      |
| `trade_24h`                | integer       | Number of trades in the last 24 hours                   | 198,565                                     |
| `buy_24h`                  | integer       | Number of buy trades in last 24h                        | 99,895                                      |
| `sell_24h`                 | integer       | Number of sell trades in last 24h                       | 98,670                                      |
| `price_change_15m_percent` | number        | Price change in the last 15 minutes (percent)           | Varies                                      |
| `price_change_30m_percent` | number        | Price change in the last 30 minutes (percent)           | 0.7034%                                     |
| `price_change_1h_percent`  | number        | Price change in the last 1 hour (percent)               | 0.8181%                                     |
| `price_change_2h_percent`  | number        | Price change in the last 2 hours (percent)              | 1.0120%                                     |
| `price_change_4h_percent`  | number        | Price change in the last 4 hours (percent)              | 2.9543%                                     |
| `price_change_6h_percent`  | number        | Price change in the last 6 hours (percent)              | Varies                                      |
| `price_change_8h_percent`  | number        | Price change in the last 8 hours (percent)              | 9.2403%                                     |
| `price_change_24h_percent` | number        | Price change in the last 24 hours (percent)             | 10.5866%                                    |
| `unique_wallet_15m`        | integer       | Number of unique wallets transacting in last 15 minutes | Varies                                      |
| `unique_wallet_30m`        | integer       | Number of unique wallets transacting in last 30 minutes | 872                                         |
| `unique_wallet_1h`         | integer       | Number of unique wallets transacting in last 1 hour     | 1,437                                       |
| `unique_wallet_2h`         | integer       | Number of unique wallets transacting in last 2 hours    | 2,596                                       |
| `unique_wallet_4h`         | integer       | Number of unique wallets transacting in last 4 hours    | 4,308                                       |
| `unique_wallet_6h`         | integer       | Number of unique wallets transacting in last 6 hours    | Varies                                      |
| `unique_wallet_8h`         | integer       | Number of unique wallets transacting in last 8 hours    | 7,487                                       |
| `unique_wallet_24h`        | integer       | Number of unique wallets transacting in last 24 hours   | 14,036                                      |

For each selected interval `<interval>`, Token Stats can emit the corresponding `volume_<interval>`, `trade_<interval>`, `buy_<interval>`, `sell_<interval>`, `price_history_<interval>`, `volume_history_<interval>`, `trade_history_<interval>`, change-percentage, and `unique_wallet_<interval>` fields according to the enabled `trade_data` selectors. This naming applies to the new `15m` and `6h` intervals as well.
