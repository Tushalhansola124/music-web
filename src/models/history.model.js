const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    song:{
         type:mongoose.Schema.Types.ObjectId,
         ref: "Song"
    },
    playedAt:{
        type:Date,
    }
},{ timestamps: true })

const historyModel = mongoose.model("history",historySchema)

module.exports = historyModel;


