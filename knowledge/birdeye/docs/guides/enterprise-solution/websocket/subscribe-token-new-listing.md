---
description: "''"
title: SUBSCRIBE_TOKEN_NEW_LISTING
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
# Subscribing to Real-Time token new listing (SUBSCRIBE_TOKEN_NEW_LISTING)

The "SUBSCRIBE_TOKEN_NEW_LISTING" event allows you to receive real-time updates about new token listings. This subscription is useful for tracking new tokens being added on a requested blockchain.

The instructions for each type of objects are described below.

## WebSocket URL:

```
wss://public-api.birdeye.so/socket/solana?x-api-key=YOUR-API-KEY
```

### Header

| Key                      | Value                      |
| ------------------------ | -------------------------- |
| `Origin`                 | ws://public-api.birdeye.so |
| `Sec-WebSocket-Origin`   | ws://public-api.birdeye.so |
| `Sec-WebSocket-Protocol` | echo-protocol              |

### Message

```json
{
    "type": "SUBSCRIBE_TOKEN_NEW_LISTING"
}
```

Or:

```json
{
    "type": "SUBSCRIBE_TOKEN_NEW_LISTING",
    "meme_platform_enabled": true,
    "min_liquidity": 5000,
    "max_liquidity": 10000,
		"sources": ["pump_dot_fun", "meteora_dynamic_bonding_curve"],
}
```

**Key Notes:**

* The `min_liquidity` parameter is **optional** but user must set higher than system value which is `0`.
* The `max_liquidity` parameter is **optional** but must be higher than `min_volume` when provided.
* The `meme_platform_enabled` parameter is **optional**, value `true` means that you want to receive new meme token listing from meme platform such as pump.fun. If no message, it means no listing from meme platform.
* The `sources` parameter is **optional**, it enables filtering newly listed meme tokens based on their originating source.

### Output Example

```json
{
    "type": "TOKEN_NEW_LISTING_DATA",
    "data": {
        "address": "BkQfwVktcbWmxePJN5weHWJZgReWbiz8gzTdFa2w7Uds",
        "decimals": 6,
        "name": "Worker Cat",
        "symbol": "$MCDCAT",
        "liquidity": "12120.155172280874",
        "liquidityAddedAt": 1720155863
    }
}
```

**Response Parameters:**

| Key                | Data Type | Details                                      | Example                                        |
| ------------------ | --------- | -------------------------------------------- | ---------------------------------------------- |
| `address`          | string    | The token address.                           | "BkQfwVktcbWmxePJN5weHWJZgReWbiz8gzTdFa2w7Uds" |
| `decimals`         | integer   | The number of decimal places for the token.  | 6                                              |
| `name`             | string    | The name of the token.                       | "Worker Cat"                                   |
| `symbol`           | string    | The symbol of the token.                     | "$MCDCAT"                                      |
| `liquidity`        | string    | The current liquidity of the token.          | "12120.155172280874"                           |
| `liquidityAddedAt` | integer   | The Unix timestamp when liquidity was added. | 1720155863                                     |

**Supported meme sources:**

