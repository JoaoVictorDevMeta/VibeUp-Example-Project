import prisma from "../../prisma/database.js";
import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({ message: "Não autorizado" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId
            }
        });

        if(!user){
            return res.status(404).json({ message: "Usuário não encontrado" });
        }
        const { password, ...userInfo } = user;
        req.user = userInfo;
        next();
    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export default protectRoute;