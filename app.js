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
app.use(express.json());

app.use(cors({
  origin: [
    'https://newsfinalsprint.chickenkiller.com',
    'https://www.newsfinalsprint.chickenkiller.com',
    'https://api.newsfinalsprint.chickenkiller.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

mongoose.connect(
  process.env.MONGODB_URI ||
  'mongodb://app_user:NewsExplorerApp2026!@localhost:27017/news_explorer?authSource=news_explorer', {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000, 
})
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
        console.error('Proxy error:', error.message);
        res.status(500).json({ 
            error: 'Error fetching news',
            details: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', createUser);

app.post('/signin', login);

app.use('/articles', auth, articlesRouter);
app.use('/users', auth, usersRouter);

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log('Enlace al servidor en el puerto:', PORT);
  console.log(BASE_PATH);

})
