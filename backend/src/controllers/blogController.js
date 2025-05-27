import blogModel from "../models/blog.js";
import { v2 as cloudinary } from "cloudinary";
import { config } from "../config.js";

// Configurar Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudinary_name,
  api_key: config.cloudinary.cloudinary_api_key,
  api_secret: config.cloudinary.cloudinary_api_secret,
});

const blogController = {};

// Obtener todos los posts del blog
blogController.getAllPosts = async (req, res) => {
  try {
    const posts = await blogModel.find().populate('author');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un post por ID
blogController.getPostById = async (req, res) => {
  try {
    const post = await blogModel.findById(req.params.id).populate('author');
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo post
blogController.createPost = async (req, res) => {
  try {
    const { title, content, author, category, status } = req.body;
    let imageUrl = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "blog",
        allowed_formats: ["jpg", "png", "jpeg"],
      });
      imageUrl = result.secure_url;
    }

    const newPost = new blogModel({
      title,
      content,
      image: imageUrl,
      author,
      category,
      status
    });
    
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar un post
blogController.updatePost = async (req, res) => {
  try {
    const { title, content, author, category, status } = req.body;
    let imageUrl = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "blog",
        allowed_formats: ["jpg", "png", "jpeg"],
      });
      imageUrl = result.secure_url;
    }

    const updatedPost = await blogModel.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        image: imageUrl || req.body.image,
        author,
        category,
        status
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un post
blogController.deletePost = async (req, res) => {
  try {
    const deletedPost = await blogModel.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }
    res.json({ message: 'Post eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default blogController;
