import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
        default: "https://www.elegantthemes.com/blog/wp-content/uploads/2021/03/featured-default-themes.png"
    },
    category: {
        type: String,
        default: "Uncategorized"
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

export default Post;
