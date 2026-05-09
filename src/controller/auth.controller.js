const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function register(req,res){
    try{
            const {firstName,lastName,username,email,mobileNumber,password,role = "user"} = req.body;
            const existingUser  = await userModel.findOne({
                $or:[{
                    username:username
                },{
                    email:email
                }]
            })
            if(existingUser){
                return res.status(409).json({message:"Username or email already exists",status:409});
            }
            const hashedPassword = await bcrypt.hash(password,10);

            const newUser = await userModel.create({
                firstName,
                lastName,
                username,
                email,
                mobileNumber,
                password: hashedPassword,
                role
            })
             const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET)
             res.cookie('token',token)
            return res.status(201).json({message:"User registered successfully",status:201,user: newUser});

    }

    catch(err){
             console.log("Error in register controller",err);
       return res.status(500).json({message:"Internal server error",status:500});
  
        
    }
}

async function login(req,res){
    const { username , email, password } = req.body;
    try{
      const user = await userModel.findOne({
    $or: [
        { username: username },
        { email: email }
    ]
   });
        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(401).json({message:"Invalid password"})
        }
        const token  = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET)
        res.cookie('token',token)
        return res.status(200).json({message:"Login successful", user:{
            id:user._id,
            firstName:user.firstName,
            lastName:user.lastName,
            username:user.username,
            email:user.email,
            mobileNumber:user.mobileNumber,
            role:user.role
        },token})
    }
    catch(err){
        return res.status(500).json({message:"Internal server error"});
        console.log("Error in login controller",err);
    }
}

// async function login(req,res){
//     const { username , email, password } = req.body;
//     try{
//       const user = await userModel.findOne({
//     $or: [
//         { username: username },
//         { email: email }
//     ]
//    });
//         if(!user){
//             return res.status(404).json({message:"User not found"})
//         }

//         const isPasswordValid = await bcrypt.compare(password,user.password);
//         if(!isPasswordValid){
//             return res.status(401).json({message:"Invalid password"})
//         }
//         const token  = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET)
//         res.cookie('token',token)
//         return res.status(200).json({message:"Login successful", user:{
//             id:user._id,
//             username:user.username,
//             email:user.email,
//             role:user.role
//         },token})
//     }
//     catch(err){
//         return res.status(500).json({message:"Internal server error"});
//         console.log("Error in login controller",err);
//     }
// }
module.exports = {register,login}