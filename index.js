const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const userRouter = require('./routes/user');
const User = require('./models/user');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8000 || process.env.PORT ;
const cors = require('cors');
const { checkForAuthenticationCookie } = require('./middleware/authentication');
app.set('view engine', 'ejs');
const blogRouter = require('./routes/blog')
const Blog = require('./models/blog');
app.set('views', path.resolve('./views'));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.resolve("./public")));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));

mongoose.connect('mongodb://127.0.0.1:27017/blogify')
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error:', err));

app.get('/', async(req, res) => {

  const allBlogs = await Blog.find({});
  res.render('home',{
    user: req.user,
    blogs: allBlogs
  });
  
});

app.use('/user', userRouter);
app.use('/blog', blogRouter);





//server port
app.listen(PORT, () => {
  console.log('Server running at http://localhost:8000'); 
});
