# `courier-web`

A monorepo that contains all packages for Courier's browser SDKs.

## Getting Started

### In VSCode IDEs

1. Open the `.vscode` folder, click `courier-web.code-workspace` then click the blue **"Open Workspace"** button in the bottom right
![VSCode workspace selection](https://github.com/user-attachments/assets/0d7d1a5f-6664-4b9f-8071-26d1e7521cba)

2. Click the **"Sync Packages"** button to install all dependencies
!["Sync Packages" button in VSCode](https://github.com/user-attachments/assets/8326a66d-2d8a-4831-880a-d165e48a7fa4)

This will set up your development environment with all the necessary packages and configurations.

> You may need to click **"Sync Packages"** during development if some local packages get out of sync with each other.

### In the console

The Courier Web monorepo uses [Yarn workspaces](https://classic.yarnpkg.com/blog/2017/08/02/introducing-workspaces/) to manage dependencies.

1. Get setup with Node (using [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)) and [Yarn](https://classic.yarnpkg.com/lang/en/docs/install)

    ```sh
    nvm use
    ```

2. From the `courier-web` directory, install workspace dependencies. This will:

    - Install top-level dependencies
    - symlink each workspace into the top-level **node_modules**
    - Install workspaces' dependencies in their respective **node_modules**.

    ```sh
    yarn install
    ```

3. Build the packages

    ```sh
    yarn build-packages
    ```

## Packages

| Package | Description |
|---------|-------------|
| [`courier-js`](./@trycourier/courier-js) | The base API client and shared instance singleton for Courier's JavaScript Browser SDK |
| [`courier-ui-core`](./@trycourier/courier-ui-core) | Web components used in UI level packages |
| [`courier-ui-inbox`](./@trycourier/courier-ui-inbox) | Web components for Courier Inbox |
| [`courier-react-components`](./@trycourier/courier-react-components/) | Shared package of React components for `courier-react` and `courier-react-17` |
| [`courier-react`](./@trycourier/courier-react) | React 18+ components for Courier Inbox |
| [`courier-react-17`](./@trycourier/courier-react-17/) | React 17 components for Courier Inbox |

## Versioning and releasing

Package versions and changelogs are maintained by [changesets](https://github.com/changesets/changesets).

### Steps for courier-web developers

1. [Add a changeset file](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md) to your PR,
   either by running `yarn changeset` or using the [Changeset bot](https://github.com/apps/changeset-bot)
   that validates PRs contain changeset files.
2. Changesets will maintain a PR "Version Packages", that bumps package versions appropriately and maintains the
   changelog.
3. When you're ready to release, merge the "Version Packages" PR and run the release commands:

   ```sh
   yarn workspace <package_name> release
   ```

   ```sh
   gh release create "$package_name@v$version" \
     --title "$package_name@$version" \
     --notes "Release of $package_name@$version"
   ```
