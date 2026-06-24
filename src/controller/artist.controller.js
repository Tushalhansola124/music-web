
const artistModel = require("../models/artist.model");
const songModel = require("../models/song.model");
const userModel = require("../models/user.model");
const { uploadFile, deleteFile } = require("../services/storage.services");

//Create Artist 
async function createArtist(req, res) {
  try {
    const { name, bio } = req.body;

    // Validation
    if (!name) return res.status(400).json({ message: "Name is required" });
    if (!bio)  return res.status(400).json({ message: "Bio is required" });

    // Image upload
    const imageFile = req.file; // single file
    if (!imageFile) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imageResult = await uploadFile(
      imageFile.buffer.toString("base64"),
      "music_app/artists"
    );

    const artist = await artistModel.create({
      name,
      bio,
      image:       imageResult.url,
      imageFileId: imageResult.fileId,
      user: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: "Artist created successfully",
      data:    artist,
    });

  } catch (error) {
    console.error("createArtist error:", error);
    return res.status(500).json({ message: error.message });
  }
}


//getAll Artist 
async function getallArtist(req,res){
         try{
             const getallArtist  = await artistModel.find();
             return res.json({
                status:200,
                message:"All artist fetched successfully",
                data:getallArtist
             })
         }
         catch(err){
            return res.json({
                message:"Server Error",
                status:500
            })
         }
}

//Update Artist

async function updateArtist(req, res) {
  try {
    const { id } = req.params; // artist id
    const { name, bio } = req.body;

  
    const artist = await artistModel.findById(id);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    if (name) artist.name = name;
    if (bio) artist.bio = bio;


    if (req.file) {
   
      if (artist.imageFileId) {
        await deleteFile(artist.imageFileId);
      }

  
      const imageResult = await uploadFile(
        req.file.buffer.toString("base64"),
        "music_app/artists"
      );

      artist.image = imageResult.url;
      artist.imageFileId = imageResult.fileId;
    }

    await artist.save();

    return res.status(200).json({
      success: true,
      message: "Artist updated successfully",
      data: artist,
    });

  } catch (error) {
    console.error("updateArtist error:", error);
    return res.status(500).json({ message: error.message });
  }
}
//delete Artist 


async function deleteArtist(req, res) {
  try {
    const { id } = req.params;


    const artist = await artistModel.findById(id);
    if (!artist) {
      return res.status(404).json({
        success: false,
        message: "Artist not found"
      });
    }

    if (artist.imageFileId) {
      await deleteFile(artist.imageFileId);
    }

    
    await artistModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Artist deleted successfully"
    });

  } catch (error) {
    console.error("deleteArtist error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

//getById 

async function getArtistById(req, res) {
  try {

    const { id } = req.params;

    // Artist Find
    const artist = await artistModel.findById(id);

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: "Artist not found"
      });
    }

    // Artist ના બધા Songs
    const songs = await songModel
      .find({ artist: id })
      .populate("album")
      .populate("genre")
      .populate("artist", "name");

    return res.status(200).json({
      success: true,
      message: "Artist Fetched Successfully",
      data: {
        artist,
        totalSongs: songs.length,
        songs
      }
    });

  } catch (error) {

    console.error("getArtistById error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid artist ID"
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


module.exports = { createArtist,getallArtist ,updateArtist,deleteArtist,getArtistById};