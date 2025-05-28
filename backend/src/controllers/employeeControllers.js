import employeeModel from "../models/employee.js";

const employeeController = {};

// Obtener todos los empleados
employeeController.getAllEmployees = async (req, res) => {
  try {
    const employees = await employeeModel.find()
      .populate('department')
      .populate('supervisor');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un empleado por ID
employeeController.getEmployeeById = async (req, res) => {
  try {
    const employee = await employeeModel.findById(req.params.id)
      .populate('department')
      .populate('supervisor');
    
    if (!employee) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }
    
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener empleados por departamento
employeeController.getEmployeesByDepartment = async (req, res) => {
  try {
    const employees = await employeeModel.find({ department: req.params.departmentId })
      .populate('department')
      .populate('supervisor');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo empleado
employeeController.createEmployee = async (req, res) => {
  try {
    console.log('Datos recibidos:', req.body);
    
    // Extraer datos del cuerpo de la solicitud
    const {
      name,
      lastName,
      birthday,
      email,
      address,
      password,
      hireDate,
      telephone,
      dui,
      issnumber, // El frontend lo envía como issnumber
      isVerified
    } = req.body;

    // Crear el nuevo empleado con mapeo de campos correctos
    const newEmployee = new employeeModel({
      name,
      lastName,
      birthday,
      email,
      address,
      password,
      hireDate,
      telephone,
      dui,
      issNumber: issnumber, // Mapear issnumber a issNumber
      isVerified,
      // Valores predeterminados para campos requeridos por el modelo
      position: 'employee',
      salary: 0,
      status: 'active'
    });

    const savedEmployee = await newEmployee.save();
    console.log('Empleado guardado:', savedEmployee);
    res.status(201).json(savedEmployee);
  } catch (error) {
    console.error('Error al crear empleado:', error);
    res.status(400).json({ error: error.message });
  }
};

// Actualizar un empleado
employeeController.updateEmployee = async (req, res) => {
  try {
    console.log('Actualizando empleado ID:', req.params.id);
    console.log('Datos recibidos:', req.body);
    
    // Extraer datos del cuerpo de la solicitud
    const {
      name,
      lastName,
      birthday,
      email,
      address,
      password,
      hireDate,
      telephone,
      dui,
      issnumber, // El frontend lo envía como issnumber
      isVerified
    } = req.body;

    // Preparar objeto de actualización
    const updateData = {
      name,
      lastName,
      email,
      telephone,
      dui
    };

    // Agregar campos opcionales si existen
    if (birthday) updateData.birthday = birthday;
    if (address) updateData.address = address;
    if (password) updateData.password = password;
    if (hireDate) updateData.hireDate = hireDate;
    if (issnumber) updateData.issNumber = issnumber; // Mapear issnumber a issNumber
    if (isVerified !== undefined) updateData.isVerified = isVerified;

    const updatedEmployee = await employeeModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: false }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    console.log('Empleado actualizado:', updatedEmployee);
    res.json(updatedEmployee);
  } catch (error) {
    console.error('Error al actualizar empleado:', error);
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un empleado
employeeController.deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await employeeModel.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }
    res.json({ message: 'Empleado eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar empleados por nombre o apellido
employeeController.searchEmployees = async (req, res) => {
  try {
    const { query } = req.params;
    const employees = await employeeModel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } }
      ]
    })
    .populate('department')
    .populate('supervisor');
    
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default employeeController;
