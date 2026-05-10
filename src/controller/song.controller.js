const historyModel = require("../models/history.model");
const songModel = require("../models/song.model");
const { uploadFile, deleteFile } = require("../services/storage.services");


//create Sogn
async function createSong(req, res) {
  try {
    const {
      title,
      description,
      artist,
      album,
      genre,
      duration,
      isPublished,
    } = req.body;

    // 1. Files check
    const audioFile     = req.files?.audio?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    if (!audioFile) {
      return res.status(400).json({ message: "Audio file is required" });
    }

    // 2. Audio → ImageKit upload
    const audioResult = await uploadFile(
      audioFile.buffer.toString("base64"),
      "music_app/songs"         // folder
    );

    // 3. Thumbnail → ImageKit upload (optional)
    let thumbnailUrl      = "";
    let thumbnailPublicId = "";

    if (thumbnailFile) {
      const thumbnailResult = await uploadFile(
        thumbnailFile.buffer.toString("base64"),
        "music_app/thumbnails"  // folder
      );
      thumbnailUrl      = thumbnailResult.url;      
      thumbnailPublicId = thumbnailResult.fileId;  
    }

    // 4. DB ma save
    const song = await songModel.create({
      title,
      description,
      artist,
      album:             album || null,
      genre:             genre ? [genre] : [],
      duration:          duration || 0,
      audioUrl:          audioResult.url,         
      audioPublicId:     audioResult.fileId,       
      thumbnail:         thumbnailUrl,
      thumbnailPublicId: thumbnailPublicId,
      isPublished:       isPublished ?? true,
      plays:             0,
      likes:             0,
      likedBy:           [],
    });

    return res.status(201).json({
      status:  201,
      success: true,
      message: "Song uploaded successfully",
      data:    song,
    });

  } catch (error) {
    console.error("createSong error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
}

//update 
async function updateSong(req, res) {
  try {

    const { id } = req.params;

    const {
      title,
      description,
      artist,
      album,
      genre,
      duration,
      isPublished,
    } = req.body;

    // 1. Find Song
    const song = await songModel.findById(id);

    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found",
      });
    }

    // 2. Update text fields
    if (title) song.title = title;
    if (description) song.description = description;
    if (artist) song.artist = artist;
    if (album) song.album = album;

    // genre string → array
    if (genre) {
      song.genre = genre.split(",");
    }

    if (duration) {
      song.duration = duration;
    }

    if (isPublished !== undefined) {
      song.isPublished = isPublished;
    }

    // 3. Files
    const audioFile = req.files?.audio?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    // 4. Update Audio
    if (audioFile) {

      // old audio delete
      if (song.audioPublicId) {
        await deleteFile(song.audioPublicId);
      }

      const audioResult = await uploadFile(
        audioFile.buffer.toString("base64"),
        "music_app/songs"
      );

      song.audioUrl = audioResult.url;
      song.audioPublicId = audioResult.fileId;
    }

    // 5. Update Thumbnail
    if (thumbnailFile) {

      // old thumbnail delete
      if (song.thumbnailPublicId) {
        await deleteFile(song.thumbnailPublicId);
      }

      const thumbnailResult = await uploadFile(
        thumbnailFile.buffer.toString("base64"),
        "music_app/thumbnails"
      );

      song.thumbnail = thumbnailResult.url;
      song.thumbnailPublicId = thumbnailResult.fileId;
    }

    // 6. Save
    await song.save();

    return res.status(200).json({
      success: true,
      message: "Song updated successfully",
      data: song,
    });

  } catch (error) {

    console.log("updateSong error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}

//get All Songs
async  function getAllSong(req,res){
  try{
          const getAllSong = await songModel.find();
          return res.status(200).json({
            message:"Song fetched Successfully!",
            status:201,
            data:getAllSong
          })
  }
  catch(err){
    console.log("Error====>",err)
    return res.json({
      message:"The server Error",
      status:500
    })
  }
}
//getByIdgetSong
async function getByIdSong(req,res){
  const {id} = req.params;
  try{
      const getSong = await  songModel.findById(id);
      return res.status(200).json({
        message:"Data fetched Successfully",
        status:200,
        data:getSong
      })
  }
  catch(err){
    console.log("Get By Id Song:",err)
    return res.json({
      message:"the data is not fetched ",
      status:500
    
    })
  }
}
//delete Song
async function deleteSong(req,res){
  const {id} = req.params;
  try{
        const SongId = await songModel.findByIdAndDelete(id);
        if(SongId){
          return res.status(200).json({
            message:"Song is Deleted Successfully!",
            status:200
          })
        }
        else{
          return res.json({
            message:"Song is not delete Successfully!",
            status:400
          })
        }
  }
  catch(err){
    console.log("The error is delete")
     return res.json({
      message:"Internal Server",
      status:500
     })
  }
}

async function playSong(req, res) {
  try {
    const { id } = req.params;

    // 1. Song find karo
    const song = await songModel.findById(id);

    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found",
      });
    }

    // 2. Play count increase karo
    song.plays += 1;

    await song.save();

    // 3. History save karo (optional)
    // user login hoy to history ma add karo

    if (req.user?._id) {
      await historyModel.create({
        user: req.user._id,
        song: song._id,
        playedAt: new Date(),
      });
    }

    // 4. Response
    return res.status(200).json({
      success: true,
      message: "Song played successfully",
      totalPlays: song.plays,
      data: song,
    });

  } catch (error) {
    console.log("Play Song Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
module.exports = { createSong ,getAllSong,getByIdSong,deleteSong,updateSong,playSong};