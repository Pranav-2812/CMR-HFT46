const { body, validationResult } = require('express-validator')
const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const Owner= require("../models/Owner");
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var random = require("random-string-alphanumeric-generator");
const JWTSecrect = process.env.VITE_JWT_SECRECT
const getuser = require('../middleware/getuser');
const getowner = require("../middleware/getowner");
const UserVehicle = require("../models/UserVehicle");
const Location = require("../models/Locations");
//new account
router.post("/Acc/newUser",[body('name').isEmpty().isLength({ min: 3 }),
    body('email').isEmail(), 
    body('password').isLength({ min: 5 }),
    body("mob").isLength({min:10}),
    body("vehicle_no").isEmpty()],
    async(req, res)=>{
        
        const result = validationResult(req)
        if (result.isEmpty()) {
            return res.status(400).json({success:false,errors:errors.array()})
        }
        try{
            let user= await User.findOne({vehicle_number:req.body.vehicle_number});
            if(user){
                return res.status(400).json({success:false, error:"Vehicle already registered"});
            }
            const salt = await bcrypt.genSalt(10);
            let hashPass;
           try {
             hashPass = await bcrypt.hash(req.body.password, salt)
           } catch (error) {
            console.log(error)
           }
           try {
            user = await User.create({
                name: req.body.name,
                email:req.body.email,
                password:hashPass,
                Mob_no:Number(req.body.mob),
                vehicle_number:req.body.vehicle_no,
                vehicle_type:req.body.vehicle_type,
                city:req.body.city,
                vehicles:req.body.vehicles
            })
            await UserVehicle.create({
                userId:user.id,
                vehicle_number:req.body.vehicle_no,
                vehicle_type:req.body.vehicle_type
            });
           } catch (error) {
            console.log(error)
           }
            const data = {
                user:{
                    id:user.id
                }
            }
            try {
                const jwtToken = jwt.sign(data, JWTSecrect,{expiresIn:"1h"});
                console.log("success")
                res.json({success:true,jwtToken,account:"user"});
            } catch (error) {
                console.log(error)
            }
            

        }
        catch (error) {
            console.log(error.message);
            res.status(500).send("Error occured");
        }
})
//owner acc
router.post("/Acc/Owner",[body('name').isEmpty().isLength({ min: 3 }),
    body('email').isEmail(), 
    body('password').isLength({ min: 5 }),
    body("city").isEmpty()],async(req, res)=>{
        const result = validationResult(req)
        if (result.isEmpty()) {
            return res.status(400).json({success:false,errors:errors.array()})
        }
        try{
            let owner= await Owner.findOne({email:req.body.email});
            if(owner){
                return res.status(400).json({success:false, error:"Account already exists"});
            }
            const salt = await bcrypt.genSalt(10);
            const hashPass = await bcrypt.hash(req.body.password, salt)
            const uccode = random.randomAlphanumeric(10, "uppercase");
            owner = await Owner.create({
                name: req.body.name,
                email:req.body.email,
                password:hashPass,
                Mob_no:req.body.Mob_no,
                city:req.body.city,
                locations:1,
                ucc:uccode
            })
            const data = {
                owner:{
                    id:owner.id
                }
            }
            const jwtToken = jwt.sign(data, JWTSecrect,{expiresIn:"1h"});
           
            res.json({success:true,jwtToken,account:"owner"});

        }
        catch (error) {
            console.log(error.message);
            res.status(500).send("Error occured");
        }
})
//llogin
router.post("/login/userac",body('email',"Enter valid Email").isEmail(),
body('password',"Password can't be empty").exists(),async(req,res)=>{
    let success = false;
    const result =validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({success,errors:result.array()})
    }
    const{email, password} = req.body;
    console.log(password)
    try {
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success,msg:"Enter valid credentials"});
        }
        const passComp = await bcrypt.compare(password,user.password);
        if(!passComp){
            return res.status(400).json({success,msg:"Enter valid credentials"});                
        }
        const data = {
            user:{
                id:user.id
            }
        }
        const jwtToken = jwt.sign(data, JWTSecrect,{expiresIn:"1h"});
        success = true
       res.json({success, jwtToken,account:"user"});
    }  catch (error) {
        console.log(error.message);
        res.status(500).send("Some Error occured");
    }
})
//ownerlogin
router.post("/login/ownerac",body('name').exists(),
body('password',"Password can't be empty").exists(),async(req,res)=>{
    let success = false;
    const result =validationResult(req);
    const{username, ucc, password} = req.body;
    
    if (!result.isEmpty()) {
        return res.status(400).json({success,errors:result.array()})
    }
    
    try {
        let owner = await Owner.findOne({ucc});
        if(!owner){
            return res.status(400).json({success,msg:"Enter valid credentials"});
        }
        const passComp = await bcrypt.compare(password,owner.password);
        if(!passComp){
            return res.status(400).json({success,msg:"Enter valid credentials"});                
        }
        const data = {
            owner:{
                id:owner.id
            }
        }
        const jwtToken = jwt.sign(data, JWTSecrect,{expiresIn:"1h"});
        success = true
       res.json({success, jwtToken, account:"owner"});
    }  catch (error) {
        console.log(error.message);
        res.status(500).send("Some Error occured");
    }
})
//get user data
router.post("/AccInfo/user",getuser,async(req,res)=>{
    let success = false;
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        success= true;
        res.status(200).json({success,user});
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some Error occured");
    }
});
router.post("/AccInfo/owner",getowner,async(req,res)=>{
    let success = false;
    try {
        const ownerID = req.owner.id;
        const owner = await Owner.findById(ownerID).select("-password");
        success= true;
        res.status(200).json({success,owner});
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some Error occured");
    }
});

router.delete("/delete/user",getuser,async(req,res)=>{
    try {
        let userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        if(!user){
            return res.status(400).json({success:false,msg:"NO account found!"});
        }
        await User.findByIdAndDelete(userId);
        await UserVehicle.find({userId:userId}).deleteMany({userId:userId});
        return res.status(200).json({success:true,msg:"Acoount Deleted"});
    } catch (error) {
        res.status(500).json({success:false,msg:"Some Error Occured"})
    }
});
router.delete("/delete/owner",getowner,async(req,res)=>{
    try {
        let ownerId = req.owner.id;
        const owner = await Owner.findById(ownerId).select("-password");
        if(!owner){
            return res.status(400).json({success:false,msg:"NO account found!"});
        }
        await Owner.findByIdAndDelete(ownerId);
        await Location.find({owner:ownerId}).deleteMany({owner:ownerId});
        return res.status(200).json({success:true,msg:"Account Deleted"});
    } catch (error) {
        res.status(500).json({success:false,msg:"Some Error Occured"})
    }
})
module.exports = router