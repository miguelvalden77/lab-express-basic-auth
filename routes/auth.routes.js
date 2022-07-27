const router = require("express").Router();
const User = require("../models/User.model")
const bcrypt = require("bcryptjs")
const isLogged = require("../middleware/auth")

router.get("/signup", (req, res, next)=>{
    res.render("auth/signup")
})

router.post("/signup", async (req, res, next)=>{

    const {username, password} = req.body

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
   
    await User.create({username, password: hashedPassword})

    res.redirect("/auth/login")
})

router.get('/login', (req, res, next)=>{
    res.render('auth/login')
})

router.post('/login', async (req, res, next)=>{
    try {
        const {username, password} = req.body
        const foundUser = await User.findOne({username})
        const validatedPassword = await bcrypt.compare(password, foundUser.password)

        if(validatedPassword === false){
            res.render("auth/login", {error: "Contraseña mala"})
            return
        }

        req.session.user = {
            _id: foundUser._id,
            email: foundUser.email,
            username: foundUser.username
        }


        req.session.save(() =>res.redirect('/auth/private'))
    
    } catch (error) {
        next(error)
    }    

})


router.get("/main", isLogged ,(req, res, next)=>{
    res.render("private/main")
})

router.get("/private", isLogged ,(req, res, next)=>{
    res.render("private/private")
})


module.exports = router