import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('LearningHub', 'postgres', 'postgres', {
  host: 'localhost', 
  port: 5432,
  dialect: 'postgres',
  logging: false,
});


sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

sequelize.sync({ alter: false })
  .then(() => {
    console.log('Database synced successfully.');
  })
  .catch((error) => {
    console.error('Failed to sync database:', error);
  });

export default sequelize;
