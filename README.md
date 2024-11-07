# SvelteShip-SOEN-343

SOEN 343 Fall 2024, Concordia University – Section HH / Lab Section HI-X

TA: Beavan Joe Mathias

## About

This project, aptly named SvelteShipSolutions, is a web application built with
SvelteKit for package delivery services.

> Please note that this project is for educational purposes and is part of a
> university assignment. It's not intended for commercial use.

## Team Members

| Name                        | Student ID | Sub-Team No. |
| --------------------------- | ---------- | ------------ |
| Giuliano Verdone            | 40252190   | 3            |
| Brian Tkatch                | 40191139   | 3            |
| Jeremy Vieira               | 40246737   | 1            |
| Laurenz Gomez               | 40247966   | 1            |
| David Carciente (Team Lead) | 40247907   | 2            |
| Nirav Patel                 | 40248940   | 2            |

## VSCode Setup

1. Install the `Svelte for VS Code` and `Svelte Intellisense` VSCode Extensions
2. Install the `Prisma` VSCode Extension
3. Install the `Tailwind CSS InteliSense` VSCode Extension
4. Install the `Prettier` VSCode Extension
5. Configure Prettier to format on save in VSCode's settings by adding this
   configuration to you VSCode settings.json file (accessible through settings)

```json
   "editor.formatOnSave": true,
   "[svelte]": {
      "editor.defaultFormatter": "svelte.svelte-vscode"
   },
   "[prisma]": {
      "editor.defaultFormatter": "Prisma.prisma"
   },
```

6. Another useful extension for live collaboration is `Live Share`

### Installing Docker

