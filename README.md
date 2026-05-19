# Order Me – Deployment

## Prerequisites
- Docker & Docker Compose installed on server.

## Steps to deploy

1. Clone the repository (or copy the entire project folder).
2. Place the `.env.production` file (provided separately) in the **project root**.
3. Run the following command from the project root:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d