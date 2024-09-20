import Admin from '../models/Admin.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';



export const addAdmin =async (req, res, next) =>{
    const { email, password } =  req.body;
    if( !email && email.trim()===""  &&  !password && password.trim()==="" )
    {
        return res.status(422).json({message: "Please fill in all fields"})
    }
    let existingAdmin;

    try{
        existingAdmin = await Admin.findOne({ email: email });
    }
    catch(err){
        return console.log(err);
    }

    if(existingAdmin){
        return res.status(400).json({ message: 'Admin already exists' });
    }

    let admin;
    const hashedPassword = bcrypt.hashSync(password)
    try{
        admin  = new Admin({email, password: hashedPassword});
        admin = await admin.save();
    }catch(err){
        return console.log(err);
    }
    if(!admin){
        return res.status(500).json({ message: 'Failed to add admin' });
    }
    return res.status(200).json({ admin })
};


export const adminLogin = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({ message: "Please fill in all fields" });
    }
  
    try {
      const existingAdmin = await Admin.findOne({ email });
      if (!existingAdmin) {
        return res.status(400).json({ message: "Admin not found" });
      }
  
      const isPasswordCorrect = bcrypt.compareSync(password, existingAdmin.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Incorrect password" });
      }
  
      const token = jwt.sign({ id: existingAdmin._id }, 'MYSECRETKEY', { expiresIn: "7d" });
      return res.status(200).json({ message: "Authentication completed", token, id: existingAdmin._id });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Server error" });
    }
  };
  

export const getAdmins = async (req, res, next) =>{
    let admins;

    try{
        admins = await Admin.find();
    }catch(err){
        return console.log(err);
    }
    if(!admins){
        return res.status(500).json({message: "Internal server error "})
    }

    return res.status(200).json({admins})
}