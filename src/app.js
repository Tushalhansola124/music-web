
const express = require("express");
const connectToDB = require("./db/db");
const cookieParser  = require('cookie-parser');
const authRouter = require('./routes/auth.route');
const artistRouter = require("./routes/artist.route")
const followRouter = require("./routes/followartist.route")
const songRouter = require("./routes/songs.route")
const albumRouter =  require('./routes/album.route')
const genreRouter = require("./routes/genre.route");
const likeSongRouter = require("./routes/likeSong.route")
const playlistRouter = require("./routes/playlist.route")
const profileRouter = require("./routes/profile.route");
const userRouter = require("./routes/user.route")
const playRouter = require("./routes/play.route")

const app = express();
connectToDB()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRouter)

//api/artist/artistCreate
app.use('/api/artist',artistRouter)
app.use('/api/user',followRouter)
app.use('/api/song',songRouter)
app.use('/api/album',albumRouter)
app.use("/api/genre", genreRouter);
app.use("/api/likeSong",likeSongRouter)
app.use("/api/playlist", playlistRouter);
app.use("/api/profile", profileRouter);
app.use("/api/users",userRouter)
app.use("/api/play", playRouter);
app.get("/test",(req,res)=>{
    res.send("API is working fine");
})

module.exports = app;