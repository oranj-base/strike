# STRIKE - Share Actionable Links with Ease
![image](https://github.com/user-attachments/assets/21936a32-c2fc-47ab-b15a-24a1774a3159)
<div style="display:flex;flex-direction:column;">
  <a 
    <img src="<img width="1435" src="https://github.com/user-attachments/assets/21d300bd-6ed5-4615-a963-82cc58a672ab"
   >
  </a>   
   
[![Internet Computer portal](https://img.shields.io/badge/Internet-Computer-grey?logo=internet%20computer)](https://internetcomputer.org)
[![Strike Logo](https://img.shields.io/badge/STRIKE-Core%20Library-blue?logo=https://github.com/oranj-base/strike/blob/main/apps/chrome-extension/public/img/logo-128.png)](https://github.com/oranj-base/strike/blob/main/packages/core)
[![Strike Logo](https://img.shields.io/badge/STRIKE-Registry%20Canister-green?logo=https://github.com/oranj-base/strike/blob/main/apps/chrome-extension/public/img/logo-128.png)](https://github.com/oranj-base/strike/blob/main/canisters/strike_backend)
[![Strike Logo](https://img.shields.io/badge/STRIKE-Chrome%20Extension-orange?logo=https://github.com/oranj-base/strike/blob/main/apps/chrome-extension/public/img/logo-128.png)](https://github.com/oranj-base/strike/tree/main/apps/chrome-extension)
</div>

</div>

---

## Overview

STRIKE enables users to share **actionable links** that unfurl into **interactive Strike Cards** on social media platforms, allowing seamless engagement with custom actions. Strike makes it easy to integrate blockchain actions with popular platforms like Twitter (X), offering users a one-click interaction with predefined actions.
STRIKE consists of three main components:

- **STRIKE [Core Library](./packages/core)**: The core logic and API interface for creating and managing Strike Cards.
- **STRIKE [Registry Canister](./canisters/strike_backend)**: A backend service that handles action requests and manages metadata.
- **STRIKE [Chrome Extension](./apps/chrome-extension)**: Enables users to interact with Strike Cards and execute actions directly from their browser.
---
## How STRIKE Works

STRIKE simplifies the process of sharing actionable links on social media platforms. Users can create custom actions defined in a **JSON file** and host it publicly. When a user shares a link, it unfurls into an **interactive Strike Card** on platforms like Twitter (X), allowing other users to engage with the actions in just one click.

### Key Steps:
1. **Install the Chrome Extension**  
   Users need to install the Strike Chrome extension, which enables the rendering of Strike Cards and executing actions directly from the browser.

2. **Create and Host the Actions File**  
   Define the actions you want users to perform in a **JSON file** (like `actions.json`). Host it on a public server, and use it to generate interactive Strike Cards.

3. **Share and Engage with Strike Cards**  
   Once the hosted link is shared on social media, it unfurls into a **Strike Card**, allowing users to perform actions such as placing bets or managing assets.

### Schema Definition

The schema for defining actions and creating Strike Cards will be provided soon. For now, refer to the [example actions.json](./apps/site/public/actions.json), which outlines how actions are structured.

---

## Components Breakdown

- **[Core Library](./packages/core)**: The core library contains the essential logic for creating and managing Strike Cards. It processes the JSON schema and handles the backend integration with the registry canister.
  
- **[Registry Canister](./canisters/strike_backend)**: The backend canister that manages metadata and action requests. It acts as the server-side component where actions are stored and validated before execution.

- **[Chrome Extension](./apps/chrome-extension)**: The Chrome extension is required for rendering Strike Cards on platforms like Twitter (X) and enables users to interact with those actions directly in their browser. Without the extension, only the metadata will be visible, but actions won't be executable.
---

Stay tuned for more updates and detailed documentation on how to fully integrate and leverage the power of STRIKE.

> [!NOTE]  
> This project is under active development, and there may be breaking changes before the official release.
