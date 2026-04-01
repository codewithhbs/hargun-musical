import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Subscribe from "../../components/Subscribe/Subscribe";

// ===================== STATIC DATA =====================

const discounts = [
  { id: "d1", label: "Upto 5%", min: 0, max: 5 },
  { id: "d2", label: "5% - 10%", min: 5, max: 10 },
  { id: "d3", label: "10% - 15%", min: 10, max: 15 },
  { id: "d4", label: "15% - 25%", min: 15, max: 25 },
  { id: "d5", label: "More than 25%", min: 25, max: 100 },
];
const sortOptions = [
  { value: "popularity", label: "Popularity" },
  { value: "low-to-high-price", label: "Low to High Price" },
  { value: "high-to-low-price", label: "High to Low Price" },
  { value: "average-rating", label: "Average Rating" },
  { value: "a-z-order", label: "A-Z Order" },
  { value: "z-a-order", label: "Z-A Order" },
];

const PRODUCTS_PER_PAGE = 12;

// ===================== HELPERS =====================

const formatPrice = (price) => {
  if (price == null) return "";
  return `₹${Number(price).toFixed(2)}`;
};

const calcAvgRating = (reviews = []) => {
  if (!reviews.length) return 0;
  return reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length;
};

const calcRatingPercent = (reviews = []) => {
  return Math.round((calcAvgRating(reviews) / 5) * 100);
};

// ===================== SUB COMPONENTS =====================

const CheckboxItem = ({ label, count, checked, onChange }) => (
  <li>
    <label className="group flex items-center justify-between w-full cursor-pointer">
      <span className="flex items-center gap-x-2">
        <span className="group-has-[input:checked]:group-hover:bg-[#00AB55]/8 flex items-center justify-center w-9 h-9 bg-transparent rounded-full group-hover:bg-[#919EAB]/8 transition-colors duration-300 ease-in-out">
          <span className="relative inline-flex w-5 h-5 items-center justify-center">
            <input
              type="checkbox"
              checked={checked}
              onChange={onChange}
              className="peer appearance-none w-full h-full border-2 focus:outline-none checked:border-none border-gray-300 rounded-sm bg-white checked:bg-primary transition-all duration-300 ease-in-out"
            />
            <span className="absolute inset-0 inline-flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-all">
              <i className="hgi hgi-stroke hgi-tick-02 text-[18px] leading-[18px]"></i>
            </span>
          </span>
        </span>
        <span className="text-light-primary-text group-hover:text-primary transition-colors duration-300 ease-in-out">
          {label}
        </span>
      </span>
      {count != null && (
        <span className="group-hover:text-primary transition-colors duration-300 ease-in-out">
          ({count})
        </span>
      )}
    </label>
  </li>
);

const FilterSection = ({ title, onReset, children }) => (
  <div className="wow animate__animated animate__fadeInUp" data-wow-delay=".2s">
    <div className="flex flex-col gap-y-4 py-8 border-b border-gray-300">
      <div className="flex items-center justify-between">
        <h6>{title}</h6>
        <button
          onClick={onReset}
          className="text-base leading-[26px] hover:underline hover:text-primary transition-colors duration-300 ease-in-out"
        >
          Reset
        </button>
      </div>
      {children}
    </div>
  </div>
);

// ===================== PRODUCT CARD =====================

