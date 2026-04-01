import React, { useState, useEffect, useRef } from "react";
import Subscribe from "../../components/Subscribe/Subscribe";
import { useParams } from "react-router-dom";
import axios from "axios";

// ===================== STATIC FALLBACK DATA =====================

const ctaInfoCards = [
  {
    icon: "hgi-container-truck",
    title: "Free Shipping",
    desc: "Enjoy the Convenience of Free Shipping on Every Order",
    delay: ".2s",
  },
  {
    icon: "hgi-customer-support",
    title: "24x7 Support",
    desc: "Round-the-Clock Assistance, Anytime You Need It",
    delay: ".3s",
  },
  {
    icon: "hgi-delivery-return-02",
    title: "30 Days Return",
    desc: "Your Satisfaction is Our Priority: Return Any Product Within 30 Days",
    delay: ".4s",
  },
  {
    icon: "hgi-transaction",
    title: "Secure Payment",
    desc: "Seamless Shopping Backed by Safe and Secure Payment Options",
    delay: ".5s",
  },
];

const sizeVariations = ["3/4", "4/4", "Left-Hand", "Relic", "Custom"];

const colorVariations = [
  {
    text: "Sunburst",
    color: "#8B4513",
    image: "assets/images/product-details/color-selector-1.png",
  },
  {
    text: "Olympic White",
    color: "#F5F5DC",
    image: "assets/images/product-details/color-selector-2.png",
  },
  {
    text: "Lake Placid Blue",
    color: "#1E90FF",
    image: "assets/images/product-details/color-selector-3.png",
  },
  {
    text: "Candy Apple Red",
    color: "#CB0233",
    image: "assets/images/product-details/color-selector-4.png",
  },
];

const reviewSortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "popular", label: "Popular" },
  { value: "rating", label: "Rating" },
  { value: "relevance", label: "Relevance" },
  { value: "comment-count", label: "Comment Count" },
];

const paginationPages = [1, 2, 3, 4, 5];

const TABS = [
  { key: "description", label: "Description" },
  { key: "additional-info", label: "Additional Info" },
  // { key: 'reviews', label: 'Reviews' },
];

// ===================== HELPERS =====================

const extractImages = (product) => {
  const imageKeys = [
    "ProductMainImage",
    "SecondImage",
    "ThirdImage",
    "FourthImage",
    "FifthImage",
    "SixthImage",
  ];
  const imgs = [];
  imageKeys.forEach((key) => {
    if (product[key]?.url) imgs.push(product[key].url);
  });
  return imgs.length > 0
    ? imgs
    : ["assets/images/product-details/product-details-slider-1.png"];
};

const formatPrice = (price) => {
  if (price == null) return "";
  return `${Number(price).toFixed(2)}`;
};

const calcRatingPercent = (reviews = []) => {
  if (!reviews.length) return 0;
  const avg =
    reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
  return Math.round((avg / 5) * 100);
};

const calcRatingBreakdown = (reviews = []) => {
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.round(r.rating || 0);
    if (counts[star] !== undefined) counts[star]++;
  });
  const max = Math.max(...Object.values(counts), 1);
  return [5, 4, 3, 2, 1].map((star) => ({
    label: `${star} Star`,
    count: String(counts[star]),
    width: `${Math.round((counts[star] / max) * 100)}%`,
  }));
};

// ===================== CART / ORDER HELPER =====================
/**
 * Order model ke items[] structure ke anusaar localStorage mein cart data save karta hai.
 *
 * localStorage key: "cart"
 * Structure:
 * {
 *   items: [
 *     {
 *       productId   : string   — product._id (Order model: ref "Product")
 *       name        : string   — product.product_name
 *       price       : number   — effective price (variant ya base, after discount)
 *       quantity    : number   — user-selected qty
 *       size        : string   — variant name (e.g. "Red") ya "default" if no variant
 *       color       : string   — "" (extend karo agar color support aaye)
 *       Varient_id  : string   — selected variant._id, ya product._id if no variant
 *       image       : string   — main image URL (UI ke liye, order model mein nahi)
 *       slug        : string   — product slug (navigation ke liye)
 *     }
 *   ],
 *   totalAmount   : number  — price × qty (without shipping)
 *   payAmt        : number  — same as totalAmount; checkout pe shipping add hogi
 *   totalquantity : number
 *   source        : "buy_now"  — checkout page yeh check karke directly order flow chalaye
 * }
 */
