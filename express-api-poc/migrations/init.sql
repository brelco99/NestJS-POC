CREATE TABLE account (
 account_id SERIAL PRIMARY KEY,
 firestore_id VARCHAR(255) NOT NULL,
 name VARCHAR(255) NOT NULL
);