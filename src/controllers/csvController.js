import CSV from '../models/csvModel.js';
import Admin from '../models/admin.js';
import Setting from '../models/settingModel.js';


export const createCSV = async (req, res) => {
    try {
      const { user_id } = req.body;
      const BASE_URL = await Setting.findValueByKey("base_url");
      const csv_path = `${BASE_URL}/${req.file.path}`;
  
      // Ensure that user_id exists
      const user = await Admin.findById(user_id);
      
      if (!user) {
        return res.status(400).send({ message: 'Invalid user_id' });
      }
  
      const newCSV = new CSV({
        csv_path,
        user_id,
      });
  
      await newCSV.save();
  
      res.status(200).send({ 
        message: "successfully added CSV file", 
        csv_id: newCSV.id 
    });
    
    } catch (error) {
      res.status(500).send({ message: 'Server error', error });
    }
  };
