import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
if(process.env.ENV != "dev"){
  app.use(cors({
    origin: process.env.FRONTEND_URL, 
    optionsSuccessStatus: 200 
  }));
}else{
  app.use(cors());
}
app.use(express.json());


app.use('/v1', apiRouter);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Ha ocurrido un error en el servidor', error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});