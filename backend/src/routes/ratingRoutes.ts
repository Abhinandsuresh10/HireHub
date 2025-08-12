import express from 'express';
import { RatingService } from '../services/impliments/ratingService';
import { ratingRepository } from '../repositories/impliments/ratingRepository';
import { ratingController } from '../controllers/impliments/ratingController';
import { verifyJWT } from '../middlewares/VerifyMiddileware';

const repository = new ratingRepository();
const service = new RatingService(repository);
const ratingControllers = new ratingController(service);

const ratingRoutes = express.Router();

ratingRoutes.route('/rating').post(verifyJWT, ratingControllers.addRating).get(verifyJWT, ratingControllers.getRating);

export default ratingRoutes;