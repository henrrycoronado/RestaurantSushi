import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/index.js';
import os from 'os';

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  env: process.env.ENV || 'dev',
  corsOrigin: process.env.FRONTEND_URL,
};

const app = express();
const corsOptions = {
  origin: config.env === 'dev' ? '*' : config.corsOrigin,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'API de RestaurantSushi funcionando.',
    version: '1.0.0',
    environment: config.env 
  });
});

app.use('/v1', apiRouter);


app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Ha ocurrido un error en el servidor', error: err.message });
});

app.listen(config.port, () => {
  console.log(`✅ Servidor iniciado.`);
  console.log(`   - Entorno: ${config.env.toUpperCase()}`);
  console.log(`   - Puerto: ${config.port}`);
  if (config.env === 'dev') {
    console.log(`   - Local:    http://localhost:${config.port}`);
    const networkInterfaces = os.networkInterfaces();
    for (const name in networkInterfaces) {
        for (const net of networkInterfaces[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                console.log(`   - Network:  http://${net.address}:${config.port}`);
            }
        }
    }
  }
});