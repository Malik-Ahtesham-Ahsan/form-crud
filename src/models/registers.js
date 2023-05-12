const mongoose =require("mongoose");
const bcrypt =require("bcryptjs")
const jwt=require("jsonwebtoken")

const employeeSchema =new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique:true
        },
        age: {
            type: Number,
            required: true,
        },
        
        phoneno: {
            type: Number,
            require:true,
            unique:true
            
        },
        password: {
            type: String,
            required: true,
            
        },
        cnfirmpassword: {
            type: String,
            required: true,
            
        },
        tokens:[{
            token:{
                type: String,
            required: true,
            }
        }]
        
        
    }
)
employeeSchema.methods.generateAuthToken =async function(){
    try{
        console.log(this._id)
        const token =await jwt.sign({_id:this._id.toString()},"process.env.SECRET_KEY");
        this.tokens=this.tokens.concat({token:token})
        await this.save();
        console.log(token)
        return token;

    }catch(error){
        res.send("error is " + error)
        console.log("error part  " + error)
    }
}

employeeSchema.pre("save", async function(next){
    // const passswardhash =await bcrypt.hash(password,10);
    if(this.isModified("password")){
        // console.log(`curr pass us ${this.password}`);
        this.password =await bcrypt.hash(this.password,10);
        this.cnfirmpassword =await bcrypt.hash(this.cnfirmpassword,10);
        // console.log(`curr pass us ${this.password}`);

        
    }
   
    next();
})

const Register =new mongoose.model('Register',employeeSchema)

module.exports =Register;