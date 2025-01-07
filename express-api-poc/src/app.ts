import "reflect-metadata"; 
import express from 'express';
import pkg from 'pg';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { AppDataSource } from './config/typeorm.config';

const { Pool } = pkg;

const app = express();
app.use(express.json());

AppDataSource.initialize()
 .then(() => console.log('TypeORM initialized'))
 .catch(err => console.error('TypeORM init error:', err));

const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'postgresexpress',
    database: 'accounts_db',
    port: 5432  // Changed from 5432
  });
  
  

// Swagger setup
const swaggerOptions = {
 definition: {
   openapi: '3.0.0',
   info: {
     title: 'Accounts API',
     version: '1.0.0',
   },
 },
 apis: ['./src/app.ts'],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
* @swagger
* /accounts:
*   post:
*     summary: Create a new account
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               firestoreId:
*                 type: string
*               name:
*                 type: string
*     responses:
*       201:
*         description: Account created successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 account_id:
*                   type: integer
*                 firestore_id:
*                   type: string
*                 name:
*                   type: string
*             example:
*               account_id: 1
*               firestore_id: "abc123"
*               name: "Test Account"
*       500:
*         description: Server error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*             example:
*               error: "Error message"
*/
app.post('/accounts', async (req, res) => {
 try {
   const { firestoreId, name } = req.body;
   const result = await pool.query(
     'INSERT INTO account (firestore_id, name) VALUES ($1, $2) RETURNING *',
     [firestoreId, name]
   );
   res.json(result.rows[0]);
 } catch (err) {
   res.status(500).json({ error: err.message });
 }
});

/**
* @swagger
* /accounts:
*   get:
*     responses:
*       200:
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   account_id:
*                     type: integer
*                   firestore_id:
*                     type: string
*                   name:
*                     type: string
*             example: [
*               {
*                 "account_id": 1,
*                 "firestore_id": "abc123",
*                 "name": "Test Account"
*               }
*             ]
*/
app.get('/accounts', async (req, res) => {
 try {
   const result = await pool.query('SELECT * FROM account');
   console.log('Request body:', req.body);
   res.json(result.rows);
 } catch (err) {
  console.error('Detailed Error:', err);
   res.status(500).json({ error: err.message });
 }
});

/**
* @swagger
* /accounts/names:
*   get:
*     responses:
*       200:
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   name:
*                     type: string
*             example: [
*               {
*                 "name": "Test Account"
*               }
*             ]
*/
app.get('/accounts/names', async (req, res) => {
 try {
   const result = await pool.query('SELECT name FROM account');
   res.json(result.rows);
 } catch (err) {
   res.status(500).json({ error: err.message });
 }
});

/**
* @swagger
* /accounts/{accountId}:
*   get:
*     summary: Get account by ID
* 
*     parameters:
*       - in: path
*         name: accountId
*         required: true
*         schema:
*           type: integer
*     responses:
*       200:
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 account_id:
*                   type: integer
*                 firestore_id:
*                   type: string  
*                 name:
*                   type: string
*             example:
*               account_id: 1
*               firestore_id: "abc123"
*               name: "Test Account"
*  
*/
app.get('/accounts/:accountId', async (req, res) => {
 try {
   const result = await pool.query(
     'SELECT * FROM account WHERE account_id = $1',
     [req.params.accountId]
   );
   if (result.rows.length === 0) {
     return res.status(404).json({ error: 'Account not found' });
   }
   res.json(result.rows[0]);
 } catch (err) {
   res.status(500).json({ error: err.message });
 }
});

app.listen(3001, () => {  // Changed from 3000
    console.log('Server running on port 3001');
  });