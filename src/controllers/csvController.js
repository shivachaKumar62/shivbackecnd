import CSV from '../models/csvModel.js';
import Admin from '../models/admin.js';



export const createCSV = async (req, res) => {
    try {
      const { user_id } = req.body;

      const protocol = req.protocol; // http or https
      const host = req.get('host'); // hostname (e.g., localhost:3000)
      const csv_path = `${protocol}://${host}/${req.file.path}`;

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
