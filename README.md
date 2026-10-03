# Project Structure

This workspace now includes a standard Node.js-style folder layout for backend code and shared utilities.

## Structure

- `src/` - application code
  - `config/` - environment and app configuration
  - `controllers/` - request handlers
  - `middleware/` - reusable request middleware
  - `models/` - data models / schemas
  - `routes/` - route definitions
  - `services/` - business logic
  - `utils/` - helper functions
  - `tests/` - automated tests

## Example entry point

- `src/server.js` starts the server
- `src/routes/index.js` defines route handlers

## Notes

- Keep environment variables in `.env` and use `.env.example` as the template.
- Put business logic in services instead of controllers to keep route handlers thin.
