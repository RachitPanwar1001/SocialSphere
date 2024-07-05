const express = require("express");
const router = express.Router();
const {Users} = require("../models");
const bcrypt = require("bcrypt");
const {sign}  = require("jsonwebtoken");
const {validateToken} = require('../middlewares/AuthMiddleware')


router.post("/" , async (req , res)=>{
    const {userName , password} = req.body;
    bcrypt.hash(password , 5).then((hash)=>{
        Users.create({
            userName : userName,
            password : hash,
        });
        res.json("sucess");
    });
});

router.post("/login" , async(req , res)=>{
    const {userName , password} = req.body;

    const user = await Users.findOne({
        where: { userName : userName}
    });

    if(!user){
        res.json({error : "user doesn't exist"});
    }else{
        bcrypt.compare(password , user.password).then((match)=>{
            if(!match){
                res.json("Wrong Username ans Password Combinantion");
            }
            else{
                const accessToken = sign({userName : user.userName , id : user.id} ,"importantsecret");
                res.json({token : accessToken , 
                    userName : userName,
                    id : user.id
                });

            }
        })
    }
})

router.get('/auth' , validateToken , (req , res)=>{
    res.json(req.user);
})


module.exports=router;