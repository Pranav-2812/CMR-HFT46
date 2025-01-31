var jwt = require('jsonwebtoken');
const JWTSecrect = process.env.VITE_JWT_SECRECT;
const getowner= (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error:"Invalid token"});
    }
    try {
       const data = jwt.verify(token,JWTSecrect);
       req.owner = data.owner;
       next(); 
    } catch (error) {
        res.status(401).send({error:"Invalid token"});
    }
   
}
module.exports = getowner;