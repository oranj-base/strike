# Installation and Setup

Strike makes it easy for users to share actionable links that allow interactions with **canisters** on the **Internet Computer Protocol (ICP)**. Through **Strike Cards**, users can share custom links that perform canister actions, like placing bets, directly on social media platforms like **Twitter (X)**.

### **Downloading the Strike Chrome Extension**

Users need to install the Strike Chrome extension from the official Strike website to interact with Strike Cards and execute canister actions.

* Go to the official **Strike website** at [strike.oranj.co](https://strike.oranj.co/)
* Click on the **download link** to get the Strike Chrome extension.
* Open the downloaded file in Chrome and follow the prompts to install it.
* Ensure that the extension is active in your Chrome browser.
* Once installed, the Strike Chrome extension icon will appear in your Chrome toolbar.

### **Creating and Hosting the `actions.json` File**

Strike enables users to create and host custom **`actions.json` files** that define canister actions. These files allow users to specify actions like placing bets, transferring ownership, or interacting with other blockchain-related operations.

**Steps for Setting Up the `actions.json` File:**

* Write your **`actions.json` file** to define the actions users can take. For example, in the context of **BetBTC**, the actions might involve placing bets on political outcomes or sports events.
* Host the file on a public server such as **GitHub Pages** or **Google Drive**. Ensure that it is accessible via a URL.

**Example JSON File**:

```json
  "icon": "https://your-icon-url.png",
  "label": "Bet on President",
  "title": "Who will become the next President?",
  "description": "Place your bets using BetBTC through Strike",
  "canisterId": "your-canister-id",
  "links": {
    "actions": [
      {
        "label": "Click Here to Bet",
        "href": "/betAction.json"
      }
    ]
```

### **Sharing and Using Strike Cards for BetBTC**

**Strike Cards** share interactive links that allow users to perform actions like placing bets or executing smart contract functions. When shared on social media platforms such as Twitter, Strike Cards unfurl and display a visual preview with clickable action buttons.

In the case of **BetBTC**, users can place bets directly through the Strike Card.
