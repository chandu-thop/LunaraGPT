
const jwt = require("jsonwebtoken");

const authMiddleWare=((req,res,next)=>{
    try{
        const token=req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({error:`unauthorized`});
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.userId=decoded.userId;

        next();
    }catch(err){
        return res.status(401).json({error:`unauthorized`});
    }
});

module.exports=authMiddleWare;
