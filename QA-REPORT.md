# StudyShare QA Report

## 1. Unit Testing

Vitest was used to create automated unit tests for the StudyShare
application.

The tests covered:

- Resource title validation
- PDF resource identification
- Resource search functionality
- Search behavior when no matching resource is found

The tests were executed locally and automatically through GitHub Actions.

## 2. Linting

ESLint was used on the React client to identify code-quality and
style issues.

The linting process was included in the CI pipeline so that code
quality is checked automatically when changes are pushed or submitted
through a Pull Request.

## 3. Build Testing

The React client was built using Vite through:

npm run build

The build process was included in GitHub Actions to ensure that the
application can successfully compile after changes.

## 4. Code Review

Feature development was carried out using Git branches and Pull
Requests. Changes were reviewed before being merged into the main
branch.

The review process checked code readability, functionality, naming,
and potential issues.

## 5. CI Pipeline

GitHub Actions was configured to:

1. Install server dependencies.
2. Run server tests.
3. Install client dependencies.
4. Run client tests.
5. Run ESLint.
6. Build the client application.

The pipeline was tested with both successful and intentionally
failing tests. The failed test was detected by GitHub Actions and
was subsequently corrected.
