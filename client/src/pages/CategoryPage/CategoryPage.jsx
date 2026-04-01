import React, { useEffect, useState } from "react";
import Subscribe from "../../components/Subscribe/Subscribe";
import { useParams } from "react-router-dom";
import axios from "axios";

const paginationPages = [1, 2, 3, 4, 5];

// ===================== PRODUCT CARD =====================

const ProductCard = ({ product }) => (
  <div className="2xl:col-span-3 xl:col-span-4 lg:col-span-4 md:col-span-6 col-span-12">
    <div
      className="border border-gray-300 rounded-2xl product-card-1 p-4 group wow animate__animated animate__fadeInUp"
      data-wow-delay={product.delay}
    >
      <div className="product-image-container relative">
        <div className="product-image h-[358px] rounded-xl mb-4 bg-[#F4F5F6] overflow-hidden">
          <a href={`/product-detail/${product.slug}`}>
            <img
              src={product.ProductMainImage?.url}
              alt={product.product_name}
              className="group-hover:scale-110 transition-all transform group-hover:-rotate-3 ease-in-out h-full w-full duration-300 object-cover"
            />
          </a>
        </div>
      </div>

      <div className="product-content">
        <h5 className="text-base leading-6 font-semibold font-dm-sans mb-4">
          <a href={`/product-detail/${product.slug}`}>{product.product_name}</a>
        </h5>
        <div className="rating-section flex items-center mb-4">
          <div className="bg-[url('../images/star-icon.png')] w-[90px] h-4.5 bg-repeat-x overflow-hidden bg-position-[0_0]">
            <div
              style={{ width: `${product.rating}%` }}
              className="bg-[url('../images/star-icon.png')] h-4.5 bg-repeat-x bg-position-[0_-18px]"
            ></div>
          </div>
          {/* <span className="text-sm leading-[22px] font-normal inline-block ml-1">
            ({product.reviews})
          </span> */}
        </div>
        <div className="price-section flex items-center gap-x-3 mb-2">
          <span className="current-price text-base font-semibold text-light-primary-text">
            ₹{product.afterDiscountPrice}
          </span>
          <span className="old-price text-sm leading-[22px] font-normal text-light-disabled-text line-through">
            ₹{product.price}
          </span>
          <span className="discount-percentage text-sm leading-[22px] font-semibold text-error">
            {product.discount}%
          </span>
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
            href={`/product-detail/${product?.slug}`}
          >
            <i className="hgi hgi-stroke hgi-shopping-cart-02 text-xl text-white"></i>
            <span>View Product</span>
          </a>
        </div>
      </div>
    </div>
  </div>
);

// ===================== MAIN COMPONENT =====================

const CategoryPage = () => {
  const [allProducts, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 8;
  const { slug } = useParams();
  // console.log("slug", slug);
  const handleFetchProducts = async (page = 1) => {
    try {
      const { data } = await axios.get(
        `https://api.hargunmusicals.com/api/v1/get-product-by-category-slug/${slug}?page=${page}&limit=${limit}`,
      );

      setProducts(data.products);
      setPagination(data.pagination);
      setCurrentPage(page);
    } catch (error) {
      console.log("Internal server error", error);
    }
  };

  const capitalizeFirstLetter = (str) => {
    if (!str) return ""; // Handle empty strings
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
  };

  useEffect(() => {
    handleFetchProducts(1);
  }, [slug]);
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
              <span className="text-sm leading-[22px]">
                {capitalizeFirstLetter(slug)}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Products Section */}
      <div className="pb-[70px]">
        <div className="container">
          {/* Products Grid */}
          <div className="grid grid-cols-12 gap-6 pb-12">
            {allProducts &&
              allProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>

          {/* Pagination */}
          <div
            className="flex items-center justify-center md:justify-between wow animate__animated animate__fadeInUp"
            data-wow-delay=".2s"
          >
            <p>
              Showing {(currentPage - 1) * limit + 1} -
              {Math.min(currentPage * limit, pagination.totalItems || 0)} of{" "}
              {pagination.totalItems || 0} results
            </p>
            <div className="grid grid-cols-12">
              <div className="col-span-12">
                <ul className="flex items-center justify-center gap-x-1.5 blog-pagination">
                  {/* Prev Button */}
                  <li>
                    <button
                      disabled={currentPage === 1}
                      onClick={() => handleFetchProducts(currentPage - 1)}
                      className="pagination-btn"
                    >
                      ⬅
                    </button>
                  </li>

                  {/* Page Numbers */}
                  {[...Array(pagination.totalPages || 0)].map((_, i) => {
                    const page = i + 1;
                    return (
                      <li key={page}>
                        <button
                          onClick={() => handleFetchProducts(page)}
                          className={`pagination-btn ${
                            currentPage === page ? "active" : ""
                          }`}
                        >
                          {page}
                        </button>
                      </li>
                    );
                  })}

                  {/* Next Button */}
                  <li>
                    <button
                      disabled={currentPage === pagination.totalPages}
                      onClick={() => handleFetchProducts(currentPage + 1)}
                      className="pagination-btn"
                    >
                      ➡
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscribe */}
      <Subscribe />
    </>
  );
};

export default CategoryPage;
