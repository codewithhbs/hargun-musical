const Brand = require('../models/Brand');

exports.createBrand = async (req, res) => {
    try {
        const { brand_name } = req.body;
        if(!brand_name) {
            return res.status(400).json({ message: "Brand name is required" });
        }
        const newBrand = new Brand({ brand_name });
        await newBrand.save();
        res.status(201).json({ message: "Brand created successfully", brand: newBrand });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Error deleting brand", 
            error: error.message
        });
    }
};

exports.getBrands = async (req, res) => {
    try {
        const brands = await Brand.find();
        if (brands.length === 0) {
            return res.status(200).json({ success: true , message: "No brands found" });
        }
        res.status(200).json({ message: "Brands fetched successfully", brands });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Error deleting brand", 
            error: error.message
        });
    }
};

exports.getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.find();
        if (brands.length === 0) {
            return res.status(200).json({ success: true , message: "No brands found" });
        }
        res.status(200).json({ success: true, message: "All Brands fetched successfully", data: brands });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Error deleting brand", 
            error: error.message
        });
    }
};

exports.updateBrand = async (req, res) => {
    try {
        const {id} = req.params;
        const { brand_name } = req.body;
        const updatedBrand = await Brand.findByIdAndUpdate(id, { brand_name }, { new: true });
        if (!updatedBrand) {
            return res.status(404).json({ message: "Brand not found" });
        }
        res.status(200).json({ message: "Brand updated successfully", brand: updatedBrand });
    } catch (error) {
        console.log("Internal server error", error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBrand = await Brand.findByIdAndDelete(id);
        if (!deletedBrand) {
            return res.status(404).json({ message: "Brand not found" });
        }
        res.status(200).json({ message: "Brand deleted successfully" });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Error deleting brand", 
            error: error.message
        });
    }
};