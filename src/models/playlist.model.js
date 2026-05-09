const mongoose =  require("mongoose");

const playlistSchema = new mongoose.Schema({
    name:{
        type:String,
        require:[true,"name is required"]
    },
    description:{
        type:String,
        require:[true,"description is required"]
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    songs:
        [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }]


},{ timestamps: true })


const playlistModel = mongoose.model("Playlist",playlistSchema)

module.exports = playlistModel;