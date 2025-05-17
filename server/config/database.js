import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
});

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');
    
    await sequelize.sync(); 
    console.log('Database tables verified');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();

export default sequelize;