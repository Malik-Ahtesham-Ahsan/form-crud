const mongoose= require("mongoose")

const DB ="mongodb+srv://malikahtesham661:ahtesham1234@cluster0.yemsibn.mongodb.net/formdb?retryWrites=true&w=majority";
mongoose.connect(DB).then(()=>
{
    console.log("conn succc bro");
}).catch((e)=>
{
    console.log("not connect",e);
})