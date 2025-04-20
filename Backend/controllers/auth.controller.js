import bcrypt from "bcryptjs"

export const register=async(req, res){
    const {email, password, name}=req.body;

    try {
        const existingUser=await db.user.findUnique({
            where:{
                email
            }
        })


        if(existingUser){
            return res.status(400).json({
                error:"USer already Exists"
            })
        }

        // const hashedPassword
    } catch (error) {
        
    }
}
export const login=async(req, res){}
export const logout=async(req, res){}
export const check=async(req, res){}