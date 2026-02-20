const { mongo, default: mongoose } = require('mongoose');
const Article = require('../models/article');


module.exports.getArticles = (req, res) => {
  Article.find({ owner: req.user._id })
    .then(articles => res.send({ data: articles }))
    .catch(err => {
      console.error('Error al recibir los articulos:', err);
      res.status(500).send({ 
        message: 'Error en el servidor', 
        error: err.message 
      });
    });
};

module.exports.addArticle = (req, res) => {
  const { 
    keyword, 
    title, 
    description, 
    urlToImage, 
    publishedAt
    
    } 
    = req.body;
  const owner = req.user._id;
  Article.create({  
    keyword,
    title, 
    description, 
    urlToImage, 
    publishedAt,
     
    owner 
    })
    .then(article => res.status(201).send({ data: article }))
    .catch(err => {
      console.error('Error al agregar el articulo:', err);
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Datos del artículo no válidos',
          error: err.message
        });
      }
      res.status(500).send({ 
        message: 'Error del servidor', 
        error: err.message 
      });
    });
};

module.exports.deleteArticle = (req, res) => {
  const { articleId } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(articleId)) {
    return res.status(400).send({
      message: 'ID del artículo no válido'
    });
  }
  
  Article.findOneAndDelete({
    _id: articleId,
    owner: req.user._id,
  })
    .select('+owner')
    .then(deletedArticle => {
      if (!deletedArticle) {
        return res.status(404).send({
          message: 'Artículo no encontrado o no tienes permisos'
        });
      }
      res.status(200).send({
        message: 'Artículo eliminado correctamente',
        data: deletedArticle
      });
    })
    .catch((err) => {
      console.error('Error deleting article:', err);
      res.status(500).send({
        message: 'Error del servidor', 
        error: err.message
      });
    });
};
