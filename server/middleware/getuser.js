var jwt = require('jsonwebtoken');
const JWTSecrect = process.env.VITE_JWT_SECRECT;
const getuser= (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error:"Invalid token"});
    }
    try {
       const data = jwt.verify(token,JWTSecrect);
       req.user = data.user;
       next(); 
    } catch (error) {
        res.status(401).send({error:"Invalid token"});
    }
   
}
module.exports = getuser;