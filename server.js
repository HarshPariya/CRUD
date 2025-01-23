import express from 'express'
const app = express();
import connectDB from './config/db.js'
import User from './model/userSchema.js';
connectDB()
app.use(express.json());

app.get('/', (req, res) => {
    res.send("HEllo")
})
app.post('/register', async (req, res) => {
    const { email, name, password } = req.body
    try {
        const userExist = await User.findOne({ email: email })
        if (userExist) {
            return res.send({ message: "User Already Exist" })
        }
        const userData = await User({ email, name, password })
        userData.save();
        res.send({ message: "User Created Successfully" })
    }
    catch (err) {
        res.send(err)
    }

})


app.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    try{
        const userExist=await User.findOne({email})
        if(!userExist){
          return       res.send({message:"User Not Found"})
        }
        if(password===userExist.password){
            return res.send({message:"Login Successfully"})
        }
       res.send({message:"Invalid Credentials"})
    }
    catch(err){
        res.send(err)
    }
})

app.delete('/delete/:id',async (req,res)=>{
    const {id}=req.params

    const { email, name, password } = req.body
    try {
        const userExist = await User.updateOne({ email: email })
        if (userExist) {
            return res.send({ message: "User Updated" })
        }
        const userData = await User({ email, name, password })
        userData.save();
        res.send({ message: "User Updated Successfully" })
    }
    catch (err) {
        res.send(err)
}})

app.put("/update/:id", async (req, res) => {

    try {
      const userExist = await User.findByIdAndUpdate(req.params.id, req.body , {new : true});
      if (!userExist) {
        return res.send({ message: "User not Updated Successfully" });
      }
      res.send({ message: "User Updated Successfully" });
  
    } catch (err) {
      res.send(err);
    }
  });

app.listen(4000, (req, res) => {
    console.log("Server is running")
})