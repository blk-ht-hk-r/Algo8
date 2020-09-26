const jwt = require("jsonwebtoken")
const User = require("../models/User")

async function verifyAdmin(req, res, next){
    try {
        const authorisationHeader = req.headers.authorisation
        const bearerToken = authorisationHeader.split(" ")[1]
        const payload = jwt.verify(bearerToken , "Samyakjainismyname")
        const loggedInUser = User.findById(payload.id)

        //Checkig for the user to be admin
        if(!loggedInUser.isAdmin){
            return res.sendStatus(403).send({ message : "Only Admins have Access" })
        }
        req.user = {id : payload.id}
        next()
    } catch (error) {
        console.log(error)
        res.sendStatus(403).end()
    }
}

module.exports = verifyAdmin;