const saveToCart = ({ productData, selectedVariant, quantity }) => {
  const itemPrice = selectedVariant
    ? Number(selectedVariant.price_after_discount ?? selectedVariant.price)
    : Number(productData.afterDiscountPrice ?? productData.price);

  const variantId = selectedVariant ? selectedVariant._id : productData._id;

  const newItem = {
    productId: productData._id,
    name: productData.product_name,
    price: itemPrice,
    quantity: quantity,
    size: selectedVariant ? selectedVariant.quantity : "default",
    color: "",
    Varient_id: variantId,
    image: productData.ProductMainImage?.url || "",
    slug: productData.slug,
    discount: selectedVariant
      ? selectedVariant.discount_percentage
      : productData.discount || 0,
  };

  let existingCart = JSON.parse(localStorage.getItem("cart")) || {
    items: [],
    totalAmount: 0,
    payAmt: 0,
    totalquantity: 0,
    source: "cart",
  };

  let items = [...existingCart.items];

  const existingIndex = items.findIndex(
    (item) =>
      item.productId === newItem.productId &&
      item.Varient_id === newItem.Varient_id,
  );

  if (existingIndex > -1) {
    items[existingIndex].quantity += quantity;
  } else {
    items.push(newItem);
  }

  let totalAmount = 0;
  let totalquantity = 0;

  items.forEach((item) => {
    totalAmount += item.price * item.quantity;
    totalquantity += item.quantity;
  });

  // ✅ VAT + Grand Total calculation (NEW)
  const VAT_RATE = 0.18;
  const vat = parseFloat((totalAmount * VAT_RATE).toFixed(2));
  const grandTotal = parseFloat((totalAmount + vat).toFixed(2));

  const updatedCart = {
    items,
    totalAmount,
    payAmt: totalAmount,
    totalquantity,
    source: "cart",
    afterVatTotalPrice: grandTotal, // ✅ NEW FIELD ADDED
  };

  localStorage.setItem("cart", JSON.stringify(updatedCart));

  return updatedCart;
};

// ===================== SMALL COMPONENTS =====================

const StarRating = ({ width }) => (
  <div className="bg-[url('../images/star-icon.png')] w-[90px] h-4.5 bg-repeat-x overflow-hidden bg-position-[0_0]">
    <div
      style={{ width }}
      className="bg-[url('../images/star-icon.png')] h-4.5 bg-repeat-x bg-position-[0_-18px]"
    ></div>
  </div>
);

const VerifiedBadge = () => (
  <div className="flex items-center gap-x-1 pl-3">
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.5269 3.13379L13.9331 3.67969L13.7065 6.13965L15.3335 8L13.7065 9.86035L13.9331 12.3203L11.5269 12.8662L10.2661 14.9932L7.99951 14.0195L5.73291 15L4.47314 12.873L2.06689 12.3271L2.29346 9.86035L0.666504 8L2.29346 6.13379L2.06689 3.66699L4.47314 3.12695L5.73291 1L7.99951 1.97363L10.2661 1L11.5269 3.13379ZM6.72607 9.17285L5.18018 7.62012L4.19287 8.60645L6.72607 11.1465L11.6128 6.24707L10.6265 5.25977L6.72607 9.17285Z"
        fill="#088178"
      />
    </svg>
    <p className="text-primary text-sm leading-[22px]">Verified purchase</p>
  </div>
);

const Pagination = ({ type = "comment" }) => (
  <ul
    className={`flex items-center justify-center gap-x-1.5 ${type}-pagination`}
  >
    <li className="group">
      <a
        href="#"
        className="inline-flex items-center justify-center md:size-10 size-9 rounded-[50px] bg-white cursor-pointer border border-gray-300 group-hover:border-primary group-hover:bg-[rgba(0,171,85,0.08)] transition-colors duration-300"
      >
        <span className="inline-flex items-center justify-center">
          <i className="hgi hgi-stroke hgi-arrow-left-01 text-[20px] leading-5 text-light-primary-text group-hover:text-primary"></i>
        </span>
      </a>
    </li>
    {paginationPages.map((page) => (
      <li key={page} className="group">
        <a
          href="#"
          className={`inline-flex items-center justify-center md:size-10 size-9 rounded-[50px] ${page === 1 ? "active" : "text-base leading-6 text-light-primary-text group-hover:text-primary group-hover:font-semibold bg-white cursor-pointer border border-gray-300 group-hover:border-primary group-hover:bg-[rgba(0,171,85,0.08)] transition-colors duration-300"}`}
        >
          {page}
        </a>
      </li>
    ))}
    <li>
      <a
        href="#"
        className="inline-flex items-center justify-center md:size-10 size-9 rounded-[50px] bg-white"
      >
        <span className="inline-flex items-center justify-center">
          <i className="hgi hgi-stroke hgi-more-horizontal text-[20px] leading-5 text-light-primary-text"></i>
        </span>
      </a>
    </li>
    <li className="group">
      <a
        href="#"
        className="inline-flex items-center justify-center md:size-10 size-9 rounded-[50px] bg-white cursor-pointer border border-gray-300 group-hover:border-primary group-hover:bg-[rgba(0,171,85,0.08)] transition-colors duration-300"
      >
        <span className="inline-flex items-center justify-center">
          <i className="hgi hgi-stroke hgi-arrow-right-01 text-[20px] leading-5 text-light-primary-text group-hover:text-primary"></i>
        </span>
      </a>
    </li>
  </ul>
);

// ===================== IMAGE GALLERY =====================

