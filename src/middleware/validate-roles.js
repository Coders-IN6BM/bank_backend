export const hasRoles = (...roles) => {
    return (req, res, next) =>{
        if(!req.usuario){
            return res.status(500).json({
                success: false,
                message: "You want to verify a role before validating the token"
            })
        }

        if(!roles.includes(req.usuario.role)){
            return res.status(401).json({
                success: false,
                message:`The service requires one of these roles ${roles}`
            })
        }
        next()
    }
}