require("dotenv").config();
const app = require("../src/app");

app.listen(3000,()=>{
    console.log("The Server is Runing on Port 3000")
})

