import express from "express";
import reviewsController from "../controllers/reviewsController.js";

const router = express.Router();

router
  .route("/")
  .get(reviewsController.getAllReviews)       
  .post(reviewsController.createReview);      

router
  .route("/:id")
  .put(reviewsController.updateReview)        
  .delete(reviewsController.deleteReview);   

// Agrega otras rutas adicionales si lo deseas, por ejemplo:
router.get("/product/:productId", reviewsController.getReviewsByProduct);
router.get("/customer/:customerId", reviewsController.getReviewsByCustomer);
router.get("/search/:query", reviewsController.searchReviews);
router.get("/stats/:productId", reviewsController.getProductReviewsStats);

export default router;
