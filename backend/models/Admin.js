import mongoose from "mongoose";

const adminSchema = new  mongoose.Schema({
    email:{
        type: String,
        unique : true,
        require: true
    },
    password:{
        type:String,
        minLength: 6,
        require: true
    },
    addedMovies:[ //creating a reference to the movies
        {
        type: mongoose.Types.ObjectId,
        ref: 'Movie', //refering to the colletion
        },
    ]
});

export default mongoose.model("Admin", adminSchema)


// for admin auth is necessary, so we'll git a token to the user,
//  we will verify the token and then only the admin will be able to create the movies
// Json web token is used to admin (refer JWT)