---
title: 🔒 Security Data Glossary
excerpt: camelCase for v1, v2. sanke_case for v3 and above for the same term
deprecated: false
hidden: false
metadata:
  robots: index
---
This document provides details on the security-related attributes of a token.

## 📋 Token Security Data Fields

<Table align={["left","left","left"]}>
  <thead>
    <tr>
      <th style={{ textAlign: "left" }}>
        Name
      </th>

      <th style={{ textAlign: "left" }}>
        Type
      </th>

      <th style={{ textAlign: "left" }}>
        Definition
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td style={{ textAlign: "left" }}>
        `ownerAddress`
      </td>

      <td style={{ textAlign: "left" }}>
        String
      </td>

      <td style={{ textAlign: "left" }}>
        The wallet address of the token's owner. If not `null`, the token can still be minted (`mintable = true`). If `null`, minting is no longer possible (`mintable = false`).
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        `mutableMetadata`
      </td>

      <td style={{ textAlign: "left" }}>
        Boolean
      </td>

      <td style={{ textAlign: "left" }}>
        Indicates whether the token's metadata can be modified. If `true`, metadata updates are allowed (`mutable = true`). If `false`, metadata is locked (`mutable = false`).
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        `renounced`
      </td>

      <td style={{ textAlign: "left" }}>
        Boolean
      </td>

      <td style={{ textAlign: "left" }}>
        Derived from `ownerAddress`. If `ownerAddress == null`, the token has been **renounced** (`renounced = true`), meaning the owner has given up control and further minting is impossible.
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        `freezeAuthority`
      </td>

      <td style={{ textAlign: "left" }}>
        Address
      </td>

      <td style={{ textAlign: "left" }}>
        The account address with authority to freeze the token
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        `freezeable`
      </td>

      <td style={{ textAlign: "left" }}>
        Boolean
      </td>

      <td style={{ textAlign: "left" }}>
        Indicates whether the token can be frozen.

        * Checked via `freezeAuthority`.
        * Returns **`false`** if `freezeAuthority` is `null` or `11111111111111111111111111111111`.
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        `isToken2022`
      </td>

      <td style={{ textAlign: "left" }}>
        Boolean
      </td>

      <td style={{ textAlign: "left" }}>
        Indicates whether the token follows the **Token2022** standard.
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        `transferFeeEnable`
      </td>

      <td style={{ textAlign: "left" }}>
        Boolean
      </td>

      <td style={{ textAlign: "left" }}>
        Specifies whether  `token2022` transfer fees are enabled.

        * If `null` or `false`: transfer fees are not enabled.
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        `transferFeeData`
      </td>

      <td style={{ textAlign: "left" }}>
        {}
      </td>

      <td style={{ textAlign: "left" }}>
        Contains transfer fee details (e.g., fee amount, epoch, maxFee, etc.).
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        `nonTransferable`
      </td>

      <td style={{ textAlign: "left" }}>
        Boolean
      </td>

      <td style={{ textAlign: "left" }}>
        Indicates whether token can be transferred.

        * If `false` or `null`, the token is **transferable**.
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>

      </td>

      <td style={{ textAlign: "left" }}>

      </td>

      <td style={{ textAlign: "left" }}>

      </td>
    </tr>
  </tbody>
</Table>

## 📜 Example Data

```json
{
	"ownerAddress": null,
  "mutableMetadata": true,
  "renounced": true,
  "freezeAuthority": "11111111111111111111111111111111",
  "freezeable": false,
  "isToken2022": true,
  "transferFeeEnable": false,
  "transferFeeData": {},
  "nonTransferable": true
}
```