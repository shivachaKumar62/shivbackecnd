import Admin from '../models/admin.js';
import File from '../models/filesModel.js';
import CSV from '../models/csvModel.js';
import mongoose from 'mongoose';

export const createFile = async (req, res) => {
  try {
    const { user_id, csv_id, file_type } = req.body;

    const protocol = req.protocol; // http or https
    const host = req.get('host'); // hostname (e.g., localhost:3000)
    const path = `${protocol}://${host}/${req.file.path}`;
   
    
    // Ensure that user_id and csv_id exist
    const user = await Admin.findById(user_id);
    const csv = await CSV.findById(csv_id);

    if (!user || !csv) {
      return res.status(400).send({ message: 'Invalid user_id or csv_id' });
    }

    const newFile = new File({
      path,
      csv_id,
      user_id,
      file_type
    });

    const file = await newFile.save();

    let message;
    if (file_type === "audio") {
      message = "Successfully added audio file";
    } else {
      message = "Successfully added video file";
    }

    res.status(200).send({ message,id:file.id});
  } catch (error) {
    res.status(500).send({ message:  error.message });
  }
};


export const getFiles = async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);

    // Perform aggregation with lookup
    const result = await File.aggregate([
      { 
        $match: { _id: id } // Match the file by its ID
      },
      { 
        $lookup: {
          from: 'csvs', // The name of the collection you want to join
          localField: 'csv_id', // Field in the File collection
          foreignField: '_id', // Field in the CSV collection
          as: 'csv_data' // Alias for the joined data
        }
      },
      { $unwind: '$csv_data' } // Unwind if you expect a single related CSV document
    ]);

    if (result.length === 0) {
      return res.status(404).send({ message: 'File not found' });
    }

    res.status(200).send({ result});
  } catch (error) {
    
    res.status(500).send({ message: error });
  }
};


