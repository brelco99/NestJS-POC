import "reflect-metadata";
import express from 'express';
import pkg from 'pg';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { AppDataSource } from './config/typeorm.config';
import { authenticateToken, authorize } from './middleware/auth.middleware';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


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
  port: 5432
});



// ~Swagger options (more built-in with Nest)
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Account Service API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/app.ts'],
};

// ~Swagger setup
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
app.post('/accounts', authenticateToken, authorize('admin'), async (req: Request, res: Response) => { // ~Authorization- example of successful admin creds
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
app.get('/accounts', authenticateToken, authorize('someone'), async (req: Request, res: Response) => { // ~Authorization- example of non admin creds failing
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
app.get('/accounts/:accountId', authenticateToken, async (req, res) => {
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

const users = {
  admin: {
    username: 'admin',
    password: 'admin123',
    role: 'admin'
  }
};


// ~Authorization- login endpoint
/**
 * @swagger
 * /accounts:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
app.post('/login', async (req: express.Request, res: express.Response) => {
  const { username, password } = req.body;

  // Check if user exists and password matches
  const user = users[username];
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate token with user info
  const token = jwt.sign(
    {
      username: user.username,
      role: user.role
    },
    'your-secret-key',
    { expiresIn: '24h' }
  );

  res.json({
    message: 'Login successful',
    token,
    user: {
      username: user.username,
      role: user.role
    }
  });
});


app.listen(3001, () => {  // Changed from 3000
  console.log('Server running on port 3001');
});