const Inventory = require('../models/Inventory');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHelper');

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private
exports.getAllInventory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};

    // Filter by category
    if (req.query.category) {
      query.category = { $regex: req.query.category, $options: 'i' };
    }

    // Filter by supplier
    if (req.query.supplier) {
      query.supplier = { $regex: req.query.supplier, $options: 'i' };
    }

    // Search by product name or SKU
    if (req.query.search) {
      query.$or = [
        { productName: { $regex: req.query.search, $options: 'i' } },
        { sku: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Filter by quantity range
    if (req.query.minQty) {
      query.quantity = { ...query.quantity, $gte: parseInt(req.query.minQty) };
    }
    if (req.query.maxQty) {
      query.quantity = { ...query.quantity, $lte: parseInt(req.query.maxQty) };
    }

    // Sort options
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (req.query.sortBy) {
      const sortField = req.query.sortBy;
      const sortOrder = req.query.order === 'asc' ? 1 : -1;
      sortOption = { [sortField]: sortOrder };
    }

    // Get inventory items with pagination
    const items = await Inventory.find(query)
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const total = await Inventory.countDocuments(query);

    sendSuccessResponse(res, 'Inventory items fetched successfully', {
      items,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        limit
      }
    });

  } catch (error) {
    console.error('Get All Inventory Error:', error);
    sendErrorResponse(res, 'Error fetching inventory items', 500);
  }
};

// @desc    Get single inventory item by ID
// @route   GET /api/inventory/:id
// @access  Private
exports.getInventoryById = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .populate('lastModifiedBy', 'name email role');

    if (!item) {
      return sendErrorResponse(res, 'Inventory item not found', 404);
    }

    sendSuccessResponse(res, 'Inventory item fetched successfully', { item });

  } catch (error) {
    console.error('Get Inventory By ID Error:', error);
    
    if (error.kind === 'ObjectId') {
      return sendErrorResponse(res, 'Invalid inventory item ID', 400);
    }
    
    sendErrorResponse(res, 'Error fetching inventory item', 500);
  }
};

// @desc    Create new inventory item
// @route   POST /api/inventory
// @access  Private (Admin/Manager)
exports.createInventory = async (req, res) => {
  try {
    const {
      productName,
      category,
      sku,
      quantity,
      purchaseDate,
      expiryDate,
      supplier
    } = req.body;

    // Validation
    if (!productName || !category || !sku || quantity === undefined || !purchaseDate || !expiryDate || !supplier) {
      return sendErrorResponse(res, 'Please provide all required fields', 400);
    }

    // Check if SKU already exists
    const existingItem = await Inventory.findOne({ sku: sku.toUpperCase() });
    if (existingItem) {
      return sendErrorResponse(res, 'Item with this SKU already exists', 400);
    }

    // Validate dates
    if (new Date(expiryDate) <= new Date(purchaseDate)) {
      return sendErrorResponse(res, 'Expiry date must be after purchase date', 400);
    }

    // Create inventory item
    const item = await Inventory.create({
      productName,
      category,
      sku: sku.toUpperCase(),
      quantity,
      purchaseDate,
      expiryDate,
      supplier,
      createdBy: req.user.id
    });

    const populatedItem = await Inventory.findById(item._id)
      .populate('createdBy', 'name email');

    sendSuccessResponse(res, 'Inventory item created successfully', {
      item: populatedItem
    }, 201);

  } catch (error) {
    console.error('Create Inventory Error:', error);
    
    if (error.code === 11000) {
      return sendErrorResponse(res, 'Item with this SKU already exists', 400);
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return sendErrorResponse(res, messages.join(', '), 400);
    }
    
    sendErrorResponse(res, 'Error creating inventory item', 500);
  }
};

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Private (Admin/Manager)
exports.updateInventory = async (req, res) => {
  try {
    const {
      productName,
      category,
      quantity,
      purchaseDate,
      expiryDate,
      supplier
    } = req.body;

    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return sendErrorResponse(res, 'Inventory item not found', 404);
    }

    // Update fields
    if (productName) item.productName = productName;
    if (category) item.category = category;
    if (quantity !== undefined) item.quantity = quantity;
    if (purchaseDate) item.purchaseDate = purchaseDate;
    if (expiryDate) item.expiryDate = expiryDate;
    if (supplier) item.supplier = supplier;
    
    item.lastModifiedBy = req.user.id;

    // Validate dates if updated
    if (new Date(item.expiryDate) <= new Date(item.purchaseDate)) {
      return sendErrorResponse(res, 'Expiry date must be after purchase date', 400);
    }

    await item.save();

    const updatedItem = await Inventory.findById(item._id)
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email');

    sendSuccessResponse(res, 'Inventory item updated successfully', {
      item: updatedItem
    });

  } catch (error) {
    console.error('Update Inventory Error:', error);
    
    if (error.kind === 'ObjectId') {
      return sendErrorResponse(res, 'Invalid inventory item ID', 400);
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return sendErrorResponse(res, messages.join(', '), 400);
    }
    
    sendErrorResponse(res, 'Error updating inventory item', 500);
  }
};

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
// @access  Private (Admin/Manager)
exports.deleteInventory = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return sendErrorResponse(res, 'Inventory item not found', 404);
    }

    await item.deleteOne();

    sendSuccessResponse(res, 'Inventory item deleted successfully', null);

  } catch (error) {
    console.error('Delete Inventory Error:', error);
    
    if (error.kind === 'ObjectId') {
      return sendErrorResponse(res, 'Invalid inventory item ID', 400);
    }
    
    sendErrorResponse(res, 'Error deleting inventory item', 500);
  }
};