const ImageGallery = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const prev = () =>
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () =>
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="flex gap-x-6 xl:flex-row flex-col gap-y-6 xl:gap-y-0 xl:gap-x-6">
      <div className="xl:w-[114px] lg:w-full order-2 xl:order-1 flex-none">
        <div className="xl:flex xl:flex-col flex flex-row gap-2 xl:max-h-[520px] xl:overflow-y-auto overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`rounded-xl overflow-hidden flex-none border-2 transition-all duration-200 p-1 ${activeIndex === i ? "border-primary" : "border-transparent hover:border-gray-300"}`}
              style={{ minWidth: "60px" }}
            >
              <img
                src={img}
                alt={`thumb-${i + 1}`}
                className="object-cover rounded-lg xl:w-[90px] xl:h-[78px] w-[58px] h-[52px]"
              />
            </button>
          ))}
        </div>
      </div>
      <div className="w-full xl:flex-1 order-1 xl:order-2 relative rounded-2xl bg-[#F4F3F5] overflow-hidden">
        <div className="relative">
          <img
            key={activeIndex}
            src={images[activeIndex]}
            alt={`product-slide-${activeIndex + 1}`}
            className="w-full h-full object-cover rounded-3xl transition-opacity duration-300"
          />
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 size-9 bg-white/90 rounded-full shadow-md flex items-center justify-center hover:bg-white transition-all"
          >
            <i className="hgi hgi-stroke hgi-arrow-left-01 text-lg text-light-primary-text"></i>
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 size-9 bg-white/90 rounded-full shadow-md flex items-center justify-center hover:bg-white transition-all"
          >
            <i className="hgi hgi-stroke hgi-arrow-right-01 text-lg text-light-primary-text"></i>
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-x-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`rounded-full transition-all duration-300 ${activeIndex === i ? "w-5 h-2 bg-primary" : "w-2 h-2 bg-white/70 hover:bg-white"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ===================== TAB CONTENTS =====================

const DescriptionTab = ({ product }) => {
  const paragraphs = (
    product.extra_description ||
    product.product_description ||
    ""
  )
    .split(/\n\n+/)
    .filter(Boolean);
  return (
    <>
      <h5 className="product-details-tab-title">Description</h5>
      <div className="product-details-tab-content">
        {paragraphs.length > 0 ? (
          paragraphs.map((para, i) => (
            <p key={i} className="mb-6">
              {para.trim()}
            </p>
          ))
        ) : (
          <p className="mb-6">{product.product_description}</p>
        )}
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-18 items-center">
          <div className="lg:col-span-7">
            <h4 className="mb-6">Easy to Customize</h4>
            <p className="mb-6">
              This product is designed to grow with the player. Its versatile
              configuration and compatible hardware make it one of the easiest
              instruments to personalize.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

const AdditionalInfoTab = ({ product }) => {
  const rows = [
    { label: "Product Name", value: product.product_name },
    { label: "Brand", value: product.brand?.name || "—" },
    { label: "Category", value: product.category?.name || "—" },
    { label: "Sub Category", value: product.sub_category?.name || "—" },
    { label: "SKU", value: product._id },
    {
      label: "Stock",
      value: product.stock != null ? `${product.stock} units` : "—",
    },
    { label: "Price", value: formatPrice(product.price) },
    {
      label: "Discount",
      value: product.discount ? `${product.discount}%` : "—",
    },
    {
      label: "After Discount Price",
      value: formatPrice(product.afterDiscountPrice),
    },
    { label: "Has Variants", value: product.isVarient ? "Yes" : "No" },
  ].filter(
    (row) => row.value && row.value !== "—" && row.value !== "undefined",
  );

  return (
    <>
      <h5 className="product-details-tab-title">Additional Info</h5>
      <div className="product-details-tab-content">
        <table className="w-full border-collapse">
          <tbody className="divide-y divide-gray-300">
            {rows.map((row, i) => (
              <tr key={i}>
                <th className="font-semibold w-[180px] text-left py-3 text-light-primary-text">
                  {row.label}
                </th>
                <td>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const ReviewsTab = ({ reviews = [] }) => {
  const ratingBreakdown = calcRatingBreakdown(reviews);
  const avgRating = reviews.length
    ? (
        reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length
      ).toFixed(1)
    : "0";
  const ratingPercent = calcRatingPercent(reviews);

  return (
    <>
      <h5 className="product-details-tab-title">Reviews</h5>
      <div className="product-details-tab-content p-0!">
        <div className="grid grid-cols-12 md:divide-x divide-y md:divide-y-0 divide-gray-300 rating-overview">
          <div className="md:col-span-4 col-span-12 flex items-center justify-center py-6 md:py-0">
            <div className="rating-heading space-y-2 text-center">
              <p className="font-semibold text-light-primary-text">
                Average Rating
              </p>
              <h2 className="text-error">{avgRating}/5</h2>
              <div className="flex items-center justify-center">
                <StarRating width={`${ratingPercent}%`} />
              </div>
              <p>({reviews.length} reviews)</p>
            </div>
          </div>
          <div className="md:col-span-4 col-span-12 p-6 flex items-center justify-center">
            <div className="list-rating space-y-6 w-full">
              {ratingBreakdown.map((r, i) => (
                <div key={i} className="flex gap-x-4 items-center">
                  <span className="font-semibold text-light-primary-text whitespace-nowrap">
                    {r.label}
                  </span>
                  <div className="progress w-full flex-1 h-1.5 bg-[rgba(145,158,171,0.24)] rounded-[50px] overflow-hidden">
                    <div
                      style={{ width: r.width }}
                      className="progress-bar h-full bg-primary rounded-[50px]"
                    ></div>
                  </div>
                  <span className="whitespace-nowrap">{r.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-4 col-span-12 flex items-center justify-center py-6 md:py-0">
            <a
              href="#comment-forms"
              className="btn btn-primary outline btn-large rounded-[100px]"
            >
              Write a Review
            </a>
          </div>
        </div>

        <div
          id="comment-forms"
          className="comment-form-wrapper p-6 border-t border-gray-300 border-b"
        >
          <div className="comment-respond md:border md:border-gray-300 md:rounded-3xl md:p-6">
            <h5 className="mb-6">Add Comment</h5>
            <div className="flex items-center gap-x-3 mb-6">
              <p className="text-light-primary-text font-medium">
                Your review about this product:
              </p>
              <StarRating width="0%" />
            </div>
            <div className="comment-forms flex flex-col gap-y-6">
              <div className="input-group medium rounded-[20px] px-3.5 resize-none">
                <textarea
                  id="post_comment"
                  rows="4"
                  className="peer form-control placeholder-transparent focus:placeholder-transparent"
                  placeholder="Comment *"
                ></textarea>
                <label
                  htmlFor="post_comment"
                  className="absolute left-[14px] top-1/2 -translate-y-1/2 text-xs leading-[18px] transition-all peer-placeholder-shown:text-light-disabled-text peer-focus:text-light-disabled-text peer-placeholder-shown:text-[16px] peer-placeholder-shown:top-6 peer-focus:text-[12px] peer-focus:top-0 peer-[:not(:placeholder-shown)]:text-[12px] peer-[:not(:placeholder-shown)]:top-0 bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:px-1"
                >
                  Comment *
                </label>
              </div>
              <div className="relative w-full">
                <input
                  type="text"
                  id="rev-name"
                  className="peer form-control input-group medium rounded-[80px] px-3.5 placeholder-transparent focus:placeholder-transparent focus:outline-none"
                  placeholder="Name *"
                />
                <label
                  htmlFor="rev-name"
                  className="absolute left-[14px] top-1/2 -translate-y-1/2 text-xs leading-[18px] transition-all peer-placeholder-shown:text-light-disabled-text peer-focus:text-light-disabled-text peer-placeholder-shown:text-[16px] peer-placeholder-shown:top-1/2 peer-focus:text-[12px] peer-focus:top-0 peer-[:not(:placeholder-shown)]:text-[12px] peer-[:not(:placeholder-shown)]:top-0 bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:px-1"
                >
                  Name *
                </label>
              </div>
              <div className="relative w-full">
                <input
                  type="email"
                  id="rev-email"
                  className="peer form-control input-group medium rounded-[80px] px-3.5 placeholder-transparent focus:placeholder-transparent focus:outline-none"
                  placeholder="Email *"
                />
                <label
                  htmlFor="rev-email"
                  className="absolute left-[14px] top-1/2 -translate-y-1/2 text-xs leading-[18px] transition-all peer-placeholder-shown:text-light-disabled-text peer-focus:text-light-disabled-text peer-placeholder-shown:text-[16px] peer-placeholder-shown:top-1/2 peer-focus:text-[12px] peer-focus:top-0 peer-[:not(:placeholder-shown)]:text-[12px] peer-[:not(:placeholder-shown)]:top-0 bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:px-1"
                >
                  Email *
                </label>
              </div>
              <div className="flex md:justify-end justify-start gap-x-4">
                <button className="btn btn-default outline btn-large rounded-[100px] w-[47%] md:w-auto py-[11px] shadow-none">
                  Cancel
                </button>
                <button className="btn btn-primary btn-large rounded-[100px] w-[47%] md:w-auto py-[11px]">
                  Post Review
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="comment-list-wrapper p-6">
          <div className="comment-list-title flex items-center justify-between pb-6 border-b border-gray-300 mb-6">
            <h5>Customer Ratings &amp; Review</h5>
            <div className="relative min-w-[100px]">
              <select
                id="review-sorting"
                className="rounded-[100px]! filter-select label"
              >
                {reviewSortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <label htmlFor="review-sorting" className="nice-select-label">
                Sorting
              </label>
            </div>
          </div>

          {reviews.length === 0 ? (
            <p className="text-center text-light-disabled-text py-8">
              No reviews yet. Be the first to review!
            </p>
          ) : (
            <ol className="comment-list">
              {reviews.map((review) => (
                <li key={review._id || review.id} className="comment">
                  <div className="comment-body">
                    <div className="comment-avatar-card flex items-center gap-x-4 mb-3">
                      <div className="comment-author-avatar size-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {review.user?.avatar?.url ? (
                          <img
                            src={review.user.avatar.url}
                            alt="avatar"
                            className="rounded-full w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-semibold text-light-primary-text">
                            {(review.user?.name ||
                              review.author ||
                              "U")[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="comment-author-info flex-1">
                        <p className="comment-author font-semibold text-light-primary-text">
                          {review.user?.name || review.author || "Anonymous"}
                        </p>
                        {review.createdAt && (
                          <p className="text-xs text-light-disabled-text">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center mb-3">
                      <div className="rating-section flex items-center relative after:absolute after:h-[22px] after:w-px after:right-0 after:top-1/2 after:-translate-y-1/2 after:bg-gray-300 pr-3">
                        <StarRating
                          width={`${Math.round(((review.rating || 0) / 5) * 100)}%`}
                        />
                        <span className="text-sm leading-[22px] font-normal inline-flex ml-2 text-light-primary-text">
                          {review.rating || 0}
                        </span>
                      </div>
                      {review.verified && <VerifiedBadge />}
                    </div>
                    <div className="comment-content pl-0! pr-0! mb-3">
                      <p className="text-light-primary-text">
                        {review.comment || review.text}
                      </p>
                    </div>
                    <div className="comment-actions flex md:items-center md:flex-row flex-col gap-y-3 md:gap-y-0">
                      <p className="text-sm leading-[22px] md:pr-3">
                        was this review helpful to you?
                      </p>
                      <a
                        href="#"
                        className="comment-action-item text-sm leading-[22px] inline-flex items-center gap-x-1 md:pr-3 relative md:after:absolute md:after:h-5 md:after:w-px md:after:right-0 md:after:top-1/2 md:after:-translate-y-1/2 md:after:bg-gray-300"
                      >
                        <i className="hgi hgi-stroke hgi-thumbs-up text-lg leading-[18px] text-light-primary-text"></i>
                        Thank ({review.thanks || 0})
                      </a>
                      <a
                        href="#"
                        className="comment-action-item text-sm leading-[22px] inline-flex items-center gap-x-1 md:pl-3"
                      >
                        <i className="hgi hgi-stroke hgi-thumbs-down text-lg leading-[18px] text-light-primary-text"></i>
                        Dislike ({review.dislikes || 0})
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
          <div className="comment-pagination-wrapper mt-6">
            <Pagination type="comment" />
          </div>
        </div>
      </div>
    </>
  );
};

// ===================== RELATED PRODUCTS SLIDER =====================

const RelatedSlider = ({ products = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(4);
  const lockRef = useRef(false);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 480) setSlidesPerView(1);
      else if (w < 769) setSlidesPerView(2);
      else if (w < 1025) setSlidesPerView(3);
      else if (w < 1441) setSlidesPerView(4);
      else setSlidesPerView(5);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, products.length - slidesPerView);
  const go = (idx) => {
    if (lockRef.current) return;
    lockRef.current = true;
    setCurrentIndex(Math.max(0, Math.min(idx, maxIndex)));
    setTimeout(() => {
      lockRef.current = false;
    }, 400);
  };
  const slideW = 100 / slidesPerView;
  if (products.length === 0) return null;

  return (
    <>
      <div className="flex items-center justify-between mb-12">
        <h3
          className="wow animate__animated animate__fadeInUp"
          data-wow-delay="0.2s"
        >
          Related Products
        </h3>
        <div className="flex items-center gap-x-3">
          <button
            onClick={() => go(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="size-10 rounded-full border border-gray-300 inline-flex items-center justify-center hover:border-primary hover:bg-[rgba(0,171,85,0.08)] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <i className="hgi hgi-stroke hgi-arrow-left-01 text-lg text-light-primary-text"></i>
          </button>
          <button
            onClick={() => go(currentIndex + 1)}
            disabled={currentIndex >= maxIndex}
            className="size-10 rounded-full border border-gray-300 inline-flex items-center justify-center hover:border-primary hover:bg-[rgba(0,171,85,0.08)] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <i className="hgi hgi-stroke hgi-arrow-right-01 text-lg text-light-primary-text"></i>
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex"
          style={{
            transform: `translateX(-${currentIndex * slideW}%)`,
            transition: "transform 0.4s ease-in-out",
          }}
        >
          {products.map((p) => {
            const productImg =
              p.ProductMainImage?.url || "assets/images/vitamin-c.png";
            const ratingPct = calcRatingPercent(p.reviews || []);
            const reviewCount = (p.reviews || []).length;
            return (
              <div
                key={p._id || p.id}
                style={{ minWidth: `${slideW}%` }}
                className="px-3"
              >
                <div className="border border-gray-300 rounded-2xl product-card-1 p-4 group">
                  <div className="product-image-container relative">
                    <div className="product-image rounded-xl bg-[#F4F3F5] mb-4 overflow-hidden">
                      <a href={`/product-detail/${p.slug}`}>
                        <img
                          src={productImg}
                          alt={p.product_name}
                          className="w-full h-[358px] group-hover:scale-110 transition-all transform group-hover:-rotate-3 ease-in-out duration-300"
                        />
                      </a>
                    </div>
                  </div>
                  <div className="product-content">
                    <h5 className="text-base leading-6 font-semibold font-dm-sans mb-4 line-clamp-2">
                      <a href={`/product-detail/${p.slug}`}>{p.product_name}</a>
                    </h5>
                    <div className="rating-section flex items-center mb-4">
                      <StarRating width={`${ratingPct}%`} />
                      <span className="text-sm leading-[22px] font-normal inline-block ml-1">
                        ({reviewCount})
                      </span>
                    </div>
                    <div className="price-section flex items-center gap-x-3 mb-2 flex-wrap gap-y-1">
                      <span className="current-price text-base font-semibold text-light-primary-text">
                        {formatPrice(p.afterDiscountPrice || p.price)}
                      </span>
                      {p.discount > 0 && (
                        <>
                          <span className="old-price text-sm leading-[22px] font-normal text-light-disabled-text line-through">
                            {formatPrice(p.price)}
                          </span>
                          <span className="discount-percentage text-sm leading-[22px] font-semibold text-error">
                            {p.discount}% OFF
                          </span>
                        </>
                      )}
                    </div>
                    <div className="btn-section flex items-center gap-x-4">
                      <a
                        className="btn btn-primary rounded-full font-semibold text-sm leading-6 px-6.5 py-2 flex-1"
                        href={`/product-detail/${p.slug}`}
                      >
                        <i className="hgi hgi-stroke hgi-shopping-cart-02 text-xl text-white"></i>
                        <span>View Product</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {maxIndex > 0 && (
        <div className="flex items-center justify-center gap-x-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`rounded-full transition-all duration-300 ${currentIndex === i ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-gray-300 hover:bg-gray-400"}`}
            />
          ))}
        </div>
      )}
    </>
  );
};