const ProductCard = ({ product, delay }) => {
  const productImg =
    product.ProductMainImage?.url || "assets/images/vitamin-c.png";
  const ratingPct = calcRatingPercent(product.reviews || []);
  const reviewCount = (product.reviews || []).length;
  const firstVariant =
    product.isVarient && product.Varient?.length > 0
      ? product.Varient[0]
      : null;

  const currentPrice = firstVariant
    ? formatPrice(firstVariant.price_after_discount ?? firstVariant.price)
    : formatPrice(product.afterDiscountPrice || product.price);

  const oldPrice = firstVariant
    ? firstVariant.discount_percentage > 0
      ? formatPrice(firstVariant.price)
      : null
    : product.discount > 0
      ? formatPrice(product.price)
      : null;

  return (
    <div
      className="xl:col-span-4 md:col-span-6 col-span-12 wow animate__animated animate__fadeInUp"
      data-wow-delay={delay}
    >
      <div className="border border-gray-300 rounded-2xl product-card-1 p-4 group">
        <div className="product-image-container relative">
          <div className="product-image rounded-xl bg-[#F4F3F5] mb-4 overflow-hidden">
            <a href={`/product-detail/${product.slug}`}>
              <img
                src={productImg}
                alt={product.product_name}
                className="group-hover:scale-110 transition-all h-[358px] transform group-hover:-rotate-3 ease-in-out duration-300 w-full object-cover"
              />
            </a>
          </div>
          {product.tag && (
            <span
              style={{ top: "0%", left: "0%" }}
              className="absolute top-2 left-2 bg-error text-white font-normal uppercase text-xs leading-[18px] rounded-md py-px px-2"
            >
              {product.tag}
            </span>
          )}
        </div>
        <div className="product-content">
          <h5 className="text-base leading-6 font-semibold font-dm-sans mb-4 line-clamp-2">
            <a href={`/product-detail/${product.slug}`}>
              {product.product_name}
            </a>
          </h5>
          <div className="rating-section flex items-center mb-4">
            <div className="bg-[url('../images/star-icon.png')] w-[90px] h-4.5 bg-repeat-x overflow-hidden bg-position-[0_0]">
              <div
                style={{ width: `${ratingPct}%` }}
                className="bg-[url('../images/star-icon.png')] h-4.5 bg-repeat-x bg-position-[0_-18px]"
              ></div>
            </div>
            <span className="text-sm leading-[22px] font-normal inline-block ml-1">
              ({reviewCount})
            </span>
          </div>
          <div className="price-section flex items-center gap-x-3 mb-2 flex-wrap gap-y-1">
            <span className="current-price text-base font-semibold text-light-primary-text">
              {currentPrice}
            </span>
            {oldPrice && (
              <>
                <span className="old-price text-sm leading-[22px] font-normal text-light-disabled-text line-through">
                  {oldPrice}
                </span>
                <span className="discount-percentage text-sm leading-[22px] font-semibold text-error">
                  {firstVariant
                    ? firstVariant.discount_percentage
                    : product.discount}
                  % OFF
                </span>
              </>
            )}
          </div>
          <div className="btn-section flex items-center gap-x-4">
            {/* <a
              className="size-11 flex flex-none items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-300"
              href="wishlist-style-v1.html"
            >
              <i className="hgi hgi-stroke hgi-favourite text-xl text-light-secondary-text"></i>
            </a> */}
            <a
              className="btn btn-primary rounded-full font-semibold text-sm leading-6 px-6.5 py-2 flex-1"
              href={`/product-detail/${product.slug}`}
            >
              <i className="hgi hgi-stroke hgi-shopping-cart-02 text-xl text-white"></i>
              <span>View Product</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===================== SKELETON =====================

const SkeletonCard = () => (
  <div className="xl:col-span-4 md:col-span-6 col-span-12 animate-pulse">
    <div className="border border-gray-200 rounded-2xl p-4">
      <div className="h-[200px] bg-gray-200 rounded-xl mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
      <div className="h-10 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);

// ===================== MAIN COMPONENT =====================

const Shop = () => {
  // ---- API Data ----
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---- Filter States ----
  const [openCategories, setOpenCategories] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([]); // category slugs
  const [selectedBrands, setSelectedBrands] = useState([]); // brand _ids
  const [selectedDiscounts, setSelectedDiscounts] = useState([]); // discount ids
  const [selectedRating, setSelectedRating] = useState(null); // min star count
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [sortBy, setSortBy] = useState("popularity");

  // ---- Pagination ----
  const [currentPage, setCurrentPage] = useState(1);

  // ===================== FETCH =====================

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes, brandRes] = await Promise.all([
          axios.get("https://api.hargunmusicals.com/api/v1/get-product"),
          axios.get("https://api.hargunmusicals.com/api/v1/admin/category"),
          axios.get("https://api.hargunmusicals.com/api/v1/admin/brand"),
        ]);
        setAllProducts(prodRes.data.products || []);
        setAllCategories(catRes.data.categories || []);
        setAllBrands(brandRes.data.data || []);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ===================== FILTER LOGIC =====================

  const filteredProducts = allProducts
    .filter((p) => {
      // Category filter
      if (selectedCategories.length > 0) {
        if (!selectedCategories.includes(p.category?.slug)) return false;
      }

      // Brand filter
      if (selectedBrands.length > 0) {
        const brandId = typeof p.brand === "object" ? p.brand?._id : p.brand;
        if (!selectedBrands.includes(brandId)) return false;
      }

      // Price filter
      // Price filter
      const firstVariant =
        p.isVarient && p.Varient?.length > 0 ? p.Varient[0] : null;
      const price = firstVariant
        ? (firstVariant.price_after_discount ?? firstVariant.price)
        : p.afterDiscountPrice || p.price || 0;
      if (minPrice !== "" && price < Number(minPrice)) return false;
      if (maxPrice !== "" && price > Number(maxPrice)) return false;

      // Discount filter
      if (selectedDiscounts.length > 0) {
        const disc = p.discount || 0;
        const matched = selectedDiscounts.some((id) => {
          const d = discounts.find((x) => x.id === id);
          return d && disc >= d.min && disc <= d.max;
        });
        if (!matched) return false;
      }

      // Rating filter
      if (selectedRating !== null) {
        const avg = calcAvgRating(p.reviews || []);
        if (avg < selectedRating) return false;
      }

      return true;
    })
    .sort((a, b) => {
      const getEffectivePrice = (p) => {
        const fv = p.isVarient && p.Varient?.length > 0 ? p.Varient[0] : null;
        return fv
          ? (fv.price_after_discount ?? fv.price)
          : p.afterDiscountPrice || p.price || 0;
      };
      if (sortBy === "low-to-high-price")
        return getEffectivePrice(a) - getEffectivePrice(b);
      if (sortBy === "high-to-low-price")
        return getEffectivePrice(b) - getEffectivePrice(a);
      if (sortBy === "average-rating")
        return calcAvgRating(b.reviews || []) - calcAvgRating(a.reviews || []);
      if (sortBy === "a-z-order")
        return (a.product_name || "").localeCompare(b.product_name || "");
      if (sortBy === "z-a-order")
        return (b.product_name || "").localeCompare(a.product_name || "");
      // popularity - review count
      return (b.reviews?.length || 0) - (a.reviews?.length || 0);
    });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategories,
    selectedBrands,
    selectedDiscounts,
    selectedRating,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  // ===================== HANDLERS =====================

  const toggleCategory = (id) =>
    setOpenCategories((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleCategoryFilter = (slug) =>
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );

  const toggleBrandFilter = (id) =>
    setSelectedBrands((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id],
    );

  const toggleDiscountFilter = (id) =>
    setSelectedDiscounts((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedDiscounts([]);
    setSelectedRating(null);
    setMinPrice("");
    setMaxPrice("");
    setSortBy("popularity");
    setCategorySearch("");
    setCurrentPage(1);
  };

  // ===================== FILTERED CATEGORIES (search) =====================

  const visibleCategories = allCategories.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase()),
  );

  // Pagination pages display
  const getPageNumbers = () => {
    const pages = [];
    const range = 2;
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - range && i <= currentPage + range)
      ) {
        pages.push(i);
      }
    }
    return pages;
  };

  const delays = [".2s", ".3s", ".4s"];

  return (
    <>
      {/* Breadcrumb */}
      <div className="container py-12">
        <div className="breadcrumb">
          <ul>
            <li>
              <a href="/">
                <span className="inline-flex items-center justify-center">
                  <i className="hgi hgi-stroke hgi-home-01 text-2xl leading-6"></i>
                </span>
                Home
              </a>
            </li>
            <li className="text-light-disabled-text">&#8226;</li>
            <li>
              <span className="text-sm leading-[22px]">Shop</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Filter + Products */}
      <section className="pb-[90px]">
        <div className="container">
          <div className="grid grid-cols-12 lg:gap-x-6 gap-y-6">
            {/* ===== SIDEBAR ===== */}
            <div className="xl:col-span-3 lg:col-span-4 col-span-12 row-start-2 lg:row-start-auto">
              <div className="sidebar sticky top-20">
                <div className="border border-gray-300 rounded-2xl">
                  {/* Sidebar Title */}
                  <div
                    className="px-6 py-4 bg-gray-200 rounded-t-2xl sidebar-title wow animate__animated animate__fadeInUp"
                    data-wow-delay=".2s"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="text-light-primary-text">Filters</h5>
                      <button
                        onClick={clearAllFilters}
                        className="text-primary text-base leading-[26px] font-semibold hover:underline"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  <div className="px-6 py-6">
                    {/* ---- CATEGORY ---- */}
                    <div
                      className="widget-category wow animate__animated animate__fadeInUp"
                      data-wow-delay=".2s"
                    >
                      <div className="flex flex-col gap-y-4 pb-8 border-b border-gray-300">
                        <div className="flex items-center justify-between widget-category-title">
                          <h6>Category</h6>
                          <button
                            onClick={() => setSelectedCategories([])}
                            className="text-base leading-[26px] hover:underline hover:text-primary transition-colors duration-300 ease-in-out"
                          >
                            Reset
                          </button>
                        </div>

                        {/* Search */}
                        <div className="input-group medium pl-4 py-2 pr-2.5 rounded-[100px] widget-category-search relative w-full">
                          <div
                            className="input-group-addon inline-flex items-center justify-center leading-6"
                            data-align="inline-start"
                          >
                            <i className="hgi hgi-stroke hgi-search-01 text-2xl leading-6 text-light-primary-text"></i>
                          </div>
                          <input
                            type="text"
                            value={categorySearch}
                            onChange={(e) => setCategorySearch(e.target.value)}
                            className="form-control focus:outline-none"
                            placeholder="Search categories..."
                          />
                        </div>

                        {/* Category List */}
                        <div className="widget-category-content-list">
                          <div className="max-h-[280px] overflow-y-auto pr-2.5 category-scroll">
                            {loading ? (
                              <div className="space-y-2">
                                {[1, 2, 3].map((i) => (
                                  <div
                                    key={i}
                                    className="h-8 bg-gray-200 rounded animate-pulse"
                                  ></div>
                                ))}
                              </div>
                            ) : (
                              <ul className="flex flex-col gap-y-1">
                                {visibleCategories.map((cat) => (
                                  <li
                                    key={cat._id}
                                    className="widget-category-content-list-items"
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <label className="group flex items-center gap-x-2 cursor-pointer flex-1">
                                        <span className="flex items-center justify-center w-9 h-9 bg-transparent rounded-full group-hover:bg-[#919EAB]/8 transition-colors duration-300 ease-in-out">
                                          <span className="relative inline-flex w-5 h-5 items-center justify-center">
                                            <input
                                              type="checkbox"
                                              checked={selectedCategories.includes(
                                                cat.slug,
                                              )}
                                              onChange={() =>
                                                toggleCategoryFilter(cat.slug)
                                              }
                                              className="peer appearance-none w-full h-full border-2 focus:outline-none checked:border-none border-gray-300 rounded-sm bg-white checked:bg-primary transition-all duration-300 ease-in-out"
                                            />
                                            <span className="absolute inset-0 inline-flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-all">
                                              <i className="hgi hgi-stroke hgi-tick-02 text-[18px] leading-[18px]"></i>
                                            </span>
                                          </span>
                                        </span>
                                        <span className="text-light-primary-text group-hover:text-primary transition-colors duration-300 ease-in-out font-medium">
                                          {cat.name}
                                        </span>
                                      </label>
                                      {cat.SubCategory?.length > 0 && (
                                        <button
                                          onClick={() =>
                                            toggleCategory(cat._id)
                                          }
                                          className="w-6 h-6 inline-flex items-center justify-center text-light-secondary-text hover:text-primary transition-colors duration-200"
                                        >
                                          <i
                                            className={`hgi hgi-stroke ${openCategories[cat._id] ? "hgi-arrow-up-01" : "hgi-arrow-down-01"} text-base`}
                                          ></i>
                                        </button>
                                      )}
                                    </div>

                                    {/* Subcategories */}
                                    {openCategories[cat._id] &&
                                      cat.SubCategory?.length > 0 && (
                                        <ul className="ml-9 mt-1 flex flex-col gap-y-1 border-l-2 border-gray-200 pl-3">
                                          {cat.SubCategory.map((sub) => (
                                            <li key={sub._id}>
                                              <label className="group flex items-center justify-between w-full cursor-pointer">
                                                <span className="flex items-center gap-x-2">
                                                  <span className="flex items-center justify-center w-7 h-7 bg-transparent rounded-full group-hover:bg-[#919EAB]/8 transition-colors duration-300 ease-in-out">
                                                    <span className="relative inline-flex w-4 h-4 items-center justify-center">
                                                      <input
                                                        type="checkbox"
                                                        className="peer appearance-none w-full h-full border-2 focus:outline-none checked:border-none border-gray-300 rounded-sm bg-white checked:bg-primary transition-all duration-300 ease-in-out"
                                                      />
                                                      <span className="absolute inset-0 inline-flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-all">
                                                        <i className="hgi hgi-stroke hgi-tick-02 text-[14px] leading-[14px]"></i>
                                                      </span>
                                                    </span>
                                                  </span>
                                                  <span className="text-sm text-light-secondary-text group-hover:text-primary transition-colors duration-300 ease-in-out">
                                                    {sub.name}
                                                  </span>
                                                </span>
                                              </label>
                                            </li>
                                          ))}
                                        </ul>
                                      )}
                                  </li>
                                ))}

                                {visibleCategories.length === 0 && (
                                  <p className="text-sm text-light-disabled-text py-2">
                                    No categories found.
                                  </p>
                                )}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ---- PRICE RANGE ---- */}
                    <div
                      className="wow animate__animated animate__fadeInUp"
                      data-wow-delay=".2s"
                    >
                      <div className="flex flex-col gap-y-6 py-8 border-b border-gray-300">
                        <div className="flex items-center justify-between">
                          <h6>Price Range</h6>
                          <button
                            onClick={() => {
                              setMinPrice("");
                              setMaxPrice("");
                            }}
                            className="text-base leading-[26px] hover:underline hover:text-primary transition-colors duration-300 ease-in-out"
                          >
                            Reset
                          </button>
                        </div>
                        <div className="price-range-values flex items-center justify-between gap-x-2">
                          <div className="input-group medium max-w-[147px] w-full rounded-[80px] py-2 px-3.5">
                            <div
                              className="input-group-addon inline-flex items-center justify-center leading-6"
                              data-align="inline-start"
                            >
                              ₹
                            </div>
                            <input
                              className="price-range-min-value form-control focus:outline-none"
                              type="number"
                              placeholder="Min"
                              value={minPrice}
                              onChange={(e) => setMinPrice(e.target.value)}
                            />
                          </div>
                          <span className="text-sm leading-[22px] text-light-disabled-text">
                            To
                          </span>
                          <div className="input-group medium max-w-[147px] w-full rounded-[80px] py-2 px-3.5">
                            <div
                              className="input-group-addon inline-flex items-center justify-center leading-6"
                              data-align="inline-start"
                            >
                              ₹
                            </div>
                            <input
                              className="price-range-max-value form-control focus:outline-none"
                              type="number"
                              placeholder="Max"
                              value={maxPrice}
                              onChange={(e) => setMaxPrice(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ---- RATING ---- */}
                    {/* <FilterSection title="Rating" onReset={() => setSelectedRating(null)}>
                      <div className="ratings">
                        <ul className="flex items-center flex-wrap gap-3">
                          {ratings.map((r) => (
                            <li key={r}>
                              <button
                                onClick={() => setSelectedRating(selectedRating === r ? null : r)}
                                className={`btn ${selectedRating === r ? 'btn-primary' : 'btn-default outline'} shadow-none gap-x-1.5 items-center text-base leading-6 px-2.5 py-1.5 rounded-[80px]`}
                              >
                                {r}
                                <div className="bg-[url('../images/star-icon.png')] w-5 h-4.5 bg-repeat-x overflow-hidden bg-position-[0_0]">
                                  <div style={{ width: '100%' }} className="bg-[url('../images/star-icon.png')] h-4.5 bg-repeat-x bg-position-[0_-18px]"></div>
                                </div>
                                {selectedRating !== r && <span className="text-xs">+</span>}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </FilterSection> */}

                    {/* ---- DISCOUNT ---- */}
                    <FilterSection
                      title="Discount"
                      onReset={() => setSelectedDiscounts([])}
                    >
                      <div className="discount">
                        <ul className="flex flex-col gap-y-2">
                          {discounts.map((d) => (
                            <CheckboxItem
                              key={d.id}
                              label={d.label}
                              checked={selectedDiscounts.includes(d.id)}
                              onChange={() => toggleDiscountFilter(d.id)}
                            />
                          ))}
                        </ul>
                      </div>
                    </FilterSection>

                    {/* ---- BRAND ---- */}
                    <FilterSection
                      title="Brand"
                      onReset={() => setSelectedBrands([])}
                    >
                      <div className="brand-content-list">
                        <div className="max-h-[170px] overflow-y-auto pr-2.5 category-scroll">
                          {loading ? (
                            <div className="space-y-2">
                              {[1, 2, 3].map((i) => (
                                <div
                                  key={i}
                                  className="h-8 bg-gray-200 rounded animate-pulse"
                                ></div>
                              ))}
                            </div>
                          ) : (
                            <ul className="flex flex-col gap-y-2">
                              {allBrands.map((b) => (
                                <CheckboxItem
                                  key={b._id}
                                  label={b.brand_name}
                                  checked={selectedBrands.includes(b._id)}
                                  onChange={() => toggleBrandFilter(b._id)}
                                />
                              ))}
                              {allBrands.length === 0 && (
                                <p className="text-sm text-light-disabled-text">
                                  No brands available.
                                </p>
                              )}
                            </ul>
                          )}
                        </div>
                      </div>
                    </FilterSection>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== PRODUCTS AREA ===== */}
            <div className="xl:col-span-9 lg:col-span-8 col-span-12 row-start-1 lg:row-start-auto">
              {/* Top Bar */}
              <div
                className="flex items-center justify-between pb-12 wow animate__animated animate__fadeInUp"
                data-wow-delay=".2s"
              >
                <div className="flex items-center gap-x-4 shrink-0 justify-start">
                  <div className="lg:flex hidden">
                    <p className="text-light-secondary-text">
                      Showing{" "}
                      {Math.min(
                        (currentPage - 1) * PRODUCTS_PER_PAGE + 1,
                        filteredProducts.length,
                      )}
                      –
                      {Math.min(
                        currentPage * PRODUCTS_PER_PAGE,
                        filteredProducts.length,
                      )}{" "}
                      of {filteredProducts.length} results
                    </p>
                  </div>
                </div>

                {/* Active Filters badges */}
                <div className="flex items-center gap-x-2 flex-wrap gap-y-2 flex-1 px-4">
                  {selectedCategories.map((slug) => {
                    const cat = allCategories.find((c) => c.slug === slug);
                    return cat ? (
                      <span
                        key={slug}
                        className="inline-flex items-center gap-x-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                      >
                        {cat.name}
                        <button onClick={() => toggleCategoryFilter(slug)}>
                          <i className="hgi hgi-stroke hgi-cancel-01 text-xs"></i>
                        </button>
                      </span>
                    ) : null;
                  })}
                  {selectedBrands.map((id) => {
                    const brand = allBrands.find((b) => b._id === id);
                    return brand ? (
                      <span
                        key={id}
                        className="inline-flex items-center gap-x-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                      >
                        {brand.brand_name}
                        <button onClick={() => toggleBrandFilter(id)}>
                          <i className="hgi hgi-stroke hgi-cancel-01 text-xs"></i>
                        </button>
                      </span>
                    ) : null;
                  })}
                  {selectedRating !== null && (
                    <span className="inline-flex items-center gap-x-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                      {selectedRating}★+
                      <button onClick={() => setSelectedRating(null)}>
                        <i className="hgi hgi-stroke hgi-cancel-01 text-xs"></i>
                      </button>
                    </span>
                  )}
                </div>

                {/* Sort */}
                <div className="relative min-w-[100px]">
                  <select
                    id="sorting"
                    className="filter-select label"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="sorting" className="nice-select-label">
                    Sorting
                  </label>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-12 gap-6 pb-12">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))
                ) : paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product, index) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      delay={delays[index % 3]}
                    />
                  ))
                ) : (
                  <div className="col-span-12 text-center py-16">
                    <p className="text-light-secondary-text text-lg">
                      No products match your filters.
                    </p>
                    <button
                      onClick={clearAllFilters}
                      className="mt-4 btn btn-primary rounded-full px-6 py-2"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div
                  className="grid grid-cols-12 wow animate__animated animate__fadeInUp"
                  data-wow-delay=".2s"
                >
                  <div className="col-span-12">
                    <ul className="flex items-center justify-center gap-x-1.5 blog-pagination">
                      {/* Prev */}
                      <li className="group blog-pagination-item">
                        <button
                          onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                          }
                          disabled={currentPage === 1}
                          className="inline-flex items-center justify-center md:size-10 size-9 rounded-[50px] bg-white cursor-pointer border border-gray-300 group-hover:border-primary group-hover:bg-[rgba(0,171,85,0.08)] transition-colors duration-300 ease-in-out disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <i className="hgi hgi-stroke hgi-arrow-left-01 text-[20px] leading-5 text-light-primary-text group-hover:text-primary"></i>
                        </button>
                      </li>

                      {/* Pages */}
                      {getPageNumbers().map((page, idx, arr) => (
                        <React.Fragment key={page}>
                          {idx > 0 && arr[idx - 1] !== page - 1 && (
                            <li>
                              <span className="inline-flex items-center justify-center md:size-10 size-9">
                                ...
                              </span>
                            </li>
                          )}
                          <li className="group blog-pagination-item">
                            <button
                              onClick={() => setCurrentPage(page)}
                              className={`inline-flex items-center justify-center md:size-10 size-9 rounded-[50px] ${
                                currentPage === page
                                  ? "active"
                                  : "text-base leading-6 text-light-primary-text group-hover:text-primary group-hover:font-semibold bg-white cursor-pointer border border-gray-300 group-hover:border-primary group-hover:bg-[rgba(0,171,85,0.08)] transition-colors duration-300 ease-in-out"
                              }`}
                            >
                              {page}
                            </button>
                          </li>
                        </React.Fragment>
                      ))}

                      {/* Next */}
                      <li className="group blog-pagination-item">
                        <button
                          onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                          }
                          disabled={currentPage === totalPages}
                          className="inline-flex items-center justify-center md:size-10 size-9 rounded-[50px] bg-white cursor-pointer border border-gray-300 group-hover:border-primary group-hover:bg-[rgba(0,171,85,0.08)] transition-colors duration-300 ease-in-out disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <i className="hgi hgi-stroke hgi-arrow-right-01 text-[20px] leading-5 text-light-primary-text group-hover:text-primary"></i>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Subscribe />
    </>
  );
};

export default Shop;
