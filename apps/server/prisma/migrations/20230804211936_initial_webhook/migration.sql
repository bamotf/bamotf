-- Create a Webhook for the account for development purposes
WITH account AS (
    SELECT id 
    FROM "Account" 
    WHERE name = 'Initial Account'
)
INSERT INTO "Webhook" (
    id, 
    mode, 
    description, 
    url, 
    secret, 
    "accountId", 
    "createdAt", 
    "updatedAt"
)
SELECT 
    uuid_generate_v4(), 
    'DEV', 
    'Development Webhook', 
    'http://localhost:3000/webhook/bamotf', 
    'DEV_WEBHOOK_SECRET', 
    account.id, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
FROM account;
