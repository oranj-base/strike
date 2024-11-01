---
hidden: true
---

# How Strike Works

STRIKE is designed to simplify interactions with canisters (smart contracts) on the Internet Computer Protocol (ICP). Here's an overview of how Strike works, including the steps for setting it up, creating actions, and sharing them through platforms like Twitter (X).

### **1. Installing the Chrome Extension**

* The first step for users is to **install the Strike Chrome extension**. This extension is required for users to interact with Strike URLs and the canisters they link to.
* Without the extension, users can only view basic metadata (e.g., images and descriptions), but with the extension installed, they can fully engage with the canister's actions.

### **2. Creating the Actions JSON File**

* Users can **create an `actions.json` file** that defines the actions they want to allow on their canister. The JSON file contains metadata, such as action labels, descriptions, canister IDs, and the actions available (e.g., "Get Owner," "Set Owner").
* Users can write their own actions using the **JSON format** provided in the documentation. These actions are defined as methods that interact with the canister, such as retrieving or updating ownership.
* Once the `actions.json` file is created, it can be **hosted anywhere** (e.g., GitHub, a custom domain, or any publicly accessible location).

### **3. Sharing the JSON Link**

* After creating and hosting the `actions.json` file, users can **share the JSON link on platforms like Twitter (X)**. When they post the Strike URL, the platform will unfurl the link, showing a preview of the canister’s actions and metadata.
* This preview will include clickable actions (e.g., buttons for "Get Owner" or "Set Owner") that other users can interact with, provided they also have the Strike Chrome extension installed.

### **4. Performing Actions**

* **Once users have the Strike extension installed**, they can interact directly with the canister by clicking the action buttons. These actions trigger interactions with the canister based on the JSON file's definitions, allowing for seamless engagement.
* For example, users can **share tokens**, perform **smart contract functions**, or update canister information directly from the platform.
