require('dotenv').config();
const express = require("express")
const mongoose = require("mongoose")
const port = process.env.Port || 5000;
const hbs = require("hbs");
const app = express();
require("./db/conn")
const path = require("path");
const Register = require('./models/registers');
const bcrypt = require("bcryptjs")
const jwt=require("jsonwebtoken")
const auth =require("./middleware/auth")


const { urlencoded } = require("express");
const static_path = path.join(__dirname, "../public")
const template_path = path.join(__dirname, "../templates/views")
const partial_path = path.join(__dirname, "../templates/partials")
app.use(express.static(static_path))
app.set("view engine", "hbs");
app.set("views", template_path)
hbs.registerPartials(partial_path)
app.use(express.json())
app.use(urlencoded({ extended: false }))

app.use(express.json())

// console.log(process.env.SECRET_KEY)

app.get("/", (req, res) => {
    res.render("index")
})
app.get("/index", (req, res) => {
    res.render("index")
})
app.get("/login", (req, res) => {
    res.render("login")
})
app.get("/register", (req, res) => {
    res.render("register")
})
app.get("/secret",auth, (req, res) => {
    res.render("secret")
    console.log(`this is ${req.cookies.jwt}`);
})



app.post("/register", async (req, res) => {
    try {
        const password =req.body.password;
        const cnfirmpassword =req.body.cnfirmpassword;
        if(password ===cnfirmpassword ){
            const registerEmployee = new Register({
                name :req.body.name,
                lastname:req.body.lastname,
                email:req.body.email,
                age:req.body.age,
                phoneno:req.body.phoneno,
                password:req.body.password,
                cnfirmpassword:req.body.cnfirmpassword
            })
            console.log("success is" + registerEmployee)
            const token = await registerEmployee.generateAuthToken();

            res.cookie("jwt",token,
            {
                expires :new Date(date.now() + 30000),
                httpOnly:true
            });
            console.log(cookie);
            // console.log("token part atre",token)

            const registered =await registerEmployee.save();
            console.log("register part atre",registered)
            res.status(201).render("index");
        }else{
            res.send("passsward not matching")
        }
    } catch (e) {
        res.send(e)
    }
    
})

app.post("/login", async (req,res)=>
{
    try{
        const email =req.body.email;
        const password =req.body.password;
        
        const useremail =await Register.findOne({email:email});
        // res.send(useremail.password);
        // console.log(`${email} ansd ${password} `)
        // console.log(useremail.password);
        const isMatch =await bcrypt.compare(password,useremail.password)
        const token = await useremail.generateAuthToken();
        res.cookie("jwt",token,
        {
            expires :new Date(date.now() + 30000),
            httpOnly:true
        });

       
            // console.log("token part atre",token)
        if(isMatch)
        {
            res.render("index");
        }else
        {
            res.send("ghalat password");
        }
    }catch(e){
        res.status(400).send("invalid email")
    }
})


// app.use(router)





//encrption technique
// const bcrypt =require("bcryptjs");
// securePassword = async (password)=>{
//     const passswardhash =await bcrypt.hash(password,10)
//     console.log(passswardhash);
// }
// securePassword("malik")


//jwt token cookie work
// const jwt =require("jsonwebtoken")


// const createToken = async ()=>
// {
//     const token =await jwt.sign({_id:"642b9a98d5b454c9da396329"},"malikahteshamisagoodboyasdfgh");
//     console.log(token)

//     const userVer = await jwt.verify(token,"malikahteshamisagoodboyasdfgh");
//     console.log(userVer);
// }
// createToken(); 

app.listen(port, () => {
    console.log(`connectio is set at ${port}`);
})