// ===================== LOADING SKELETON =====================

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="lg:grid lg:grid-cols-12 lg:gap-12">
      <div className="xl:col-span-7 lg:col-span-6">
        <div className="h-[400px] bg-gray-200 rounded-2xl"></div>
      </div>
      <div className="xl:col-span-5 lg:col-span-6 mt-6 lg:mt-0">
        <div className="rounded-3xl border border-gray-200 p-6 space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

// ===================== MAIN COMPONENT =====================

const ProductDetail = () => {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState("description");
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("3/4");
  const [quantity, setQuantity] = useState(1);
  const [productData, setProductData] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---- Variant state ----
  const [selectedVariant, setSelectedVariant] = useState(null);

  // ---- Buy Now button feedback ----
  const [buyNowDone, setBuyNowDone] = useState(false);

  const handleQtyChange = (delta) =>
    setQuantity((prev) => Math.max(1, prev + delta));

  // Product fetch
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    setSelectedVariant(null);
    setBuyNowDone(false);

    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `https://api.hargunmusicals.com/api/v1/get-product-by-slug/${slug}`,
        );
        setProductData(data.data);
        if (data.data?.isVarient && data.data?.Varient?.length > 0) {
          setSelectedVariant(data.data.Varient[0]);
        }
      } catch (err) {
        console.error("Product fetch error:", err);
        setError("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  // Related products fetch
  useEffect(() => {
    if (!productData?.category?.slug) return;
    const fetchRelated = async () => {
      try {
        const { data } = await axios.get(
          `https://api.hargunmusicals.com/api/v1/get-product-by-category-slug/${productData.category.slug}`,
        );
        const filtered = (data.products || []).filter(
          (p) => p._id !== productData._id,
        );
        setRelatedProducts(filtered);
      } catch (err) {
        console.error("Related products fetch error:", err);
      }
    };
    fetchRelated();
  }, [productData?.category?.slug, productData?._id]);

  // ---- Derived price values ----
  const hasVariants =
    productData?.isVarient && productData?.Varient?.length > 0;

  const displayCurrentPrice = selectedVariant
    ? formatPrice(selectedVariant.price_after_discount ?? selectedVariant.price)
    : formatPrice(productData?.afterDiscountPrice || productData?.price);

  const displayOldPrice =
    selectedVariant && selectedVariant.discount_percentage > 0
      ? formatPrice(selectedVariant.price)
      : !selectedVariant && productData?.discount > 0
        ? formatPrice(productData?.price)
        : null;

  const displayDiscountLabel =
    selectedVariant && selectedVariant.discount_percentage > 0
      ? `${selectedVariant.discount_percentage}% OFF`
      : !selectedVariant && productData?.discount > 0
        ? `${productData.discount}% OFF`
        : null;

  const isOutOfStock = selectedVariant
    ? !selectedVariant.isStock
    : productData?.stock === 0;

  const sliderImages = productData ? extractImages(productData) : [];
  const ratingPercent = productData
    ? calcRatingPercent(productData.reviews || [])
    : 0;
  const reviewCount = productData?.reviews?.length || 0;

  // ===================== BUY NOW HANDLER =====================
  const handleBuyNow = () => {
    if (!productData) return;
    if (hasVariants && !selectedVariant) return; // variant choose nahi kiya
    if (isOutOfStock) return; // stock nahi hai

    // localStorage mein order-ready cart data save karo
    const cartData = saveToCart({ productData, selectedVariant, quantity });
    console.log("✅ Buy Now — cart saved to localStorage:", cartData);

    // Button feedback dikhao phir checkout pe bhejo
    setBuyNowDone(true);
    setTimeout(() => {
      setBuyNowDone(false);
      // ---- Checkout page pe navigate karo ----
      // React Router use kar rahe ho to neeche wali line uncomment karo:
      // navigate('/checkout')
      // Simple redirect:
      window.location.href = "/cart";
    }, 800);
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="py-12">
        <div className="container">
          <div className="breadcrumb">
            <ul>
              <li>
                <a href="/">
                  <span>
                    <i className="hgi hgi-stroke hgi-home-01 text-[20px]"></i>
                  </span>
                  Home
                </a>
              </li>
              <li className="text-light-disabled-text">&#8226;</li>
              {productData?.category?.name && (
                <>
                  <li>
                    <span>{productData.category.name}</span>
                  </li>
                  <li className="text-light-disabled-text">&#8226;</li>
                </>
              )}
              <li>
                <span>{productData?.product_name}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <section>
        <div className="container">
          {loading && <LoadingSkeleton />}
          {error && (
            <div className="text-center py-16 text-error">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && productData && (
            <div className="lg:grid lg:grid-cols-12 lg:gap-12">
              {/* Left: Image Gallery */}
              <div className="xl:col-span-7 lg:col-span-6">
                <ImageGallery images={sliderImages} />
              </div>

              {/* Right: Product Info */}
              <div className="xl:col-span-5 lg:col-span-6 mt-6 lg:mt-0">
                <div className="rounded-3xl border border-gray-300 p-6">
                  {productData.tag && (
                    <span className="product-discount-badge inline-block mb-6 uppercase relative bg-error text-warning-lighter font-medium text-sm leading-[22px] px-1 after:absolute after:top-0 after:left-full after:z-10 after:w-1 after:h-full after:bg-[url('../images/discount-shape.png')] after:bg-contain after:bg-no-repeat">
                      {productData.tag}
                    </span>
                  )}

                  {productData.category?.name && (
                    <p className="uppercase text-info text-xs leading-[18px] font-bold new-arrival-badge mb-6">
                      {productData.category.name}
                    </p>
                  )}

                  <div className="product-title-section flex items-center justify-between mb-6">
                    <h3 className="line-clamp-2">{productData.product_name}</h3>
                    <a className="size-10 inline-flex flex-none items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-300 ml-3">
                      <i className="hgi hgi-stroke hgi-favourite text-xl text-light-secondary-text"></i>
                    </a>
                  </div>

                  <div className="rating-section flex items-center mb-4">
                    <StarRating width={`${ratingPercent}%`} />
                    <span className="font-normal inline-block ml-1">
                      ({reviewCount} reviews)
                    </span>
                  </div>

                  {/* Price — variant select hone pe update hoti hai */}
                  <div className="price-section flex items-center gap-x-3 mb-6">
                    <span className="current-price text-2xl leading-9 font-bold text-light-primary-text relative after:absolute after:h-6 after:w-px after:bg-gray-300 after:right-0 after:top-1/2 after:-translate-y-1/2 pr-3 inline-block">
                      ₹{displayCurrentPrice}
                    </span>
                    {displayOldPrice && (
                      <span className="old-price text-2xl leading-9 font-normal text-light-disabled-text line-through">
                        ₹{displayOldPrice}
                      </span>
                    )}
                    {displayDiscountLabel && (
                      <span className="product-discount-badge uppercase relative bg-warning text-black font-medium text-sm leading-[22px] px-1 after:absolute after:top-0 after:left-full after:z-10 after:w-1 after:h-full after:bg-[url('../images/discount-warning-shape.png')] after:bg-contain after:bg-no-repeat">
                        {displayDiscountLabel}
                      </span>
                    )}
                  </div>

                  <div className="product-add-to-cart-section py-6 border-b border-dashed border-gray-300 border-t">
                    {/* ===== VARIANT SELECTOR ===== */}
                    {hasVariants && (
                      <div className="variant-selection-section mb-6">
                        <div className="variant-selection-title mb-4 flex items-center justify-between">
                          <p className="font-semibold text-light-primary-text flex items-center gap-x-2.5">
                            Variant:
                            <span className="text-light-primary-text font-normal capitalize">
                              {selectedVariant ? (
                                selectedVariant.quantity
                              ) : (
                                <span className="text-light-disabled-text">
                                  Select a variant
                                </span>
                              )}
                            </span>
                          </p>
                        </div>
                        <div className="variant-items flex items-center gap-2 flex-wrap">
                          {productData.Varient.map((variant) => {
                            const isSelected =
                              selectedVariant?._id === variant._id;
                            const outOfStock = !variant.isStock;
                            return (
                              <button
                                key={variant._id}
                                onClick={() =>
                                  setSelectedVariant(
                                    isSelected ? null : variant,
                                  )
                                }
                                disabled={outOfStock}
                                title={
                                  outOfStock ? "Out of stock" : variant.quantity
                                }
                                className={`
                                  relative cursor-pointer flex flex-col items-center justify-center
                                  text-sm leading-6 px-4 py-2 font-semibold border rounded-[100px]
                                  transition-all duration-200 min-w-[80px]
                                  ${
                                    isSelected
                                      ? "border-primary bg-primary text-white shadow-sm"
                                      : outOfStock
                                        ? "border-gray-200 text-light-disabled-text bg-gray-50 cursor-not-allowed opacity-60"
                                        : "border-gray-300 text-light-primary-text hover:border-primary hover:bg-[rgba(0,171,85,0.06)]"
                                  }
                                `}
                              >
                                <span>{variant.quantity}</span>
                                <span
                                  className={`text-xs font-normal leading-4 ${isSelected ? "text-white/90" : "text-light-disabled-text"}`}
                                >
                                  ₹
                                  {formatPrice(
                                    variant.price_after_discount ??
                                      variant.price,
                                  )}
                                </span>
                                {outOfStock && (
                                  <span className="absolute -top-2 -right-1 text-[10px] leading-none bg-error text-white rounded-full px-1.5 py-0.5">
                                    Out
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                        {selectedVariant && !selectedVariant.isStock && (
                          <p className="mt-3 text-sm text-error flex items-center gap-x-1.5">
                            <i className="hgi hgi-stroke hgi-alert-circle text-base"></i>
                            This variant is currently out of stock.
                          </p>
                        )}
                      </div>
                    )}
                    {/* ===== END VARIANT SELECTOR ===== */}

                    <div className="product-add-to-cart-btn-section">
                      <p className="font-semibold text-light-primary-text mb-4">
                        Quantity:
                      </p>
                      <div className="flex items-center justify-between gap-x-4 gap-y-4 flex-wrap md:flex-nowrap md:gap-y-0">
                        <div className="quantity-section flex-1 max-w-[185px] border border-gray-300 rounded-[80px] px-4 py-[11px] flex items-center justify-between">
                          <button
                            onClick={() => handleQtyChange(-1)}
                            className="quantity-btn inline-flex items-center justify-center hover:text-primary"
                          >
                            <i className="hgi hgi-stroke hgi-minus-sign text-xl leading-5"></i>
                          </button>
                          <input
                            type="text"
                            className="quantity-input text-center w-full focus:outline-none font-semibold text-base leading-6 text-light-primary-text"
                            value={quantity}
                            onChange={(e) => {
                              const v = parseInt(e.target.value);
                              if (!isNaN(v) && v > 0) setQuantity(v);
                            }}
                          />
                          <button
                            onClick={() => handleQtyChange(1)}
                            className="quantity-btn inline-flex items-center justify-center hover:text-primary"
                          >
                            <i className="hgi hgi-stroke hgi-plus-sign text-xl leading-5"></i>
                          </button>
                        </div>

                        {/* ===== BUY NOW BUTTON ===== */}
                        <button
                          onClick={handleBuyNow}
                          disabled={
                            isOutOfStock ||
                            (hasVariants && !selectedVariant) ||
                            buyNowDone
                          }
                          className={`btn btn-primary btn-large rounded-[80px] flex-1 transition-all duration-200 ${
                            isOutOfStock || (hasVariants && !selectedVariant)
                              ? "opacity-60 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {buyNowDone ? (
                            <span className="flex items-center justify-center gap-x-2">
                              <i className="hgi hgi-stroke hgi-checkmark-circle-02 text-xl text-white"></i>
                              Redirecting...
                            </span>
                          ) : isOutOfStock ? (
                            "Out of Stock"
                          ) : hasVariants && !selectedVariant ? (
                            "Select Variant"
                          ) : (
                            "Buy Now"
                          )}
                        </button>
                        {/* ===== END BUY NOW BUTTON ===== */}
                      </div>
                    </div>
                  </div>

                  {/* Extra Info */}
                  <div className="product-extra-info-section flex flex-col gap-y-4 mt-6">
                    {[
                      {
                        label: "Delivery:",
                        value: "Estimated Delivery Time 5-7 Days",
                      },
                      { label: "SKU:", value: productData._id },
                      {
                        label: "Categories:",
                        value:
                          [
                            productData.category?.name,
                            productData.sub_category?.name,
                          ]
                            .filter(Boolean)
                            .join(", ") || "—",
                      },
                      productData.stock != null && {
                        label: "Stock:",
                        value:
                          productData.stock > 0
                            ? `${productData.stock} units available`
                            : "Out of stock",
                      },
                    ]
                      .filter(Boolean)
                      .map((item, i) => (
                        <div
                          key={i}
                          className="product-extra-info-item flex items-center gap-x-4 gap-y-4 flex-wrap md:flex-nowrap md:gap-y-0"
                        >
                          <p className="font-semibold text-light-primary-text">
                            {item.label}
                          </p>
                          <p>{item.value}</p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Info Section */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-12 gap-6">
            {ctaInfoCards.map((card, i) => (
              <div key={i} className="md:col-span-6 col-span-12 xl:col-span-3">
                <div
                  className="p-6 border-gray-300 border rounded-2xl text-center wow animate__animated animate__fadeInUp"
                  data-wow-delay={card.delay}
                >
                  <span className="inline-flex items-center justify-center size-14 bg-warning-lighter rounded-full">
                    <i
                      className={`hgi hgi-stroke ${card.icon} text-3xl text-light-primary-text`}
                    ></i>
                  </span>
                  <h5 className="pt-3 pb-0.5">{card.title}</h5>
                  <p>{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      {!loading && !error && productData && (
        <section className="pb-12">
          <div className="container">
            <div id="product-details-tabs">
              <ul className="filter-list">
                {TABS.map((tab) => (
                  <li key={tab.key}>
                    <button
                      className={activeTab === tab.key ? "active" : ""}
                      onClick={() => setActiveTab(tab.key)}
                    >
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="product-details-tab active fade">
                {activeTab === "description" && (
                  <DescriptionTab product={productData} />
                )}
                {activeTab === "additional-info" && (
                  <AdditionalInfoTab product={productData} />
                )}
                {activeTab === "reviews" && (
                  <ReviewsTab reviews={productData.reviews || []} />
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Products Slider */}
      {relatedProducts.length > 0 && (
        <section className="pb-[70px]">
          <div className="container">
            <RelatedSlider products={relatedProducts} />
          </div>
        </section>
      )}

      <Subscribe />
    </>
  );
};

export default ProductDetail;
