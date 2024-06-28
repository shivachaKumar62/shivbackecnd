import Admin from '../models/admin.js';
import Audio from '../models/audioModel.js';
import CSV from '../models/csvModel.js';
import Setting from '../models/settingModel.js';

export const createAudio = async (req, res) => {
  try {
    const { user_id, csv_id } = req.body;
    const BASE_URL = await Setting.findValueByKey("base_url");
    const audio_path = `${BASE_URL}/${req.file.path}`;
    

    // Ensure that user_id and csv_id exist
    const user = await Admin.findById(user_id);
    const csv = await CSV.findById(csv_id);

    if (!user || !csv) {
      return res.status(400).send({ message: 'Invalid user_id or csv_id' });
    }

    const newAudio = new Audio({
      audio_path,
      csv_id,
      user_id,
    });

    await newAudio.save();

    res.status(200).send({ 
        message: "successfully added CSV file", 
        audio_id: newAudio.id 
    });
  } catch (error) {
    res.status(500).send({ message: 'Server error', error });
  }
};