| Source      | Value                         |
| :---------- | :---------------------------- |
| RAYDIUM     | raydium                       |
| RAYDIUM     | raydium_clamm                 |
| RAYDIUM     | raydium_cp                    |
| ORCA        | orca                          |
| ALDRIN      | aldrin                        |
| STEP        | step                          |
| SAROS       | saros                         |
| SAROS       | saros_dlmm                    |
| CROPPER     | cropper                       |
| TESSERAV    | tesserav                      |
| CROPPER     | cropper_dlmm                  |
| CREMA       | crema                         |
| LIFINITY    | lifinity                      |
| PANCAKESWAP | pancakeswap_v3                |
| SABER       | saber                         |
| SWAP        | swap_program                  |
| SENCHA      | sencha                        |
| MERCURIAL   | mercurial                     |
| SERUM       | serum                         |
| OPENBOOK    | openbook                      |
| HUMIDIFI    | humidifi                      |
| OPENBOOK    | openbook_swap                 |
| SERUM       | serum_swap                    |
| PENGUIN     | penguin                       |
| TOKEN       | token                         |
| WHIRLPOOL   | whirlpool                     |
| ONEMOON     | onemoon                       |
| CYKURA      | cykura                        |
| SWIM        | swim                          |
| DOOAR       | dooar                         |
| MARINADE    | marinade                      |
| MANGO       | mango                         |
| SYMMETRY    | symmetry                      |
| METEORA     | meteora                       |
| INVARIANT   | invariant                     |
| MARCOPOLO   | marcopolo                     |
| OASIS       | oasis                         |
| GOOSEFX     | goosefx                       |
| SOLANAX     | solanax                       |
| DELTAFI     | deltafi                       |
| DRADEX      | dradex_swap                   |
| CREMA       | crema_clamm                   |
| BALANSOL    | balansol                      |
| JUPITER     | jupiter_limit_order           |
| JUPITER     | jupiter_dca                   |
| JUPITER     | jupiter_perp                  |
| FUSION      | fusion_amm                    |
| PHOENIX     | phoenix                       |
| STAKE       | stake_pool                    |
| SOCEAN      | socean                        |
| LIDO        | lido                          |
| ZETA        | zeta                          |
| BONKSWAP    | bonkswap                      |
| LP          | lp_finance                    |
| FLUXBEAM    | fluxbeam                      |
| SNOWFLAKE   | snowflake                     |
| METEORA     | meteora_dlmm                  |
| TINY        | tiny                          |
| DEXLAB      | dexlab                        |
| SANCTUM     | sanctum                       |
| OPENBOOK    | openbook_v2                   |
| ONE         | 1intro                        |
| GUACAMOLE   | guacamole                     |
| CLONE       | clone_protocol                |
| PUMP        | pump_dot_fun                  |
| STABBLE     | stabble                       |
| MANIFEST    | manifest                      |
| JUPITERZ    | jupiterz                      |
| MOONSHOT    | moonshot                      |
| SOLFI       | solfi                         |
| SOLFI_V2    | solfi_v2                      |
| NUMERAIRE   | numeraire                     |
| ZEROFI      | zerofi                        |
| DAOSFUN     | daosfun                       |
| SOLANAFUN   | solanafun_snapper             |
| SOLANAFUN   | solanafun_fomo                |
| PUMP        | pump_amm                      |
| VIRTUALS    | virtuals_io                   |
| SUPER       | super_exchange                |
| METEORA     | meteora_damm_v2               |
| METEORA     | meteora_virtual_curve         |
| RAYDIUM     | raydium_launchlab             |
| METEORA     | meteora_dynamic_bonding_curve |
| PLASMA      | plasma                        |
| VERTIGO     | vertigo                       |
| WAVEBREAK   | wavebreak                     |
| BYREAL      | byreal                        |
| HEAVEN      | heaven                        |
| UNISWAP     | uniswap                       |
| KYBERSWAP   | kyber                         |
| ONEINCH     | oneinch                       |
| SUSHISWAP   | sushiswap                     |
| BALANCER    | balancer                      |
| BALANCER    | balancerV2                    |
| BALANCER    | balancerV3                    |
| TOKEN       | token                         |
| PANCAKESWAP | pancakeswap                   |
| PANCAKE     | pancakeStableSwap             |
| DODO        | dodoV2                        |
| PANCAKESWAP | pancakeswapInfinityCLAMM      |
| PANCAKESWAP | pancakeswapInfinityLBAMM      |
| CURVE       | Curve.fi                      |
| MAVERICK    | maverickV2                    |
| UNISWAPV    | uniswapV4                     |
| WOOFI       | woofi                         |
| EKUBO       | ekubo                         |
| ONDO        | OndoFinance                   |
| FLUID       | fluid                         |

<br />