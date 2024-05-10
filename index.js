const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

const port = 3000;

mongoose.connect('mongodb://localhost:27017/bharat')
    
const registrationSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String,
    confirmpassword : String
});

const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded ({ extended : true }));
app.use(bodyParser.json());


app.get("/",(req, res) => {
    res.sendFile(__dirname + "/registration.html");
})


app.post("/register", async (req, res) => {
    try{
        const{name, email, password, confirmpassword} = req.body;

        const existingUser = await Registration.findOne({email :email});
        if (!existingUser){
            const registrationData = new Registration({
                name,
                email,
                password,
                confirmpassword
            });
            await registrationData.save();
            res.redirect("/success");
        }
        else{
            console.log("User already exist");
            res.redirect("/error");
        }
    }
    catch (error){
        console.log(error);
        res.redirect("error");  
    }
})

app.get("/success", (req, res) => {
    res.sendFile (__dirname+"/success.html");
})

app.get("/error", (req, res) => {
    res.sendFile (__dirname+"/error.html");
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})