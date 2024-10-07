import { Sequelize } from 'sequelize';

// Connexion à la base de données
const sequelize = new Sequelize('asb_project', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

// Synchronise les modèles avec la base de données
sequelize.sync({ force: false })
  .then(() => {
    console.log('Base de données synchronisée.');
  })
  .catch((error) => {
    console.error('Erreur de synchronisation avec la base de données :', error);
  });
  
export default sequelize;