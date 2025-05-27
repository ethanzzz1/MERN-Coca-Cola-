import productsModel from "../models/Products.js";

const productsController = {};

// Obtener todos los productos
productsController.getAllProducts = async (req, res) => {
  try {
    const products = await productsModel.find()
      .populate('category')
      .populate('supplier');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un producto por ID
productsController.getProductById = async (req, res) => {
  try {
    const product = await productsModel.findById(req.params.id)
      .populate('category')
      .populate('supplier');
    
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener productos por categoría
productsController.getProductsByCategory = async (req, res) => {
  try {
    const products = await productsModel.find({ category: req.params.categoryId })
      .populate('category')
      .populate('supplier');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener productos con stock bajo
productsController.getLowStockProducts = async (req, res) => {
  try {
    const products = await productsModel.find({ stock: { $lt: 10 } })
      .populate('category')
      .populate('supplier');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo producto
productsController.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category,
      brand,
      image,
      supplier,
      nutritionalInfo,
      packaging,
      volume
    } = req.body;

    const newProduct = new productsModel({
      name,
      description,
      price,
      stock,
      category,
      brand,
      image,
      supplier,
      nutritionalInfo,
      packaging,
      volume
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar un producto
productsController.updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category,
      brand,
      image,
      supplier,
      nutritionalInfo,
      packaging,
      volume,
      status
    } = req.body;

    const updatedProduct = await productsModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        stock,
        category,
        brand,
        image,
        supplier,
        nutritionalInfo,
        packaging,
        volume,
        status
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un producto
productsController.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await productsModel.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar productos por nombre o descripción
productsController.searchProducts = async (req, res) => {
  try {
    const { query } = req.params;
    const products = await productsModel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    })
    .populate('category')
    .populate('supplier');
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default productsController;
