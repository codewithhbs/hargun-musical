"use client";

import { useEffect, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import axios from "axios";
import { useParams } from "react-router-dom";
import ImprovedLoader from "../../components/Layout/Loader";

const Input = ({
  label,
  type,
  name,
  value,
  onChange,
  className = "",
  readonly = false,
  placeholder = "",
}) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      readOnly={readonly}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
    />
  </div>
);

const TextArea = ({
  label,
  name,
  value,
  onChange,
  className = "",
  readonly = false,
  placeholder = "",
}) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <textarea
      rows={4}
      cols={5}
      placeholder={placeholder}
      readOnly={readonly}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
    />
  </div>
);

const EditProduct = () => {
  const [formData, setFormData] = useState({
    product_name: "",
    product_description: "",
    isVarient: false,
    Varient: [],
    category: "",
    extra_description: "",
    tag: "",
    isShowOnHomeScreen: false,
    ProductMainImage: null,
    SecondImage: null,
    ThirdImage: null,
    FourthImage: null,
    FifthImage: null,
    price: "",
    discount: "",
    afterDiscountPrice: "",
    stock: "",
    brand: "",
  });

  const [error, setError] = useState("");
  const [images, setImages] = useState({
    first: null,
    second: null,
    third: null,
    fourth: null,
    fifth: null,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [allCategory, setCategory] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [allBrands, setAllBrands] = useState([]);

  // Color management states

  const { id } = useParams();
  const [isVariantOpen, setIsVariantOpen] = useState(true);

  const handleFetchBrand = async () => {
    try {
      const res = await axios.get("http://localhost:7500/api/v1/admin/brand");
      const data = res.data.data;
      if (data) {
        setAllBrands(data);
      }
    } catch (error) {
      console.log(error);
      setAllBrands([]);
    }
  };

  useEffect(() => {
    handleFetchBrand();
  }, []);

  const handleAddVarients = () => {
    setFormData((prevData) => ({
      ...prevData,
      Varient: [
        ...prevData.Varient,
        {
          quantity: "",
          price: "",
          discount_percentage: "",
          isStock: false,
          // stock_quantity: "",
          price_after_discount: "", // Fixed field name to match schema
        },
      ],
    }));
  };

  const fetchCategoryData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:7500/api/v1/admin/category",
      );
      const data = res.data.categories;

      if (data) {
        setCategory(data);
      }
    } catch (error) {
      console.log(error);
      setCategory([]);
    }
  };

  const handleRemoveVarients = (index) => {
    const updatedVarients = formData.Varient.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      Varient: updatedVarients,
    }));
  };

  const calculateDiscountPrice = (price, priceDiscountPercentage) => {
    const discountedPrice = price - (price * priceDiscountPercentage) / 100;
    return discountedPrice;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: newValue,
      };

      // Calculate discount price for main product (non-variant)
      if (name === "price" || name === "discount") {
        const price =
          Number.parseFloat(name === "price" ? newValue : updatedData.price) ||
          0;
        const discount =
          Number.parseFloat(
            name === "discount" ? newValue : updatedData.discount,
          ) || 0;
        const discountedPrice = calculateDiscountPrice(price, discount);
        updatedData.afterDiscountPrice = discountedPrice.toFixed(2);
      }

      return updatedData;
    });

    // Handle category selection
    if (name === "category") {
      const selectedCategory = value;
      const category = allCategory.find((c) => c._id === selectedCategory);
      if (category) {
        setSelectedSubCategories(category.SubCategory || []);
      } else {
        setSelectedSubCategories([]);
      }
    }
  };

  // Fixed variant change handler with proper price_after_discount calculation
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const field = name.split(".").pop();

    setFormData((prevData) => {
      const updatedVarients = [...prevData.Varient];
      updatedVarients[index] = {
        ...updatedVarients[index],
        [field]: value,
      };

      // Calculate price_after_discount when price or discount_percentage changes
      if (field === "price" || field === "discount_percentage") {
        const price = Number.parseFloat(updatedVarients[index].price) || 0;
        const discount =
          Number.parseFloat(updatedVarients[index].discount_percentage) || 0;
        const discountedPrice = calculateDiscountPrice(price, discount);
        updatedVarients[index].price_after_discount =
          discountedPrice.toFixed(2);
      }

      return {
        ...prevData,
        Varient: updatedVarients,
      };
    });
  };

  const handleFileChange = (e, imageType) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prevData) => ({
        ...prevData,
        [imageType]: {
          file,
          previewUrl: reader.result,
        },
      }));
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleFetchProductDetails = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:7500/api/v1/get-product/${id}`,
      );
      const productData = data?.data;

      console.log("productData", productData);

      // Handle color data - ensure it's always an array
      const processedProductData = {
        ...productData,
        // Fix category field - handle both string and object
        category: productData?.category?._id || productData?.category || "",
        // Ensure tag field is handled properly
        tag: productData?.tag || "",
        // Ensure price fields are strings for inputs
        price: productData?.price?.toString() || "",
        discount: productData?.discount?.toString() || "",
        afterDiscountPrice: productData?.afterDiscountPrice?.toString() || "",
        stock: productData?.stock?.toString() || "",
        // Ensure variants have proper price_after_discount field
        Varient:
          productData?.Varient?.map((variant) => ({
            ...variant,
            price_after_discount:
              variant.price_after_discount?.toString() ||
              calculateDiscountPrice(
                variant.price || 0,
                variant.discount_percentage || 0,
              ).toFixed(2),
          })) || [],
      };

      setFormData(processedProductData);

      if (productData) {
        setImages({
          first: {
            previewUrl: productData?.ProductMainImage?.url,
          },
          second: {
            previewUrl: productData?.SecondImage?.url,
          },
          third: {
            previewUrl: productData?.ThirdImage?.url,
          },
          fourth: {
            previewUrl: productData?.FourthImage?.url,
          },
          fifth: {
            previewUrl: productData?.FifthImage?.url,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  useEffect(() => {
    if (id) {
      handleFetchProductDetails();
    }
  }, [id]);

  const handleSubmit = async () => {
    setLoading(true);
    const formDataObject = new FormData();

    try {
      // Append category ID explicitly
      formDataObject.append("category", formData.category || "");

      // Handle color array - convert to comma-separated string for backend
      if (formData.color && formData.color.length > 0) {
        formDataObject.append("color", formData.color.join(","));
      }

      // Append the rest of the fields except category and color
      Object.entries(formData).forEach(([key, value]) => {
        if (value === null || value === undefined) return;
        // Skip category and color to avoid double appending
        if (key === "category" || key === "color") return;

        if (typeof value === "object" && value.file) {
          // For file uploads like ProductMainImage
          formDataObject.append(key, value.file);
        } else if (key === "Varient") {
          // Convert array of variants to JSON string
          formDataObject.append(key, JSON.stringify(value));
        } else {
          formDataObject.append(key, value);
        }
      });

      const { data } = await axios.post(
        `http://localhost:7500/api/v1/update-product/${id}`,
        formDataObject,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (data.success) {
        setSuccess(true);
        setError("");
        console.log("Product updated successfully");
      } else {
        setSuccess(false);
        setError(data.message || "Something went wrong");
      }

      setLoading(false);
      setTimeout(() => {
        setSuccess(false);
        setError("");
      }, 4000);
    } catch (error) {
      setLoading(false);
      setSuccess(false);
      setError(
        error.response?.data?.message || "An error occurred. Please try again.",
      );
      console.error(error);
    }
  };

  if (loading) {
    return <ImprovedLoader loading={loading} />;
  }

  if (success) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-[#81190B] bg-opacity-75 z-50">
        {/* Success Modal */}
        <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
          <h2 className="text-xl font-semibold text-green-500">
            Product Updated Successfully!
          </h2>
          <p className="mt-4 text-gray-700">
            Your product has been updated successfully. You can now proceed with
            other actions.
          </p>
          <button
            onClick={() => {
              setSuccess(false);
            }}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 ">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Edit Product
        </h1>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Product Name"
              type="text"
              name="product_name"
              value={formData?.product_name || ""}
              onChange={handleInputChange}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData?.category || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Category</option>
                {allCategory?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {/* Debug info - remove in production */}
              {/* <div className="text-xs text-gray-500 mt-1">
                Selected: {formData?.category || "None"} | Available: {allCategory?.length || 0} categories
              </div> */}
            </div>

            {/* ✅ Brand Field */}
            <div>
              <label className="block text-sm font-medium mb-1">Brand</label>
              <select
                name="brand"
                value={formData?.brand || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select Brand</option>
                {allBrands?.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.brand_name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Tag"
              type="text"
              name="tag"
              value={formData?.tag || ""}
              onChange={handleInputChange}
              placeholder="Enter product tags"
            />
          </div>

          {/* Debug section - remove in production */}
          {/* <div className="bg-gray-100 p-4 rounded-md text-sm">
            <h4 className="font-semibold">Debug Info:</h4>
            <p>Tag Value: "{formData?.tag}"</p>
            <p>Category Value: "{formData?.category}"</p>
            <p>Categories Loaded: {allCategory?.length}</p>
          </div> */}

          {/* Color Management Section */}
          {/* <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Product Colors</h3>

       
            <div className="flex gap-2">
              <input
                type="text"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                placeholder="Enter color name"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Color
              </button>
            </div>

           
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Or select from predefined colors:</p>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorSelect(color)}
                    disabled={formData.color.includes(color)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      formData.color.includes(color)
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

         
            {formData.color.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selected Colors:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.color.map((color, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                    >
                      {color}
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(color)}
                        className="ml-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div> */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextArea
              label="Product Description"
              name="product_description"
              value={formData?.product_description || ""}
              onChange={handleInputChange}
            />
            <TextArea
              label="Extra Description"
              name="extra_description"
              value={formData?.extra_description || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex items-center justify-between space-x-4">
            <div className="border-black border-2 dark:border-gray-300 rounded-3xl px-12 py-3">
              <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                <span>Enable Product Variants</span>
                <input
                  type="checkbox"
                  name="isVarient"
                  checked={formData?.isVarient}
                  onChange={handleInputChange}
                  className="hidden"
                />
                <div className="relative">
                  <div
                    className={`w-14 h-5 rounded-full transition duration-300 ease-in-out ${
                      formData?.isVarient ? "bg-indigo-600" : "bg-gray-400"
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-6 h-3 rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
                        formData?.isVarient ? "transform translate-x-6" : ""
                      }`}
                    />
                  </div>
                </div>
              </label>
            </div>

            <div className="border-black border-2  dark:border-gray-300 rounded-3xl px-12 py-3">
              <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                <span>Enable Home Screen Preview</span>
                <input
                  type="checkbox"
                  name="isShowOnHomeScreen"
                  checked={formData?.isShowOnHomeScreen}
                  onChange={handleInputChange}
                  className="hidden"
                />
                <div className="relative">
                  <div
                    className={`w-14 h-5 rounded-full transition duration-300 ease-in-out ${
                      formData?.isShowOnHomeScreen
                        ? "bg-indigo-600"
                        : "bg-gray-400"
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-6 h-3 rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
                        formData?.isShowOnHomeScreen
                          ? "transform translate-x-6"
                          : ""
                      }`}
                    />
                  </div>
                </div>
              </label>
            </div>
          </div>

          {formData?.isVarient === false && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Input
                label="Price"
                type="number"
                name="price"
                value={formData?.price || ""}
                onChange={handleInputChange}
              />
              <Input
                label="Discount"
                type="number"
                name="discount"
                value={formData?.discount || ""}
                onChange={handleInputChange}
              />
              <Input
                label="Final Price"
                type="number"
                name="afterDiscountPrice"
                readonly={true}
                value={formData?.afterDiscountPrice || ""}
                onChange={handleInputChange}
              />
              <Input
                label="Stock"
                type="number"
                name="stock"
                value={formData?.stock || ""}
                onChange={handleInputChange}
              />
            </div>
          )}

          {/* Variants Section */}
          {formData?.isVarient && (
            <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setIsVariantOpen(!isVariantOpen)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 text-left text-gray-900 dark:text-white font-medium"
              >
                <span>Product Variants</span>
                {isVariantOpen ? <FiChevronUp /> : <FiChevronDown />}
              </button>

              {isVariantOpen && (
                <div className="p-4 space-y-4">
                  {formData?.Varient.map((variant, index) => (
                    <div
                      key={index}
                      className="p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Write product quantity in grams (ex:50g, 100g)"
                          type="text"
                          placeholder="Write Weight of Product"
                          name={`Varient[${index}].quantity`}
                          value={variant.quantity}
                          onChange={(e) => handleChange(e, index)}
                        />
                        <Input
                          label="Price"
                          type="number"
                          name={`Varient[${index}].price`}
                          value={variant.price}
                          onChange={(e) => handleChange(e, index)}
                        />
                        <Input
                          label="Discount Percentage"
                          type="number"
                          name={`Varient[${index}].discount_percentage`}
                          value={variant.discount_percentage}
                          onChange={(e) => handleChange(e, index)}
                        />
                        {/* <Input
                          label="Stock Quantity"
                          type="number"
                          name={`Varient[${index}].stock_quantity`}
                          value={variant.stock_quantity}
                          onChange={(e) => handleChange(e, index)}
                        /> */}
                      </div>

                      {/* Display calculated price after discount */}
                      {variant.price && variant.discount_percentage && (
                        <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md">
                          <p className="text-sm text-indigo-700 dark:text-indigo-300">
                            Price After Discount:{" "}
                            <span className="font-semibold">
                              Rs:{" "}
                              {variant.price_after_discount ||
                                calculateDiscountPrice(
                                  variant.price,
                                  variant.discount_percentage,
                                ).toFixed(2)}
                            </span>
                          </p>
                        </div>
                      )}

                      <div className="flex space-x-2 mt-4">
                        <button
                          type="button"
                          onClick={() => handleRemoveVarients(index)}
                          className="px-4 py-2 bg-red-500 text-white rounded-md"
                        >
                          Remove Variant
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddVarients}
                    className="w-full py-2 px-4 border bg-gray-800 text-white rounded-md mt-4"
                  >
                    Add Variant
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="space-y-4 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {/* Main Image */}
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
                  Main Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "ProductMainImage")}
                  className="mt-1 block w-full text-sm text-gray-900 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-600 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
                {(formData?.ProductMainImage || images.first) && (
                  <div className="mt-4">
                    <img
                      src={
                        formData?.ProductMainImage?.previewUrl ||
                        images.first?.previewUrl
                      }
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>

              {/* Second Image */}
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
                  Second Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "SecondImage")}
                  className="mt-1 block w-full text-sm text-gray-900 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-600 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
                {(formData?.SecondImage || images.second) && (
                  <div className="mt-4">
                    <img
                      src={
                        formData?.SecondImage?.previewUrl ||
                        images.second?.previewUrl
                      }
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>

              {/* Third Image */}
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
                  Third Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "ThirdImage")}
                  className="mt-1 block w-full text-sm text-gray-900 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-600 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
                {(formData?.ThirdImage || images.third) && (
                  <div className="mt-4">
                    <img
                      src={
                        formData?.ThirdImage?.previewUrl ||
                        images.third?.previewUrl
                      }
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>

              {/* Fourth Image */}
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
                  Fourth Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "FourthImage")}
                  className="mt-1 block w-full text-sm text-gray-900 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-600 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
                {(formData?.FourthImage || images.fourth) && (
                  <div className="mt-4">
                    <img
                      src={
                        formData?.FourthImage?.previewUrl ||
                        images.fourth?.previewUrl
                      }
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>

              {/* Fifth Image */}
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
                  Fifth Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "FifthImage")}
                  className="mt-1 block w-full text-sm text-gray-900 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-600 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
                {(formData?.FifthImage || images.fifth) && (
                  <div className="mt-4">
                    <img
                      src={
                        formData?.FifthImage?.previewUrl ||
                        images.fifth?.previewUrl
                      }
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Update Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
