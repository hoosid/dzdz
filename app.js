var createError = require('http-errors');
var express = require('express');
var path = require('path');
const { PrismaClient } = require('@prisma/client'); // Importer PrismaClient
const prisma = new PrismaClient(); // Initialiser PrismaClient

// Importer les routes
var usersRouter = require('./routes/users');
var homepage = require('./routes/homepage');
var contact = require('./routes/contact');
var login = require('./routes/login');
var about = require('./routes/about');
var admin_crud = require('./routes/admin/admin');
var etidiant_admin = require('./routes/adminictraction/etudiant');
var etidiant_prof = require('./routes/adminictraction/prof');
var prof = require('./routes/prof/add_cour');
var coures = require('./routes/cours');
var update = require('./routes/adminictraction/update_prof_etudiant');

// Initialiser l'application Express
var app = express();

// Configuration du moteur de vue
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Définir les routes
app.use('/', contact);
app.use('/', homepage);
app.use('/', login);
app.use('/', about);
app.use('/', admin_crud);
app.use('/', etidiant_admin);
app.use('/', etidiant_prof);
app.use('/', prof);
app.use('/', coures);
app.use('/', update);
app.use('/users', usersRouter);

// Route pour la page d'accueil avec Prisma
app.get('/home', async (req, res) => {
  try {
      const admin = await prisma.admin.findMany(); 
      res.render('home', { admin: admin });
  } catch (error) {
      console.error('Erreur lors de la récupération des administrateurs :', error);
      res.status(500).send('Une erreur s\'est produite lors de la récupération des administrateurs');
  }
});

// Gestion des erreurs 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Gestion des erreurs générales
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Démarrer le serveur
app.listen(10000, () => {
  console.log("Server is running on port 10000");
});

