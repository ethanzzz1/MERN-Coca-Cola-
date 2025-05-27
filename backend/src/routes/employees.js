import express from "express";
import employeeController from "../controllers/employeeControllers.js";

const router = express.Router();

router
  .route("/")
  .get(employeeController.getAllEmployees)     
  .post(employeeController.createEmployee);   
router
  .route("/:id")
  .put(employeeController.updateEmployee)     
  .delete(employeeController.deleteEmployee); 

export default router;
