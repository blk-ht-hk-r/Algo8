const jwt = require("jsonwebtoken")

async function verifyClient(req, res, next){
    try {
        const authorisationHeader = req.headers.authorisation
        const bearerToken = authorisationHeader.split(" ")[1]
        const payload = jwt.verify(bearerToken , "Samyakjainismyname")
        req.user = {id : payload.id}
        next()
    } catch (error) {
        console.log(error)
        res.sendStatus(403).end()
    }
}

module.exports = verifyClient;