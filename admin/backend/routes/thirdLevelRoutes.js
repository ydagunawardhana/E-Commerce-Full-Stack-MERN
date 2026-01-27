import express from 'express';
import { 
  createThirdLevel, 
  getThirdLevels, 
  getThirdLevelById, 
  updateThirdLevel, 
  deleteThirdLevel 
} from '../controllers/thirdLevelController.js'; 

const router = express.Router();

router.route('/')
  .post(createThirdLevel) 
  .get(getThirdLevels);   

router.route('/:id')
  .get(getThirdLevelById) 
  .put(updateThirdLevel)  
  .delete(deleteThirdLevel); 

export default router;