import React, { useState, useRef, useEffect, useCallback } from "react";
import logo from "./logo3.png";
import axios from "axios";

const API_BASE = "https://api.hargunmusicals.com/api/v1";

// ─── Debounce hook ─────────────────────────────────────────────────────────────
const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

// ─── Search Dropdown ───────────────────────────────────────────────────────────
const SearchDropdown = ({ results, loading, query, onClose }) => {
  if (!query) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-dark-z-24 border border-gray-200 z-50 overflow-hidden max-h-[420px] overflow-y-auto">
      {loading ? (
        <div className="flex items-center justify-center py-8 gap-x-3">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-light-secondary-text">Searching...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-y-2">
          <i className="hgi hgi-stroke hgi-search-01 text-3xl text-light-disabled-text"></i>
          <p className="text-sm text-light-secondary-text">No products found for "<strong>{query}</strong>"</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {results.map((product) => {
            const img = product.ProductMainImage?.url || null;
            const price = product.afterDiscountPrice || product.price;
            const hasDiscount = product.discount > 0;

            return (
              <li key={product._id}>
                <a
                  href={`/product-detail/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-x-4 px-4 py-3 hover:bg-gray-50 transition-colors duration-150 group"
                >
                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-xl bg-[#F4F3F5] flex-shrink-0 overflow-hidden">
                    {img ? (
                      <img src={img} alt={product.product_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <i className="hgi hgi-stroke hgi-package text-lg text-light-disabled-text"></i>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-light-primary-text text-sm truncate group-hover:text-primary transition-colors">
                      {product.product_name}
                    </p>
                    {product.category?.name && (
                      <p className="text-xs text-light-secondary-text mt-0.5">{product.category.name}</p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="font-bold text-sm text-light-primary-text">₹{Number(price).toFixed(2)}</span>
                    {hasDiscount && (
                      <span className="text-xs text-error font-medium">{product.discount}% OFF</span>
                    )}
                  </div>

                  <i className="hgi hgi-stroke hgi-arrow-right-01 text-base text-light-disabled-text group-hover:text-primary transition-colors flex-shrink-0"></i>
                </a>
              </li>
            );
          })}

          {/* View all results */}
          <li>
            <a
              href={`/shop?search=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="flex items-center justify-center gap-x-2 py-3 px-4 bg-gray-50 hover:bg-primary/5 text-primary text-sm font-semibold transition-colors"
            >
              <i className="hgi hgi-stroke hgi-search-01 text-base"></i>
              View all results for "{query}"
            </a>
          </li>
        </ul>
      )}
    </div>
  );
};

// ─── Search Input (reusable) ───────────────────────────────────────────────────
const SearchInput = ({ id, inputClass, placeholder, label, containerClass }) => {
  const [query, setQuery]           = useState("");
  const [results, setResults]       = useState([]);
  const [loading, setLoading]       = useState(false);
  const [isOpen, setIsOpen]         = useState(false);
  const containerRef                = useRef(null);
  const debouncedQuery              = useDebounce(query, 400);

  // Fetch results on debounced query change
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      setIsOpen(false)
      return
    }

    const fetchResults = async () => {
      setLoading(true)
      setIsOpen(true)
      try {
        const { data } = await axios.get(`${API_BASE}/search_product_and_filter`, {
          params: { query: debouncedQuery, page: 1 },
        })
        setResults(data.data || [])
      } catch (err) {
        console.error("Search error:", err)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [debouncedQuery])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Submit on Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(query.trim())}`
    }
    if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  return (
    <div className={`relative search-input-container ${containerClass || ""}`} ref={containerRef}>
      <div className={inputClass}>
        <div className="input-group-addon" data-align="inline-end">
          <i className="hgi hgi-stroke hgi-search-01 text-gray-500 text-xl"></i>
        </div>
        <input
          type="text"
          id={id}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (query.trim()) setIsOpen(true) }}
          onKeyDown={handleKeyDown}
          className="peer form-control header-search-input placeholder-transparent focus:placeholder-transparent focus:outline-none"
          placeholder={placeholder}
          autoComplete="off"
        />
        {label && (
          <label
            htmlFor={id}
            className="absolute left-[14px] top-1/2 -translate-y-1/2 text-xs leading-[18px] transition-all peer-placeholder-shown:text-light-disabled-text peer-placeholder-shown:text-[16px] peer-placeholder-shown:top-1/2 peer-focus:text-[12px] peer-focus:top-0 peer-[:not(:placeholder-shown)]:text-[12px] peer-[:not(:placeholder-shown)]:top-0 bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:px-1"
          >
            {label}
          </label>
        )}
        {/* Clear button */}
        {/* {query && (
          <button
            onClick={() => { setQuery(""); setResults([]); setIsOpen(false) }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <i className="hgi hgi-stroke hgi-multiplication-sign text-xs text-light-primary-text"></i>
          </button>
        )} */}
      </div>

      {isOpen && (
        <SearchDropdown
          results={results}
          loading={loading}
          query={query}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

// ─── Main Header ───────────────────────────────────────────────────────────────
const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen]       = useState(false);
  const [isNavSidebarOpen, setIsNavSidebarOpen] = useState(false);
  const [scrollToTopVisible, setScrollToTopVisible] = useState(false);
  const [allCategory, setCategory]              = useState([]);
  const [login, setLogin]                       = useState(false);

  // Scroll to top visibility
  useEffect(() => {
    const handleScroll = () => setScrollToTopVisible(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleFetchCategory = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/admin/category`);
      setCategory(data.categories);
    } catch (error) {
      console.log("Category fetch error", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token_login");
    setLogin(!!token);
    handleFetchCategory();
  }, []);

  const handleRedirectLogin = () => {
    window.location.href = login ? "/profile" : "/login";
  };

  const handleRedirectCart = () => {
    window.location.href = "/cart";
  };

  return (
    <>
      {/* Scroll To Top */}
      <button
        onClick={scrollToTop}
        className={`scroll-to-top btn btn-primary size-10 rounded-[50px] z-50 inline-flex items-center justify-center fixed md:right-8 md:bottom-8 right-[15px] bottom-[85px] transition-all duration-400 ease-in-out ${
          scrollToTopVisible ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <i className="hgi hgi-stroke hgi-arrow-up-01 leading-6 text-2xl"></i>
      </button>

      {/* Backdrop (nav sidebar) */}
      {isNavSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-90 backdrop-blur-sm"
          onClick={() => setIsNavSidebarOpen(false)}
        />
      )}

      {/* ── NAV SIDEBAR ── */}
      <div
        className={`fixed top-0 left-0 w-[350px] bg-white h-full z-91 px-4 py-6 flex flex-col justify-between gap-y-6 overflow-y-auto shadow-dark-z-24 transition-all duration-250 ease-[cubic-bezier(0.645,0.045,0.355,1)] ${
          isNavSidebarOpen ? "translate-x-0 opacity-100 visible" : "-translate-x-[200px] opacity-0 invisible"
        }`}
      >
        <div>
          <div className="relative pb-6">
            <img src={logo} alt="Logo" className="w-[100px]" />
            <button
              onClick={() => setIsNavSidebarOpen(false)}
              className="size-7 inline-flex items-center justify-center absolute top-0 right-0 rounded-full bg-[rgba(145,158,171,0.08)]"
            >
              <i className="hgi hgi-stroke hgi-multiplication-sign text-xl leading-5"></i>
            </button>
          </div>

          <div className="flex flex-col gap-y-6">
            {/* Sidebar Search */}
            <SearchInput
              id="sidebar-search"
              inputClass="input-group w-full px-4 py-2 rounded-[100px]"
              placeholder="Search for the Items"
              containerClass="w-full"
            />

            <nav className="mobile-menu">
              <ul>
                <li><a className="active" href="/">Home</a></li>
                <li><a href="/about">About Us</a></li>
                <li><a href="/shop">Shop</a></li>
                {/* <li><a href="#">Blog</a></li> */}
                <li><a href="/contact">Contact</a></li>
              </ul>
            </nav>

            <div className="border border-gray-500/24 p-5 rounded-2xl">
              <div className="flex flex-col gap-y-3">
                <a
                  href={login ? "/profile" : "/login"}
                  className="flex items-center gap-x-2 login-page-btn"
                >
                  <span className="inline-flex items-center justify-center bg-warning size-8 rounded-full">
                    <i className="hgi hgi-stroke hgi-lock-sync-01 text-base text-light-primary-text"></i>
                  </span>
                  {login ? "My Profile" : "Log in / Sign Up"}
                </a>
                <a href="tel:+919971304667" className="flex items-center gap-x-2">
                  <span className="inline-flex items-center justify-center bg-warning size-8 rounded-full">
                    <i className="hgi hgi-stroke hgi-call text-base text-light-primary-text"></i>
                  </span>
                  +91 99713 04667
                </a>
              </div>
            </div>

            <div>
              <h4 className="mb-3">Follow us</h4>
              <ul className="flex items-center gap-x-4">
                {[
                  { icon: "hgi-facebook-01", href: "#" },
                  { icon: "hgi-linkedin-01", href: "#" },
                  { icon: "hgi-instagram",   href: "#" },
                  { icon: "hgi-twitter",     href: "#" },
                ].map(({ icon, href }) => (
                  <li key={icon}>
                    <a href={href} className="inline-flex items-center justify-center gap-x-2">
                      <span className="size-8 bg-primary-dark inline-flex items-center justify-center rounded-full">
                        <i className={`hgi hgi-stroke ${icon} text-base text-white`}></i>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── HEADER ── */}
      <header>
        {/* Header Top */}
        <div className="bg-primary header-top">
          <div className="container">
            <div className="flex items-center xl:justify-between justify-center">
              <div className="xl:flex items-center gap-x-6 hidden">
                <p className="flex items-center gap-x-2 text-white text-sm leading-[22px]">
                  <span><i className="hgi hgi-stroke hgi-customer-support text-xl text-white"></i></span>
                  Need Support ?<span>Call Us</span>
                  <a href="tel:+919971304667" className="bg-warning py-px px-2 text-xs leading-4.5 rounded-[60px] text-gray-800">
                    +91 99713 04667
                  </a>
                </p>
              </div>
              <div className="text-center py-3.5">
                <p className="flex items-center gap-x-[7px] text-white text-sm leading-[22px] font-dm-sans">
                  <span className="inline-flex items-center">
                    <i className="hgi hgi-stroke hgi-discount-01 text-white text-xl"></i>
                  </span>
                  Guitar Accessories
                  <span className="bg-warning py-px px-2 text-xs leading-4.5 rounded-[60px] text-gray-800">25% OFF</span>
                  Today
                </p>
              </div>
              <div className="hidden xl:flex">
                <ul className="flex items-center text-white">
                  <li>
                    <a className="text-sm leading-[22px] text-white pr-[19px] mr-[19px] py-3.5 relative after:absolute after:h-7.5 after:w-px after:bg-primary-light after:right-0 after:top-1/2 after:-translate-y-1/2" href="/about">
                      About us
                    </a>
                  </li>
                  <li>
                    <a href="/profile" className="text-sm leading-[22px] text-white pr-[19px] mr-[19px] py-3.5">
                      My Account
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Header Middle (Desktop) */}
        <div className="py-4 border border-gray-300 xl:border-0 hidden xl:block header-middle">
          <div className="container">
            <div className="xl:flex items-center hidden">
              <div>
                <a href="/"><img src={logo} className="logo-class" alt="Logo" /></a>
              </div>
              <div className="flex items-center w-full justify-end gap-x-[54px]">

                {/* ── Desktop Search with dropdown ── */}
                <SearchInput
                  id="desktop-search"
                  inputClass="input-group px-6 pt-3 pb-3 rounded-[100px]"
                  placeholder="Search for the Items"
                  label="Search for the Items"
                  containerClass="w-full 2xl:max-w-[800px] xl:max-w-[600px]"
                />

                <div className="flex items-center gap-x-6 shrink-0">
                  <ul className="flex items-center gap-x-6">
                    <li onClick={handleRedirectLogin} className="flex items-center gap-x-4 cursor-pointer relative group">
                      <p className="flex items-center">
                        <span className="inline-flex items-center justify-center bg-warning w-12 h-12 rounded-full">
                          <i className="hgi hgi-stroke hgi-lock-sync-01 text-2xl text-light-primary-text"></i>
                        </span>
                      </p>
                      <p className="flex flex-col text-light-secondary-text text-sm leading-[22px]">
                        Account
                        <span className="text-base leading-6 text-light-primary-text">
                          {login ? "Profile" : "Sign in"}
                        </span>
                      </p>
                    </li>
                    <li className="flex items-center">
                      <button onClick={handleRedirectCart} className="flex items-center gap-x-4 cursor-pointer cart-sidebar-btn">
                        <span className="inline-flex items-center justify-center bg-warning w-12 h-12 rounded-full">
                          <i className="hgi hgi-stroke hgi-shopping-cart-02 text-2xl text-light-primary-text"></i>
                        </span>
                        <span className="flex flex-col items-start text-sm leading-[22px] text-light-secondary-text">
                          Cart
                          <span className="text-base leading-6 text-light-primary-text">Items</span>
                        </span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="border border-gray-300 xl:border-0 sticky-header">
          <div className="pb-4 pt-3 block xl:hidden">
            <div className="container">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setIsNavSidebarOpen(true)}
                  className="btn btn-default outline shadow-none size-12 rounded-[50px]"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 12L10 12" stroke="#212529" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M20 5L4 5" stroke="#212529" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M20 19L4 19" stroke="#212529" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <a href="/">
                  <img src={logo} alt="Logo" className="w-[120px] md:w-[150px] logo-class" />
                </a>
                <button onClick={handleRedirectCart} className="btn bg-warning-light size-12 rounded-[50px] cart-sidebar-btn">
                  <i className="hgi hgi-stroke hgi-shopping-cart-01 text-light-primary-text text-2xl leading-6"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="pb-4 block xl:hidden">
            <div className="container">
              <SearchInput
                id="mobile-search"
                inputClass="input-group w-full px-4 py-3 rounded-[100px]"
                placeholder="Search for the Items"
                label="Search for the Items"
                containerClass="w-full"
              />
            </div>
          </div>
        </div>

        {/* Header Bottom (Desktop nav) */}
        <div className="border border-gray-300 hidden xl:flex header-bottom sticky-header border-r-0 border-l-0">
          <div className="container">
            <div className="hidden relative items-center justify-between xl:flex">

              {/* Categories dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsSidebarOpen((prev) => !prev)}
                  className="btn btn-primary btn-large rounded-lg"
                >
                  <span className="inline-flex items-center">
                    <i className="hgi hgi-stroke hgi-grid-view text-base text-white"></i>
                  </span>
                  Explore All Categories
                  <span className="inline-flex items-center">
                    <i className={`hgi hgi-stroke text-xl text-white transition-transform duration-300 ${isSidebarOpen ? "hgi-arrow-up-01" : "hgi-arrow-down-01"}`}></i>
                  </span>
                </button>

                {isSidebarOpen && (
                  <ul className="bg-white shadow-dark-z-24 rounded-b-2xl px-4 py-4 z-40 absolute left-0 top-full w-full divide-y divide-[rgba(145,158,171,0.24)]">
                    {allCategory.map((item, index) => (
                      <li key={index} className="py-[9px] group">
                        <a
                          href={`/category/${item?.slug}`}
                          className="flex items-center gap-x-2 relative text-light-primary-text group-hover:text-primary"
                        >
                          <span className="w-8 h-8 bg-primary-lighter inline-flex items-center justify-center rounded-full">
                            <i className="hgi hgi-stroke hgi-package text-base text-primary"></i>
                          </span>
                          {item?.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Nav links */}
              <nav className="main-menu">
                <ul>
                  <li><a className="active" href="/">Home</a></li>
                  <li><a href="/about">About Us</a></li>
                  <li><a href="/shop">Shop</a></li>
                  {/* <li><a href="#">Blog</a></li> */}
                  <li><a href="/contact">Contact</a></li>
                </ul>
              </nav>

              {/* Support */}
              <div>
                <p className="xl:flex lg:items-center gap-x-4 hidden">
                  <span className="size-12 inline-flex items-center justify-center rounded-full transition-colors duration-300 bg-[rgba(145,158,171,0.08)]">
                    <i className="hgi hgi-stroke hgi-customer-support text-2xl text-light-primary-text"></i>
                  </span>
                  <span className="flex flex-col text-sm leading-[22px]">
                    24/7 Support
                    <span className="text-base leading-6 text-light-primary-text">+91 99713 04667</span>
                  </span>
                </p>
              </div>

            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;