// @desc    Quick update inventory quantity
// @route   PATCH /api/inventory/:id/quantity
// @access  Private (Admin/Manager)
exports.updateQuantity = async (req, res) => {
  try {
    const { quantity, operation } = req.body;

    if (!quantity || !operation) {
      return sendErrorResponse(res, 'Please provide quantity and operation', 400);
    }

    if (!['add', 'subtract', 'set'].includes(operation)) {
      return sendErrorResponse(res, 'Operation must be add, subtract, or set', 400);
    }

    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return sendErrorResponse(res, 'Inventory item not found', 404);
    }

    // Perform operation
    switch (operation) {
      case 'add':
        item.quantity += parseInt(quantity);
        break;
      case 'subtract':
        item.quantity -= parseInt(quantity);
        if (item.quantity < 0) item.quantity = 0;
        break;
      case 'set':
        item.quantity = parseInt(quantity);
        break;
    }

    item.lastModifiedBy = req.user.id;
    await item.save();

    const updatedItem = await Inventory.findById(item._id)
      .populate('lastModifiedBy', 'name email');

    sendSuccessResponse(res, 'Inventory quantity updated successfully', {
      item: updatedItem
    });

  } catch (error) {
    console.error('Update Quantity Error:', error);
    
    if (error.kind === 'ObjectId') {
      return sendErrorResponse(res, 'Invalid inventory item ID', 400);
    }
    
    sendErrorResponse(res, 'Error updating inventory quantity', 500);
  }
};

// @desc    Get inventory analytics by category
// @route   GET /api/inventory/analytics/by-category
// @access  Private
exports.getInventoryByCategory = async (req, res) => {
  try {
    const categoryData = await Inventory.aggregate([
      {
        $group: {
          _id: '$category',
          totalQuantity: { $sum: '$quantity' },
          itemCount: { $sum: 1 },
          avgQuantity: { $avg: '$quantity' }
        }
      },
      {
        $sort: { totalQuantity: -1 }
      }
    ]);

    const formattedData = categoryData.map(item => ({
      category: item._id,
      totalQuantity: item.totalQuantity,
      itemCount: item.itemCount,
      avgQuantity: Math.round(item.avgQuantity)
    }));

    sendSuccessResponse(res, 'Category analytics fetched successfully', {
      categories: formattedData
    });

  } catch (error) {
    console.error('Get Inventory By Category Error:', error);
    sendErrorResponse(res, 'Error fetching category analytics', 500);
  }
};

// @desc    Get inventory analytics by supplier
// @route   GET /api/inventory/analytics/by-supplier
// @access  Private
exports.getInventoryBySupplier = async (req, res) => {
  try {
    const supplierData = await Inventory.aggregate([
      {
        $group: {
          _id: '$supplier',
          totalQuantity: { $sum: '$quantity' },
          itemCount: { $sum: 1 },
          categories: { $addToSet: '$category' }
        }
      },
      {
        $sort: { itemCount: -1 }
      }
    ]);

    const formattedData = supplierData.map(item => ({
      supplier: item._id,
      totalQuantity: item.totalQuantity,
      itemCount: item.itemCount,
      categories: item.categories
    }));

    sendSuccessResponse(res, 'Supplier analytics fetched successfully', {
      suppliers: formattedData
    });

  } catch (error) {
    console.error('Get Inventory By Supplier Error:', error);
    sendErrorResponse(res, 'Error fetching supplier analytics', 500);
  }
};

// @desc    Get inventory summary/dashboard stats
// @route   GET /api/inventory/analytics/summary
// @access  Private
exports.getInventorySummary = async (req, res) => {
  try {
    const totalItems = await Inventory.countDocuments();
    const totalQuantity = await Inventory.aggregate([
      { $group: { _id: null, total: { $sum: '$quantity' } } }
    ]);

    const uniqueCategories = await Inventory.distinct('category');
    const uniqueSuppliers = await Inventory.distinct('supplier');

    const lowStockItems = await Inventory.countDocuments({ 
      quantity: { $gt: 0, $lt: 10 } 
    });

    const outOfStockItems = await Inventory.countDocuments({ quantity: 0 });

    const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);

    const expiringSoon = await Inventory.countDocuments({
      expiryDate: { $gte: today, $lte: sevenDaysLater },
      quantity: { $gt: 0 }
    });

    const expiredItems = await Inventory.countDocuments({
      expiryDate: { $lt: today }
    });

    const summary = {
      totalItems,
      totalQuantity: totalQuantity[0]?.total || 0,
      categoriesCount: uniqueCategories.length,
      suppliersCount: uniqueSuppliers.length,
      lowStockCount: lowStockItems,
      outOfStockCount: outOfStockItems,
      expiringSoonCount: expiringSoon,
      expiredCount: expiredItems
    };

    sendSuccessResponse(res, 'Inventory summary fetched successfully', { summary });

  } catch (error) {
    console.error('Get Inventory Summary Error:', error);
    sendErrorResponse(res, 'Error fetching inventory summary', 500);
  }
};
