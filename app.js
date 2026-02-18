require('dotenv').config();
const express = require('express');
const axios = require('axios')
const mongoose = require('mongoose');
const cors = require('cors');
const articlesRouter = require('./routes/articles');
const usersRouter = require('./routes/users');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3001, BASE_PATH } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
  origin: [
    'http://newsfinalsprint.chickenkiller.com',
    'https://newsfinalsprint.chickenkiller.com',
    'http://www.newsfinalsprint.chickenkiller.com',
    'https://www.newsfinalsprint.chickenkiller.com',
    'http://api.newsfinalsprint.chickenkiller.com',
    'https://api.newsfinalsprint.chickenkiller.com',
    'https://news-explorer-frontend-amber.vercel.app/',
    'https://news-explorer-backend-seven.vercel.app/',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Accept',
    'Origin',
    'X-Requested-With',
    'Access-Control-Allow-Origin'
  ],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  maxAge: 86400,
}));

mongoose.connect(
  process.env.MONGODB_URI ||
  'mongodb+srv://app_user:NewsExplorerApp2026@cluster0.ktbqxad.mongodb.net/?appName=Cluster0', {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  tls: true,
  tlsCertificateKeyFile:'./X509-cert-8739053631668568416.pem' 
}
)
.then(() => console.log('Conexión a la base de datos establecida'))
.catch(err => console.error('Error al conectar a la base de datos:', err));

app.get('/newsapi/everything', async (req, res) => {
    try {
        const { q, from, to, pageSize = 100, language = 'en' } = req.query;
        
        const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                q,
                from,
                to,
                pageSize,
                language,
                apiKey: process.env.NEWS_API_KEY || 'bb038d706db04c6d8689ab4692d52f3e'
            }
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('Proxy error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        res.status(error.response?.status || 500).json({ 
          error: 'Error fetching news',
          details: error.response?.data || error.message 
        });
    }
});

app.post('/signup', createUser);
app.post('/signin', login);

app.use('/articles', auth, articlesRouter);
app.use('/users', auth, usersRouter);

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log('================================');
  console.log(`Servidor corriendo en puerto: ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log('Endpoints disponibles:');
  console.log(`  • POST /signup`);
  console.log(`  • POST /signin`);
  console.log(`  • GET /newsapi/everything?q=...`);
  console.log(`  • GET /articles (protegido)`);
  console.log(`  • GET /users/me (protegido)`);
  console.log('================================');
});
