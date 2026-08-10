const express = require('express');
const sequelize = require('./config/database');
const orderRoutes = require('./routes/orderRoutes');
const shipmentRoutes = require('./routes/shipmentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/shipping/orders', orderRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/shipping/shipments', shipmentRoutes);

// Health check endpoint
app.get(['/health', '/api/shipping/health'], async (req, res) => {
  let dbStatus = 'UNKNOWN';
  try {
    await sequelize.authenticate();
    dbStatus = 'CONNECTED';
  } catch (err) {
    dbStatus = `DISCONNECTED: ${err.message}`;
  }

  res.status(200).json({
    status: 'UP',
    database: dbStatus,
  });
});

// Initialize database and start server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL database connection established successfully.');

    // Sync models with database
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized successfully.');

    app.listen(PORT, () => {
      console.log(`Shipping service listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to PostgreSQL database:', error);
    process.exit(1);
  }
}

startServer();
