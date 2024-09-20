import express from "express"
import mongoose from "mongoose"; 
import cors from 'cors'

import userRouter from "./routes/user-routes.js";
import adminRouter from "./routes/admin-routes.js";
import movieRouter from "./routes/movie-routes.js";
import bookingsRouter from "./routes/booking-routes.js";
import theatreRouter from "./routes/theatre-routes.js"
import showRouter from "./routes/show-routes.js";



const app = express();
app.use(cors());


//middlewares
app.use(express.json());
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/movie",  movieRouter);
app.use("/booking", bookingsRouter);
app.use("/theatre",  theatreRouter);
app.use("/show", showRouter);


mongoose.connect(
        "mongodb+srv://sreyass2000:best1syett0c0me@cluster0.wm0v7.mongodb.net/newtestname?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(()=>
        app.listen(5000, ()=>
            console.log("Connected to database and Server is Running on port 5000")
        )
    )
    .catch(e=>console.log(e));

// mvc approcah is followed for the api
// models
// controllers
// Views/Routes
