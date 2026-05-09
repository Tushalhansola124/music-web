// const mongoose = require("mongoose")

// const songSchema = new mongoose.Schema({
//     title:{
//         type:String,
//         require:[true,"title is required"]
//     },
//     description:{
//         type:String,
//         require:[true,"description is required"]
//     },
//     artist:{
//          type:mongoose.Schema.Types.ObjectId, 
//          ref: "Artist"
//     },
//     album:{
//          type:mongoose.Schema.Types.ObjectId, 
//          ref: "Album"
//     },
//      duration:{
//         type:Number,

//      },
//      audioUrl:{
//         type:String,
        
//      },
//      thumbnail:{
//         type:String
//      },
//      plays: { type: Number, default: 0 },
//      likes: { type: Number, default: 0 },

// },{
//     timestamps: true 
// })

// const songModel =  mongoose.model("Song",songSchema)

// module.exports = songModel;


const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
      required: [true, "Artist is required"],
    },
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
      default: null,        // Album optional hoy shakay
    },
    genre: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Genre",       // Genre filter mate
      },
    ],
    duration: {
      type: Number,
      default: 0,           // Seconds ma (Cloudinary thi avse)
    },

    // ── Audio ──────────────────────────────
    audioUrl: {
      type: String,
      required: [true, "Audio URL is required"],
    },
    audioPublicId: {
      type: String,         // Cloudinary delete mate
      default: "",
    },

    // ── Thumbnail ──────────────────────────
    thumbnail: {
      type: String,
      default: "",
    },
    thumbnailPublicId: {
      type: String,         // Cloudinary delete mate
      default: "",
    },

    // ── Stats ──────────────────────────────
    plays: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",        // Duplicate like rokva mate
      },
    ],

    // ── Status ─────────────────────────────
    isPublished: {
      type: Boolean,
      default: true,        // false = draft mode
    },
  },
  {
    timestamps: true,
  }
);

const songModel = mongoose.model("Song", songSchema);
module.exports = songModel;