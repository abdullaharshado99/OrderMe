INSERT INTO roles (name, "createdAt", "updatedAt") VALUES 
('SUPER_ADMIN', NOW(), NOW()),
('RESTAURANT_OWNER', NOW(), NOW()),
('CHEF', NOW(), NOW()),
('CUSTOMER', NOW(), NOW());

TRUNCATE TABLE roles RESTART IDENTITY CASCADE;

DROP TABLE IF EXISTS subscription_plans CASCADE;

CREATE TABLE subscription_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    durationDays INTEGER NOT NULL,
    features TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


INSERT INTO subscription_plans (name, price, durationDays, features) VALUES
('Basic', 49, 30, 'Up to 50 orders/month, basic support'),
('Pro', 99, 30, 'Unlimited orders, priority support, inventory management'),
('Enterprise', 199, 30, 'Everything in Pro + dedicated account manager, API access');



ALTER TABLE warehouse_skus ADD COLUMN "restaurantId" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE purchase_orders ADD COLUMN "restaurantId" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE stock_transfers ADD COLUMN "restaurantId" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE suppliers ADD COLUMN "restaurantId" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE warehouse_audit_logs ADD COLUMN "restaurantId" INTEGER NOT NULL DEFAULT 1;


DROP TABLE IF EXISTS purchase_orders CASCADE;
DROP TABLE IF EXISTS warehouse_skus CASCADE;
DROP TABLE IF EXISTS stock_transfers CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS warehouse_audit_logs CASCADE;
DROP TABLE IF EXISTS purchase_order_items CASCADE;

DROP TABLE IF EXISTS pos_carts CASCADE;
DROP TABLE IF EXISTS pos_payments CASCADE;

ALTER TABLE menu_items ADD COLUMN "cuisine" VARCHAR;
ALTER TABLE menu_items ADD COLUMN "foodCategory" VARCHAR;


ALTER TABLE orders ADD COLUMN "station" VARCHAR;
ALTER TABLE orders ADD COLUMN "routingTime" TIMESTAMP;
ALTER TABLE orders ADD COLUMN "priority" VARCHAR;
ALTER TABLE orders ADD COLUMN "bumpedAt" TIMESTAMP;
ALTER TABLE orders ADD COLUMN "bumpedBy" VARCHAR;
