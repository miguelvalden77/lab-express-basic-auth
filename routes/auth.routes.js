const router = require("express").Router();
const User = require("../models/User.model")
const bcrypt = require("bcryptjs")

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


module.exports = router