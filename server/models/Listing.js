import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Listing = sequelize.define('Listing', {
  id: { type: DataTypes.STRING, primaryKey: true },
  title: DataTypes.STRING,
  price: DataTypes.STRING,
  date: DataTypes.STRING,
  location: DataTypes.STRING,
  link: DataTypes.STRING,
  image: DataTypes.STRING,
  createdAt: DataTypes.DATE
});

export default Listing;