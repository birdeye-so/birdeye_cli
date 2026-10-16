---
description: "''"
title: Security Check
excerpt: >-
  The Security Check feature ensures that users are aware of potential risks
  associated with tokens by evaluating them against a set of security criteria.
  Each criterion is carefully designed to highlight aspects that may indicate a
  token’s safety or risks.
deprecated: false
hidden: false
metadata:
  title: ''
  description: ''
  robots: index
next:
  description: ''
---
## How to Use

1. Go to a specific token page
2. <Image align="center" src="https://files.readme.io/8d97cdf1dcfe9bb38d0337e6373a7750e63760142317730f06d09cdfd129f478-image.png" />

   Navigate to the Security tab under the main chart.
3. <Image align="center" src="https://files.readme.io/0a628c6dd1c18cdd96ec7290e635ba3c5c0b5e3788c3a94850625afa1225208c-image.png" />

   Review the security report
4. Click on the tooltip next to each criterion for more information about the issue or check the **Security Criteria Table** below

## Security Criteria

<Table align={[null,null,"left","left","left"]}>
  <thead>
    <tr>
      <th>
        **Criteria**
      </th>

      <th>
        **Description**
      </th>

      <th style={{ textAlign: "left" }}>
        Severity
      </th>

      <th style={{ textAlign: "left" }}>
        Type
      </th>

      <th style={{ textAlign: "left" }}>
        Solution
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        **Fake Token**
      </td>

      <td>
        This token is either a scam or imitation of another token.
      </td>

      <td style={{ textAlign: "left" }}>
        Critical
      </td>

      <td style={{ textAlign: "left" }}>
        Token Info
      </td>

      <td style={{ textAlign: "left" }}>
        * <br />
      </td>
    </tr>

    <tr>
      <td>
        **Ownership Renounced**
      </td>

      <td>
        Token's owner can adjust token parameters such as minting, token name, logo, website, etc.
      </td>

      <td style={{ textAlign: "left" }}>
        Critical
      </td>

      <td style={{ textAlign: "left" }}>
        Token Info
      </td>

      <td style={{ textAlign: "left" }}>
        The current owner of token must transfer their owner ship to a `NULL address` .\
        Or set the [Mint Authority](https://solana.com/docs/core/tokens#mint-account) and [Freeze Authority](https://solana.com/developers/guides/advanced/exchange#freeze-authority)   as `disable` while using CLI at the creation for Solana tokens.
      </td>
    </tr>

    <tr>
      <td>
        **Honeypot**
      </td>

      <td>
        If a token is Honeypot, very high chance it is a scam. Buyers may not be able to sell this token, or the token contains malicious code.
      </td>

      <td style={{ textAlign: "left" }}>
        Critical
      </td>

      <td style={{ textAlign: "left" }}>
        Token Info
      </td>

      <td style={{ textAlign: "left" }}>
        * <br />
      </td>
    </tr>

    <tr>
      <td>
        **Freezable**
      </td>

      <td>
        Token SPL V2 element - the authority can freeze every token from transferring among wallets.
      </td>

      <td style={{ textAlign: "left" }}>
        Critical
      </td>

      <td style={{ textAlign: "left" }}>
        Token Extension
      </td>

      <td style={{ textAlign: "left" }}>
        [Freeze Authority](https://solana.com/developers/guides/advanced/exchange#freeze-authority)
      </td>
    </tr>

    <tr>
      <td>
        **Freeze Authority**
      </td>

      <td>
        Freeze Authority is who can freeze every token from transferring among wallets.
      </td>

      <td style={{ textAlign: "left" }}>
        Critical
      </td>

      <td style={{ textAlign: "left" }}>
        Token Extension
      </td>

      <td style={{ textAlign: "left" }}>
        Change [Freeze Authority](https://solana.com/developers/guides/advanced/exchange#freeze-authority)  to Null address or just disable freeze authority at the creation of token.
      </td>
    </tr>

    <tr>
      <td>
        **Jupiter Strict List**
      </td>

      <td>
        If a token is in Strict List, it was verified by Jupiter's community.
      </td>

      <td style={{ textAlign: "left" }}>
        High Risk
      </td>

      <td style={{ textAlign: "left" }}>
        Community
      </td>

      <td style={{ textAlign: "left" }}>
        [https://station.jup.ag/guides/general/get-your-token-on-jupiter#getting-on-the-strict-list](https://station.jup.ag/guides/general/get-your-token-on-jupiter#getting-on-the-strict-list)
      </td>
    </tr>

    <tr>
      <td>
        **Top Holders Percentage**
      </td>

      <td>
        If a token has high top 10 holder percentage, there are risks of those holders mass selling and make the token's price volatile.
      </td>

      <td style={{ textAlign: "left" }}>
        High Risk
      </td>

      <td style={{ textAlign: "left" }}>
        Community
      </td>

      <td style={{ textAlign: "left" }}>
        Reduce the proportion of total token supply holdings within top 10 wallets.
      </td>
    </tr>

    <tr>
      <td>
        **Token Percentage of Owner**
      </td>

      <td>
        The percentage of tokens held by the token owner.
      </td>

      <td style={{ textAlign: "left" }}>
        High Risk
      </td>

      <td style={{ textAlign: "left" }}>
        Dev
      </td>

      <td style={{ textAlign: "left" }}>
        Reduce the proportion of total token supply holding in Owner Address.
      </td>
    </tr>

    <tr>
      <td>
        **UA Percentage**
      </td>

      <td>
        The percentage of tokens held by the token Update Authority.
      </td>

      <td style={{ textAlign: "left" }}>
        High Risk
      </td>

      <td style={{ textAlign: "left" }}>
        Dev
      </td>

      <td style={{ textAlign: "left" }}>
        Reduce the proportion of total token supply holding in Update Authority Address.
      </td>
    </tr>

    <tr>
      <td>
        **Buy Tax**
      </td>

      <td>
        Transfer fee will cause the actual value received when transfer a token to be less than expected, and high transfer fee may lead to large losses.
      </td>

      <td style={{ textAlign: "left" }}>
        High Risk
      </td>

      <td style={{ textAlign: "left" }}>
        Token Extension
      </td>

      <td style={{ textAlign: "left" }}>
        * <br />
      </td>
    </tr>

    <tr>
      <td>
        **Sell Tax**
      </td>

      <td>
        Transfer fee will cause the actual value received when transfer a token to be less than expected, and high transfer fee may lead to large losses.
      </td>

      <td style={{ textAlign: "left" }}>
        High Risk
      </td>

      <td style={{ textAlign: "left" }}>
        Token Extension
      </td>

      <td style={{ textAlign: "left" }}>
        * <br />
      </td>
    </tr>

    <tr>
      <td>
        **Max Fee**
      </td>

      <td>
        The maximum fee that the authority can charge on each transfer.
      </td>

      <td style={{ textAlign: "left" }}>
        High Risk
      </td>

      <td style={{ textAlign: "left" }}>
        Token Extension
      </td>

      <td style={{ textAlign: "left" }}>
        * <br />
      </td>
    </tr>

    <tr>
      <td>
        **Transfer Fees**
      </td>

      <td>
        Token SPL V2 element - the authority can charge a percentage fee when this token is transferred among wallets.
      </td>

      <td style={{ textAlign: "left" }}>
        High Risk
      </td>

      <td style={{ textAlign: "left" }}>
        Token Extension
      </td>

      <td style={{ textAlign: "left" }}>
        * <br />
      </td>
    </tr>

    <tr>
      <td>
        **Transfer Fee Config Authority**
      </td>

      <td>
        Config Authority is who can change the transfer fee anywhere from 0 to Max fee.
      </td>

      <td style={{ textAlign: "left" }}>
        High Risk
      </td>

      <td style={{ textAlign: "left" }}>
        Token Extension
      </td>

      <td style={{ textAlign: "left" }}>
        Change the [Transfer Fee Config Authority](https://solana.com/vi/developers/courses/token-extensions/transfer-fee#configuring-a-mint-with-a-transfer-fee) to NULL address.
      </td>
    </tr>

    <tr>
      <td>
        **Mintable**
      </td>

      <td>
        Mint function enables contract owner to issue more tokens and cause the coin price to plummet. It is extremely risky.
      </td>

      <td style={{ textAlign: "left" }}>
        High Risk
      </td>

      <td style={{ textAlign: "left" }}>
        Token Info
      </td>

      <td style={{ textAlign: "left" }}>
        Change [Mint Authority](https://solana.com/docs/core/tokens#mint-account)  to Null wallet or just disable mint authority at the creation of token.
      </td>
    </tr>

    <tr>
      <td>
        **Mutable Info**
      </td>

      <td>
        The token information such as name, logo, website can be changed by the owner.
      </td>

      <td style={{ textAlign: "left" }}>
        Medium Risk
      </td>

      <td style={{ textAlign: "left" }}>
        Token Info
      </td>

      <td style={{ textAlign: "left" }}>
        * Change [Update Authority](https://solana.com/vi/developers/guides/token-extensions/metadata-pointer#read-metadata-from-mint-account)   to Null wallet or just disable at the creation of token.
      </td>
    </tr>

    <tr>
      <td>
        **First Mint Time**
      </td>

      <td>
        The token is first minted at this time. There can be several other mint events after this.
      </td>

      <td style={{ textAlign: "left" }}>
        Neutral
      </td>

      <td style={{ textAlign: "left" }}>
        Dev
      </td>

      <td style={{ textAlign: "left" }}>
        * <br />
      </td>
    </tr>

    <tr>
      <td>
        **First Mint Tx**
      </td>

      <td>
        The token is first minted at this transaction. There can be several other mint events after this.
      </td>

      <td style={{ textAlign: "left" }}>
        Neutral
      </td>

      <td style={{ textAlign: "left" }}>
        Dev
      </td>

      <td style={{ textAlign: "left" }}>
        * <br />
      </td>
    </tr>

    <tr>
      <td>
        **Creator Address**
      </td>

      <td>
        The token creator's address.
      </td>

      <td style={{ textAlign: "left" }}>
        Neutral
      </td>

      <td style={{ textAlign: "left" }}>
        Dev
      </td>

      <td style={{ textAlign: "left" }}>
        * <br />
      </td>
    </tr>

    <tr>
      <td>
        **Creator Balance**
      </td>

      <td>
        The token balance of token creator.
      </td>

      <td style={{ textAlign: "left" }}>
        Neutral
      </td>

      <td style={{ textAlign: "left" }}>
        Dev
      </td>

      <td style={{ textAlign: "left" }}>
        * <br />
      </td>
    </tr>

    <tr>
      <td>
        **Owner Address**
      </td>

      <td>
        Ownership is mostly used to adjust the parameters and status of the token, such as minting, token name, logo, website, etc.
      </td>

      <td style={{ textAlign: "left" }}>
        Neutral
      </td>

      <td style={{ textAlign: "left" }}>
        Dev
      </td>

      <td style={{ textAlign: "left" }}>
        * <br />
      </td>
    </tr>

    <tr>
      <td>
        **Owner Balance**
      </td>

      <td>
        The token current owner's address.
      </td>

      <td style={{ textAlign: "left" }}>
        Neutral
      </td>

      <td style={{ textAlign: "left" }}>
        Dev
      </td>

      <td style={{ textAlign: "left" }}>
        * <br />
      </td>
    </tr>

    <tr>
      <td>
        **UA Balance**
      </td>

      <td>
        The token balance of token Update Authority.
      </td>

      <td style={{ textAlign: "left" }}>
        Neutral
      </td>

      <td style={{ textAlign: "left" }}>
        Dev
      </td>

      <td style={{ textAlign: "left" }}>
        * <br />
      </td>
    </tr>

    <tr>
      <td>
        **Update Authority (UA)**
      </td>

      <td>
        The token's update authority address.
      </td>

      <td style={{ textAlign: "left" }}>
        Neutral
      </td>

      <td style={{ textAlign: "left" }}>
        Dev
      </td>

      <td style={{ textAlign: "left" }}>
        * <br />
      </td>
    </tr>

    <tr>
      <td>
        **Liquidity Burned**
      </td>

      <td>
        When a part of token liquidity is burnt, that part can never be traded in the open market.
      </td>

      <td style={{ textAlign: "left" }}>
        Neutral
      </td>

      <td style={{ textAlign: "left" }}>
        Liquidity
      </td>

      <td style={{ textAlign: "left" }}>
        * <br />
      </td>
    </tr>

    <tr>
      <td>
        **Liquidity Locked**
      </td>

      <td>
        When a part of token liquidity is locked, that part can not be transacted in the open market, which reduce the risks of mass selling. However those tokens can be unlocked in the future.
      </td>

      <td style={{ textAlign: "left" }}>
        Neutral
      </td>

      <td style={{ textAlign: "left" }}>
        Liquidity
      </td>

      <td style={{ textAlign: "left" }}>
        * <br />
      </td>
    </tr>

    <tr>
      <td>
        **LP Holders Count**
      </td>

      <td>
        The total number of liquidity providers on this token in multiple markets. The more LPs there are, the more decentralized the token becomes. Only count from the most liquid pool
      </td>

      <td style={{ textAlign: "left" }}>
        Neutral
      </td>

      <td style={{ textAlign: "left" }}>
        Liquidity
      </td>

      <td style={{ textAlign: "left" }}>
        * <br />
      </td>
    </tr>

    <tr>
      <td>
        **Fee Withdrawer**
      </td>

      <td>
        Withdrawer is who can withraw all the transfer fees to a wallet of their choice.
      </td>

      <td style={{ textAlign: "left" }}>
        Neutral
      </td>

      <td style={{ textAlign: "left" }}>
        Token Extension
      </td>

      <td style={{ textAlign: "left" }}>
        * <br />
      </td>
    </tr>

    <tr>
      <td>
        **Current Transfer Fees**
      </td>

      <td>
        The authority can charge a percentage fee when this token is transfered among wallets.
      </td>

      <td style={{ textAlign: "left" }}>
        Neutral
      </td>

      <td style={{ textAlign: "left" }}>
        Token Extension
      </td>

      <td style={{ textAlign: "left" }}>
        * <br />
      </td>
    </tr>
  </tbody>
</Table>

## Interpreting the Results

* Pass: The token satisfies the criterion with no significant risks detected.
* Warning: A potential risk is detected. Click the tooltip for more information.
* Fail: The token fails the criterion and poses significant security concerns.

## ❗ Disclaimer

The Security Check feature is a tool to assist in evaluating token security. It is not a guarantee of safety or investment performance. Users should conduct their own due diligence and consult professionals before making investment decisions.