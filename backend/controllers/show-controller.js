import Show from '../models/Show.js';

// Add a new show
export const addShow = async (req, res) => {

  try {
    const { theaterId, movieId, dates, times, posterUrl } = req.body;

    // Validate input
    if (!theaterId || !movieId || !dates || !times) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Create a new show document
    const newShow = new Show({
      theaterId,
      movieId,
      dates,
      times,
      posterUrl
    });

    // Save to the database
    await newShow.save();

    // Respond with success
    res.status(201).json({ message: 'Show(s) added successfully.' });
  } catch (error) {
    console.error('Error adding show:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// get all the shows
export const getAllShows = async (req, res) => {
  try {
    // Fetch all show documents from the database
    const shows = await Show.find().populate('theaterId').populate('movieId');
    console.log("Fetched shows:", shows); // Log shows to verify the data
    res.status(200).json(shows);
    // Respond with the list of shows
  } catch (error) {
    console.error('Error fetching shows:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Delete the show by Id
export const deleteShow = async (req, res) => {
  const { showId } = req.params;
  try {
    const deletedShow = await Show.findByIdAndDelete(showId);
    if (!deletedShow) {
      return res.status(404).json({ error: 'Show not found' });
    }
    res.status(200).json({ message: 'Show deleted successfully' });
  } catch (error) {
    console.error('Error deleting show:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};