A docker container is used in development to create a dev database. You'll need
to [install](https://docs.docker.com/desktop/install/windows-install/) docker on
your computer to be able to use the necessary commands.

### Environment Variables

Secrets and other configuration values are managed through environment
variables. When developing locally, they can be configured by creating a `.env`
file in the project's root.

> **Note**: Default values should be optimized for local development, such that
> a developer can clone and run the project successfully without having to
> override any configuration values.

The following variables can be configured:

| VAR                   | DESC                                                 | DEFAULT                                                                                 |
| --------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------- |
| PUBLIC_BASE_URL       | The base URL of the project                          | `http:/localhost:5173`                                                                  |
| DB_HOST               | The dev database host                                | `localhost`                                                                             |
| DB_USER               | The dev database username                            | `devuser`                                                                               |
| DB_PASSWORD           | The dev database password                            | `supersecret`                                                                           |
| DB_NAME               | The dev database name                                | `devdb`                                                                                 |
| DB_PORT               | The dev database port                                | `5433`                                                                                  |
| DATABASE_URL          | The database URL (used by Prisma)                    | `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public` |
| DIRECT_DATABASE_URL   | Used in development environment to keep Prisma happy | `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public` |
| EXEC_ENV              | Current execution environment                        | `development`                                                                           |
| SESSION_SIGNING_KEY   | 32 random bytes in hex format, used to sign sessions | `6bd8a14a0d6333b239ae45260618f09cae07c45bef34d4b1c21e7d64d13254b0`                      |
| STRIPE_SECRET_KEY     | Prefixed by sk_test\_, used to call the Stripe API   | `{YOUR_STRIPE_SECRET_KEY}`                                                              |
| STRIPE_SIGNING_SECRET | Prefixed by whsec\_, used to verify event signatures | `{YOUR_STRIPE_WEBHOOK_SIGNING_SECRET}`                                                  |

### Starting the Dev Environment

Use
[nvm](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/)
to install the proper version of node for the project (can be found in
`package.json` in the `engines` object):

```bash
nvm install 18
```

Install the node dependencies:

```bash
npm install
```

Use docker compose to start the development database:

```bash
docker compose up

# or run the docker container in detached mode (runs in the background)
docker compose up -d
```

Start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Pre-commit Hook with Husky

In order to initialize the pre-commit hook used in the project, use the
following command:

```bash
npx husky install
```

### Prisma

#### Prototype Database Change:

To prototype a change to the Prisma schema and sync the modification with your
development database, use the following command:

```bash
npx prisma db push
```

#### Create Database Migration:

When the Prisma schema is in a stable condition (in the desired state), create a
[migration](https://www.prisma.io/docs/orm/prisma-migrate/getting-started) file
with:

```bash
prisma migrate dev
```

This migration file can then be used to update the databases in other
environments (preview, production).

For more detail, visit the
[Prisma Docs](https://www.prisma.io/docs/orm/prisma-migrate/workflows/prototyping-your-schema)
on the topic.

#### Seeding

To seed you local database during development, use this command:

```bash
npx prisma db seed
```

> **Note:** Preview deployments will automatically be seeded during the
> workflow.

#### Exploring the Database in Development:

If you want to see a visual representation of the database, use the
[Prisma Studio](https://www.prisma.io/docs/orm/tools/prisma-studio) tool by
running:

```bash
npx prisma studio
```

### Stripe

#### Setup Stripe CLI

Please follow the [Stripe CLI Install Docs](https://stripe.com/docs/stripe-cli),
specifically steps 1 (Install the Stripe CLI) and 2 (Log in to the CLI).
Installation instructions are listed for various operating systems.

The next section attempts to address issues that WSL2 users may have encountered
when attempting to get the Stripe CLI to work properly.

##### Stripe CLI WSL Note

If you're not using WSL, please move onto the next section.

A few versions ago, Stripe made changes to the CLI that broke it for WSL2 users.
A possible 3-step fix is provided below.

First, create a ".wslconfig" file in your Windows home folder, which is usually
at "C:\Users\<Your-Windows-User-Name>". You should also be able to open your
Windows home folder by entering %USERPROFILE% to Windows File Explorer.

Second, disable the WSL GUI by opening the ".wslconfig" file in a text editor
and add the following lines:

```bash
[wsl2]
guiApplications=false
```

Third, restart/shut down WSL by entering the following command in either Command
Prompt or PowerShell:

```bash
wsl --shutdown
```

Finally, to start WSL again:

```bash
wsl
```

This should have fixed issues for WSL2 users.

#### Reveal a secret API key for test mode

In test mode, you can reveal a secret API key as many times as you want.

To reveal a secret key in test mode:

1.  In the Developers Dashboard, select the
    [API keys](https://dashboard.stripe.com/test/apikeys) tab.
2.  In the **Standard keys** list, in the **Secret key** row, click **Reveal
    test key**.
3.  Copy the key value by clicking it.
4.  Save the key value, which can then be assigned as the value to your
    STRIPE_SECRET_KEY environment variable.
5.  Click **Hide test key**.

#### Forward Stripe Webhooks

If you haven't done so already, login to your Stripe account via the CLI:

```bash
stripe login
```

Next, enter the command below to forward webhooks to the local server (this way,
there's no need to setup Ngrok or a public URL for local development):

```bash
stripe listen --forward-to localhost:5173/api/stripe/webhook
```

Finally, you should see a response message along the lines of: "Ready! [...]
Your webhook signing secret is {whsec_WEBHOOK_SIGNING_SECRET}". Please copy the
entire webhook signing secret and set it as your STRIPE_SIGNING_SECRET
environment variable.

> **Note:** this signing secret expires after 90 days, after which you'll have
> to replace your STRIPE_SIGNING_SECRET environment variable.

Much like the having a terminal dedicated for running the Docker container or
the development server, you'll have one running for to forward Stripe webhooks.

#### Test Mode

Finally, please have a look through the Stripe docs for test mode:
https://docs.stripe.com/test-mode. A key takeaway is that the test card number
for Visa credit card is "4242424242424242", with a CVC if any 3 digits and a
date with any future data. This test card will be useful for developers in
simulating a successful payment scenario.

### Before Merging

Before you created a merge request, make sure that your code is properly
formatted and linted using the following npm commands (located in `package.json`
under scripts):

- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Format: `npm run format`

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Deployment

A preview environment is created whenever a pull request is created and the
preliminary tests have passed. This can be used to review any changed made in a
production like environment.
