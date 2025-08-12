import express from 'express';
import { premiumRepository } from '../repositories/impliments/premiumRepository';
import { premiumService } from '../services/impliments/premiumService';
import { premiumController } from '../controllers/impliments/premiumController';
import { verifyJWT } from '../middlewares/VerifyMiddileware';

const premiumRoutes = express.Router();

const premiumRepositorys = new premiumRepository();
const premiumServices = new premiumService(premiumRepositorys);
const premiumControllers = new premiumController(premiumServices);


premiumRoutes.route('/premium')
.post(verifyJWT, premiumControllers.addPremium)
.get(verifyJWT, premiumControllers.getPremiums)
.patch(verifyJWT, premiumControllers.patchPremium)
.put(verifyJWT, premiumControllers.updatePremium);

premiumRoutes.delete('/premiumDelete/:id', verifyJWT, premiumControllers.deletePremium);
premiumRoutes.get('/premiumGet/:id', verifyJWT, premiumControllers.getApremium);
premiumRoutes.get('/premiums', verifyJWT, premiumControllers.getAllPremiums);



export default premiumRoutes;