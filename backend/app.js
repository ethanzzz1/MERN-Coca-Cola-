const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/database');
const productsRoutes = require("./src/routes/products");
const customersRoutes = require("./src/routes/customers");
const employeeRoutes = require("./src/routes/employees");
const branchesRoutes = require("./src/routes/branches");
const reviewsRoutes = require("./src/routes/reviews");
const registerEmployeesRoutes = require("./src/routes/registerEmployees");
const loginRoutes = require("./src/routes/login");
const cookieParser = require("cookie-parser");
const logoutRoutes = require("./src/routes/logout");
const registerClients = require("./src/routes/registerClients");
const passwordRecoveryRoutes = require("./src/routes/passwordRecovery");
const blogRoutes = require("./src/routes/blog");

// Configurar variables de entorno
dotenv.config();

// Crear la aplicación Express
const app = express();

// Configurar middleware
app.use(express.json());
app.use(cookieParser());

// Definir rutas
app.use("/api/products", productsRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/branches", branchesRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/blog", blogRoutes);

app.use("/api/registerEmployees", registerEmployeesRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/logout", logoutRoutes);

app.use("/api/registerClients", registerClients);
app.use("/api/passwordRecovery", passwordRecoveryRoutes);

// Conectar a la base de datos
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Iniciar el servidor
startServer();

// Exportar la aplicación para otros archivos
module.exports = app;
