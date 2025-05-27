import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const connectDB = async () => {
  try {
    // Verificar si ya existe una conexión activa
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB ya está conectado');
      return;
    }

    // Validar que la URI esté definida
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI no está definida en el archivo .env');
      console.log('Por favor, asegúrate de tener un archivo .env con la variable:');
      console.log('MONGODB_URI="tu_uri_de_mongodb"');
      process.exit(1);
    }

    // Opciones de conexión
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    };

    // Conexión a MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error al conectar a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Eventos de conexión
mongoose.connection.on('connected', () => {
  console.log('✅ Conexión con MongoDB establecida correctamente');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error en la conexión con MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Conexión con MongoDB desconectada');
});

// Cierre de conexión al finalizar la app
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔒 Conexión con MongoDB cerrada por terminación de la app');
  process.exit(0);
});

export default connectDB;
