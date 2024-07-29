const post = require('../models/post');
const fs = require('fs');
const path = require('path');

exports.createPost = async (req, res) => {
    try {
        const { title, description } = req.body;
        
        const newPost = new post({
            title,
            description,
            image: req.file.path,   
            CreatedBy: req.user.id
        });
        await newPost.save();
        res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
        console.error('Error creating post:', error.message);
        res.status(500).json({ message: error.message });
    }
};
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await post.find()
            .populate('CreatedBy', 'username');
        res.status(200).json({ posts });
    } catch (error) {
        console.error('Error getting posts:', error.message);
        res.status(500).json({ message: error.message });
    }
};
// exports.editPost = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { title, description } = req.body;

//         const Post = await post.findById(id);
//         if (!Post) {
//             return res.status(404).json({ message: 'Post not found' });
//         }

//         if (Post.CreatedBy.toString() !== req.user.id) {
//             return res.status(401).json({ message: 'Unauthorized to edit this post' });
//         }

//         // Check each field and update or delete it if provided
//         if (title !== undefined) {
//             if (title === "") {
//                 Post.title = undefined;
//             } else {
//                 Post.title = title;
//             }
//         }

//         if (description !== undefined) {
//             if (description === "") {
//                 Post.description = undefined;
//             } else {
//                 Post.description = description;
//             }
//         }

//         if (req.file) {
//             // If a new image is uploaded, set the new image path
//             Post.image = req.file.path;
//         }

//         await Post.save();
//         res.status(200).json({ message: 'Post updated successfully' });
//     } catch (error) {
//         console.error('Error editing post:', error.message);
//         res.status(500).json({ message: error.message });
//     }
// }
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if the user is an admin
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    // Find the post by ID
    const postToDelete = await post.findById(id);
    if (!postToDelete) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Delete the post
    await post.findByIdAndDelete(id);

    // Delete the associated image
    const imgPath = path.join(__dirname, `../${postToDelete.image}`);
    if (fs.existsSync(imgPath)) {
      fs.unlinkSync(imgPath);
    }

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.getPendingPosts = async (req, res) => {
    try {
        // Fetch pending posts with the populated 'CreatedBy' field
        const pendingPosts = await post.find({ status: 'pending' })
                                       .populate('CreatedBy', 'username');

        // Log the result for debugging
        console.log('Pending Posts:', pendingPosts);

        // Respond with the fetched posts
        res.status(200).json({
            posts: pendingPosts
        });
    } catch (error) {
        // Log the error for debugging
        console.error('Error fetching pending posts:', error.message);

        // Respond with an error message
        res.status(500).json({
            message: 'Error fetching pending posts'
        });
    }
};

exports.approvePost = async (req, res) => {
    try {
        const Post = await post.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
        if (!Post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(Post);
    } catch (error) {
        res.status(500).json({ message: 'Error approving post' });
    }
};
exports.rejectPost = async (req, res) => {
    try {
        const { id } = req.params;
        const Post = await post.findById(id);
        if (!Post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const deletePostImage =    await post.findByIdAndDelete(id);

        const imgpath = path.join(__dirname, `../${deletePostImage.image}`);
        fs.unlinkSync(imgpath);
        res.json({ message: 'Post rejected and deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error rejecting post' });
    }
};
exports.adminCreatePost = async (req, res) => {
    try {
        const { title, description } = req.body;

        // Check if the user is an admin
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({ message: 'Forbidden: Admin access required' });
        }

        const newPost = new post({
            title,
            description,
            image: req.file.path,   
            CreatedBy: req.user.id,
            status: 'approved'
        });

        await newPost.save();
        res.status(201).json({ message: 'Post created and approved successfully' });
    } catch (error) {
        console.error('Error creating post:', error.message);
        res.status(500).json({ message: error.message });
    }
};