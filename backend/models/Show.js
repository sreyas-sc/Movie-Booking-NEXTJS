import mongoose from 'mongoose';

const ShowSchema = new mongoose.Schema({
  theaterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true }, // Use 'Theatre' if that's the model name
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  dates: [{ type: Date }],
  times: [{ type: String }],
  posterUrl: { type: String, required: true },
});

const Show = mongoose.model('Show', ShowSchema);
export default Show;