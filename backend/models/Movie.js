import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    posterUrl: {
        type: String,
        required: false,
    },
    bannerUrl: {
        type: String,
        required: false,
    },
    genre: {
        type: String,
        required: false,
    },
    duration: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: false,
    },
    cast: {
        type: [String],
        required: true,
    },
    featured: {
        type: Boolean,
        default: false,
    },
    bookings: [{ type: mongoose.Types.ObjectId, ref: "Booking" }],
    admin: { 
        type: mongoose.Types.ObjectId,
        ref: "Admin",
        required: true,
    }
});

export default mongoose.model("Movie", movieSchema);



// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// import mongoose from 'mongoose';

// const movieSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true,
//     },
//     description: {
//         type: String,
//         required: true,
//     },
//     releaseDate: {
//         type: Date,
//         required: true,
//     },
//     posterUrl: {
//         type: String,
//         required: false,
//     },
//     bannerUrl: {
//         type: String,
//         required: false,
//     },
//     genre: {
//         type: String,
//         required: false,
//     },
//     duration: {
//         type: String,
//         required: true,
//     },
//     rating: {
//         type: Number,
//         required: false,
//     },
//     cast: [
//         {
//           name: String,
//           photoUrl: String,
//         },
//       ],
//     featured: {
//         type: Boolean,
//         default: false,
//     },
//     bannerUrl: {
//         type: String,
//         required: false,
//       },
//       castPhotoUrls: {
//         type: [String],
//         required: false,
//       },
//     bookings: [{ type: mongoose.Types.ObjectId, ref: "Booking" }],
//     admin: { 
//         type: mongoose.Types.ObjectId,
//         ref: "Admin",
//         required: true,
//     }
// });

// export default mongoose.model("Movie", movieSchema);

