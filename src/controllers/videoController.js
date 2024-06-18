import Video from "../models/video.js";

export const uploadVideo = async (req, res) => {
  try {
    const { user_id, trim_timing } = req.body;

    const baseUrl = process.env.BASE_URL;
    const videoPath = `${baseUrl}/${req.file.path}`;
   
    const newVideo = new Video({
      user_id,
      trim_timing,
      videoPath,
    });

    await newVideo.save();
    res
      .status(201)
      .json({ message: "Video uploaded successfully", video: newVideo });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
