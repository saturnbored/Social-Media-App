import Post from '../models/Post.js';
import User from '../models/User.js';

export const createPost = async (req, res) => {
    try {
        
        const {userId, description, picturePath} = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: [],
        });
        await newPost.save();

        const post = await Post.find(); // we will be returning the entire feed to the frontend

        res.status(201).json(post);

    } catch (err) {
        console.log(err);
        res.status(409).json({
            success: false,
            msg: err.message
        });
    }
}

export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find();
        res.status(200).json(post);        
    } catch (err) {
        console.log(err);
        res.status(404).json({
            success: false,
            msg: err.message
        })
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const {userId} = req.params;
        const post = await Post.find({userId});
        res.status(200).json(post);
    } catch (err) {
        console.log(err);
        res.status(404).json({
            success: false,
            msg: err.message
        });
    }
}

export const likePost = async (req, res) => {
    try {
        const {postId} = req.params;
        const {userId} = req.body;
        const post = await Post.findById(postId);
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId);
        }

        const updatedPost = await Post.findByIdAndUpdate(postId, {likes: post.likes}, {new: true});

        res.status(200).json(updatedPost);
        
    } catch (err) {
        console.log(err);
        res.status(404).json({
            success: false,
            msg: err.message
        });
    }
}