# Key Components

STRIKE is built on several foundational concepts and components that enable users to interact seamlessly with canisters (smart contracts) on the Internet Computer Protocol (ICP). Below are the key concepts and components that define STRIKE's functionality and the ease of interaction it offers.

### **Canisters (Smart Contracts)**

A **canister** is a special type of smart contract that runs on the **Internet Computer Protocol (ICP)**. Canisters are responsible for managing logic and state in decentralized applications (dApps) on the Internet Computer. Each canister is uniquely identified by a **canister ID**, which is similar to an address for smart contracts on other blockchains (e.g., Ethereum).

In STRIKE:

* **Canister IDs** represent the specific canister with which users will interact.
* Canisters allow users to perform operations like viewing or updating ownership, executing code, and managing data on the blockchain.
* Users interact with canisters through a STRIKE URL, which triggers actions defined in the associated JSON file.

### &#x20;**Link Unfurling**

**Link unfurling** is one of STRIKE’s core features, allowing users to enter a URL and generate a preview that includes metadata and actionable content. This process enables users to interact with the underlying canister actions directly through the unfurled link.

When a STRIKE URL is shared on platforms like **Twitter (X)**, it unfurls to show:

* **Action buttons** (e.g., "Hello," "Get Owner," "Set Owner") that users can click to interact with the canister.
* **Metadata** such as the title, description, and image associated with the canister and its actions.

This link unfurling mechanism simplifies blockchain interaction, making it more accessible for users by abstracting the complexity of smart contracts into a user-friendly interface.

### **JSON Metadata and Actions**

STRIKE relies on **JSON files** to define the metadata and actions associated with each canister. These JSON files outline the structure of the interaction between the user and the canister. Key components of the JSON file include:

* **Icon**: The image displayed in the unfurled URL preview.
* **Label**: A short label that represents the action (e.g., “Simple ownership”).
* **Title**: The title of the canister or action.
* **Description**: A brief description of the canister’s purpose or the action.
* **Canister ID**: The unique identifier for the canister with which the user is interacting.
* **Links**: Defines the actions and their respective endpoints

JSON files are hosted online and referenced when a user interacts with a STRIKE URL. They define the entire user experience and interaction workflow with the canister.

### STRIKE **Chrome Extension**

The **STRIKE Chrome extension** is essential for users to fully interact with the canisters and perform actions. Without this extension, only the metadata (e.g., image, title, and description) will be displayed when the URL is unfurled, but no actions can be performed.

Key functions of the STRIKE Chrome extension:

* **Enabling Interactions**: Users can perform predefined actions (e.g., setting ownership or triggering canister functions) once the extension is installed.
* **Authentication with Internet Identity**: The extension securely authenticates users using **Internet Identity**, the native authentication system for the Internet Computer. Once authenticated, users can execute the available actions.
* **Platform Integration**: The extension renders actions directly on the platform (e.g., Twitter) where the Strike URL is shared, making interactions seamless and native to the user’s environment.

### **Internet Identity Authentication**

Strike uses **Internet Identity** to securely authenticate users before they interact with canisters. Internet Identity is a decentralized identity solution that ensures only authorized users can perform actions, such as updating ownership or executing canister functions.

Users authenticate via Internet Identity when interacting with a Strike URL that contains actions requiring verification (e.g., "Set Owner"). The authentication ensures the user’s identity is securely linked to their actions.
