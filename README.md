# Anonymous Systems Web Application


This repository contains the codebase for the Anonymous Systems web application,
organized as a monorepo with both frontend and backend projects.
The stack includes React, TypeScript, Tailwind CSS, shadcn/ui, and Firebase.
The frontend is customer-facing, while the backend serves administrative functions.

## Project Structure

- **Frontend:** Located in `apps/frontend`. Contains all customer-facing UI code.
- **Backend:** Located in `apps/admin`. Contains admin-facing backend services.

## 🚀 Getting Started

This section will guide you through setting up your local development environment.

### Prerequisites

Ensure you have the following tools installed on your system:

*   **Node.js**: Version 22 or later.
*   **pnpm**: This project uses `pnpm` for package management. Install it globally with:
    ```bash
    npm install -g pnpm
    ```
*   **Google Cloud CLI**: Required for authenticating with Firebase services for local development. You can find installation instructions here.

### Installation

1.  Clone the repository to your local machine:
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  Install the project dependencies using `pnpm`:
    ```bash
    pnpm install
    ```

### Environment Setup

1.  **Firebase Configuration**:
    *   Create a `cypress.env.json` file by copying the example:
        ```bash
        cp cypress.env.example.json cypress.env.json
        ```
    *   Fill in the required Firebase project configuration values in `cypress.env.json`.

2.  **Application Environment**:
    *   Create a `.env` file inside the `apps/frontend` directory from the example:
        ```bash
        cp apps/frontend/.env.example apps/frontend/.env
        ```
    *   For local development with Firebase emulators, your `.env` file should contain the emulator host variables. See `docs/NOTES.md` for more details.

3.  **Authenticate with Google Cloud**:
    *   To run the Firebase emulators and interact with Google Cloud services locally, you need to authenticate. Run the following command, replacing `SERVICE_ACCT_EMAIL` with the appropriate service account email:
        ```bash
        gcloud auth application-default login --impersonate-service-account SERVICE_ACCT_EMAIL
        ```

### Running the Application

To start the development servers for all applications and the Firebase emulators, run:
```bash
pnpm dev:emulators
```


## 🤝 Feedback & Support

Have feedback, suggestions, or need help?
Email me at [aaron.jones@anonsys.tech](mailto:aaron.jones@anonsys.tech)


License: [MIT](https://choosealicense.com/licenses/mit/)