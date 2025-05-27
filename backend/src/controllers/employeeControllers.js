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
    const {
      name,
      lastName,
      birthday,
      email,
      telephone,
      dui,
      issNumber,
      hireDate,
      position,
      salary,
      department,
      supervisor
    } = req.body;

    const newEmployee = new employeeModel({
      name,
      lastName,
      birthday,
      email,
      telephone,
      dui,
      issNumber,
      hireDate,
      position,
      salary,
      department,
      supervisor
    });

    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar un empleado
employeeController.updateEmployee = async (req, res) => {
  try {
    const {
      name,
      lastName,
      birthday,
      email,
      telephone,
      dui,
      issNumber,
      hireDate,
      position,
      salary,
      department,
      supervisor,
      status
    } = req.body;

    const updatedEmployee = await employeeModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        lastName,
        birthday,
        email,
        telephone,
        dui,
        issNumber,
        hireDate,
        position,
        salary,
        department,
        supervisor,
        status
      },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    res.json(updatedEmployee);
  } catch (error) {
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
