import express from 'express'
import { changePassword, createAccount, forgotPassword, loginUser, verifyAccount } from "../controllers/Auth";
import { verfiyUser } from '../middlewares/authentication';


const router = express.Router();

router.post("/createAccount",createAccount)
router.post("/accountVerification",verfiyUser,verifyAccount)
router.post("/login",loginUser)
router.post("/forgotpassword",forgotPassword)
router.post("/createNewPassword",verfiyUser,changePassword)




