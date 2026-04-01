import { useEffect, useState } from "react";
import axios from "axios";

// ===================== HELPERS =====================

const formatPrice = (price) => {
  if (price == null) return "";
  return `₹${Number(price).toFixed(2)}`;
};

const calcRatingPercent = (reviews = []) => {
  if (!reviews.length) return 0;
  const avg =
    reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
  return Math.round((avg / 5) * 100);
};

// ===================== PRODUCT CARD =====================

const ProductCard = ({ product, index }) => {
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
      data-wow-delay={`.${2 + (index % 6)}s`}
      className="mx-3 wow animate__animated animate__fadeInUp"
    >
      <div className="border border-gray-300 rounded-2xl product-card-1 p-4 group">
        <div className="product-image-container relative">
          <div className="product-image rounded-xl mb-4 overflow-hidden h-[358px]">
            <a href={`/product-detail/${product.slug}`}>
              <img
                src={productImg}
                alt={product.product_name}
                className="group-hover:scale-110 transition-all transform group-hover:-rotate-3 ease-in-out duration-300 bg-white h-full w-full object-cover"
              />
            </a>
          </div>
          {product.tag && (
            <span className="product-discount-badge absolute top-0 left-0 bg-error text-white font-normal uppercase text-xs leading-[18px] rounded-md py-px px-2">
              {product.tag}
            </span>
          )}
        </div>

        <div className="flex flex-col flex-wrap gap-y-3 product-content">
          <div className="rating-section flex items-center">
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
          <a
            className="font-semibold text-light-primary-text group-hover:text-primary transition-all duration-300 ease-in-out cursor-pointer"
            href={`/product-detail/${product.slug}`}
          >
            {product.product_name}
          </a>
          <div className="price-section flex items-center gap-x-3">
            <span className="current-price font-semibold text-primary">
              {currentPrice}
            </span>
            {oldPrice && (
              <span className="old-price font-normal text-light-disabled-text line-through">
                {oldPrice}
              </span>
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

// ===================== SKELETON LOADER =====================

const SkeletonCard = () => (
  <div className="mx-3 animate-pulse">
    <div className="border border-gray-200 rounded-2xl p-4">
      <div className="h-[220px] bg-gray-200 rounded-xl mb-4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
      <div className="h-10 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);

// ===================== MAIN COMPONENT =====================

const ProductWithCategory = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null); // slug store hoga
  const [allProducts, setAllProducts] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Categories fetch
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          "https://api.hargunmusicals.com/api/v1/admin/category",
        );
        const cats = data.categories || [];
        setAllCategories(cats);
        // Pehli category ko default active set karo
        if (cats.length > 0) {
          setActiveCategory(cats[0].slug);
        }
      } catch (error) {
        console.error("Categories fetch error:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Products fetch - activeCategory change hone pe
  useEffect(() => {
    if (!activeCategory) return;

    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const { data } = await axios.get(
          `https://api.hargunmusicals.com/api/v1/get-product-by-category-slug/${activeCategory}`,
        );
        setAllProducts(data.products || []);
      } catch (error) {
        console.error("Products fetch error:", error);
        setAllProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  return (
    <section className="pb-[70px]">
      <div className="container">
        {/* Header + Category Tabs */}
        <div className="mb-10 text-center flex flex-col gap-y-6 xl:flex-row items-center justify-between border-b border-gray-300">
          <h3
            data-wow-delay=".2s"
            className="text-light-primary-text wow animate__animated animate__fadeInUp"
          >
            Product By Categories
          </h3>

          <div
            data-wow-delay=".2s"
            className="flex items-center justify-center gap-x-4 wow animate__animated animate__fadeInUp"
          >
            <div className="flex gap-x-8 overflow-x-auto home-four-product-filter">
              {loadingCategories
                ? // Category tabs skeleton
                  Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-9 mt-3"
                    ></div>
                  ))
                : allCategories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => setActiveCategory(cat.slug)}
                      className={`pt-[13px] pb-9 text-sm leading-[22px] font-medium transition-colors duration-200 ${
                        activeCategory === cat.slug
                          ? "text-primary border-b-2 border-primary"
                          : "text-light-secondary-text hover:text-primary"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="tab-content" id="deal-tab-content">
          <div className="grid 2xl:grid-cols-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-y-6">
            {loadingProducts ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            ) : allProducts.length > 0 ? (
              allProducts
                .slice(0, 8)
                .map((product, index) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    index={index}
                  />
                ))
            ) : (
              <p className="col-span-full text-center text-light-secondary-text py-10">
                No products found in this category.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductWithCategory;
