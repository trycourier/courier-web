# `courier-web`

A monorepo that contains all packages for Courier's browser SDKs.

## Getting Started

### In VSCode IDEs

1. Open the `.vscode` folder, click `courier-web.code-workspace` then click the blue **"Open Workspace"** button in the bottom right
<img width="977" alt="Screenshot 2025-06-25 at 7 04 53 PM" src="https://github.com/user-attachments/assets/0d7d1a5f-6664-4b9f-8071-26d1e7521cba" />

2. Click the **"Sync Packages"** button to install all dependencies
<img width="977" alt="Screenshot 2025-06-25 at 7 06 04 PM" src="https://github.com/user-attachments/assets/8326a66d-2d8a-4831-880a-d165e48a7fa4" />

This will set up your development environment with all the necessary packages and configurations.

> You may need to click **"Sync Packages"** during development if some local packages get out of sync with each other.

## Packages

| Package | Description |
|---------|-------------|
| [`courier-js`](./@trycourier/courier-js) | The base API client and shared instance singleton for Courier's JavaScript Browser SDK |
| [`courier-ui-core`](./@trycourier/courier-ui-core) | Web components used in UI level packages |
| [`courier-ui-inbox`](./@trycourier/courier-ui-inbox) | Web components for Courier Inbox |
| [`courier-react`](./@trycourier/courier-react) | React components for Courier Inbox and more |
