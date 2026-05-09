const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
    title:{
        type:String,
        require:[true,"title is required"]
    },
    artist:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Artist"
    },
    coverImage:{
        type:String,
    },
    releaseDate:{
        type:Date,
    },
    songs:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Song"
        }
    ]
},{ timestamps: true })

const ablumModel = mongoose.model("Album",albumSchema)
module.exports = ablumModel

