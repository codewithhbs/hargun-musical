import React, { useState, useEffect } from "react";
import logo from "./logo3.png";
import axios from "axios";

const Footer = () => {
  const [allCategory, setAllCategory] = useState([]);

  const handleFetchCategory = async () => {
    try {
      const { data } = await axios.get(
        "https://api.hargunmusicals.com/api/v1/admin/category",
      );
      setAllCategory(data.categories);
    } catch (error) {
      console.log("Internal server error", error);
    }
  };

  useEffect(() => {
    handleFetchCategory();
  }, []);

  return (
    <>
      {/* <!-- ========== Footer Section Start ========== --> */}
      <footer className="md:pb-15 pb-[100px] bg-primary-darker pt-40 xl:rounded-tr-[22px] xl:rounded-tl-[22px]">
        <div className="container">
          {/* <!-- ========== Footer Top Section Start ========== --> */}
          <div className="pb-9 grid grid-cols-12 gap-6">
            <div className="md:col-span-12 col-span-12 xl:col-span-3 flex flex-col gap-y-6">
              <div>
                <a href="/">
                  <img className="logo-class" src={logo} alt="logo" />
                </a>
              </div>
              <p className="text-primary-lighter text-base">
                At Hargun Musicals, our mission is to make world-class musical
                instruments accessible, affordable, and reliable for every
                musician — from beginners picking up their first guitar to
                professionals performing on stage. We are committed to nurturing
                a love for music across India, one instrument at a time.
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-4">
                <a
                  className="inline-flex items-center justify-center size-10 rounded-full bg-[rgba(145,158,171,0.16)]"
                  href="#"
                >
                  <i className="hgi hgi-stroke hgi-facebook-01 text-2xl text-white"></i>
                </a>
                <a
                  className="inline-flex items-center justify-center size-10 rounded-full bg-[rgba(145,158,171,0.16)]"
                  href="#"
                >
                  <i className="hgi hgi-stroke hgi-instagram text-2xl text-white"></i>
                </a>
                <a
                  className="inline-flex items-center justify-center size-10 rounded-full bg-[rgba(145,158,171,0.16)]"
                  href="#"
                >
                  <i className="hgi hgi-stroke hgi-linkedin-01 text-2xl text-white"></i>
                </a>
                <a
                  className="inline-flex items-center justify-center size-10 rounded-full bg-[rgba(145,158,171,0.16)]"
                  href="#"
                >
                  <i className="hgi hgi-stroke hgi-pinterest text-2xl text-white"></i>
                </a>
                <a
                  className="inline-flex items-center justify-center size-10 rounded-full bg-[rgba(145,158,171,0.16)]"
                  href="#"
                >
                  <i className="hgi hgi-stroke hgi-behance-01 text-2xl text-white"></i>
                </a>
              </div>
            </div>
            <div className="md:col-span-6 col-span-12 xl:col-span-3">
              <h5 className="text-primary-lighter pb-6 border-b border-[rgba(145,158,171,0.24)]">
                About
              </h5>
              <ul className="flex flex-col gap-y-1.5 pt-4">
                <li className="py-1.5 flex items-center gap-x-2">
                  <span className="inline-flex items-center">
                    <i className="hgi hgi-stroke hgi-arrow-right-01 text-xl text-primary-lighter"></i>
                  </span>
                  <a
                    href="/about"
                    className="text-primary-lighter font-semibold hover:underline"
                  >
                    About Us
                  </a>
                </li>
                <li className="py-1.5 flex items-center gap-x-2">
                  <span className="inline-flex items-center">
                    <i className="hgi hgi-stroke hgi-arrow-right-01 text-xl text-primary-lighter"></i>
                  </span>
                  <a
                    href="/shop"
                    className="text-primary-lighter font-semibold hover:underline"
                  >
                    Shop
                  </a>
                </li>
                <li className="py-1.5 flex items-center gap-x-2">
                  <span className="inline-flex items-center">
                    <i className="hgi hgi-stroke hgi-arrow-right-01 text-xl text-primary-lighter"></i>
                  </span>
                  <a
                    href="#"
                    className="text-primary-lighter font-semibold hover:underline"
                  >
                    Blogs
                  </a>
                </li>
                <li className="py-1.5 flex items-center gap-x-2">
                  <span className="inline-flex items-center">
                    <i className="hgi hgi-stroke hgi-arrow-right-01 text-xl text-primary-lighter"></i>
                  </span>
                  <a
                    className="text-primary-lighter font-semibold hover:underline"
                    href="/contact"
                  >
                    Contact Us
                  </a>
                </li>
                <li className="py-1.5 flex items-center gap-x-2">
                  <span className="inline-flex items-center">
                    <i className="hgi hgi-stroke hgi-arrow-right-01 text-xl text-primary-lighter"></i>
                  </span>
                  <a
                    href="/term"
                    className="text-primary-lighter font-semibold hover:underline"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li className="py-1.5 flex items-center gap-x-2">
                  <span className="inline-flex items-center">
                    <i className="hgi hgi-stroke hgi-arrow-right-01 text-xl text-primary-lighter"></i>
                  </span>
                  <a
                    href="/privacy"
                    className="text-primary-lighter font-semibold hover:underline"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div className="md:col-span-6 col-span-12 xl:col-span-3">
              <h5 className="text-primary-lighter pb-6 border-b border-[rgba(145,158,171,0.24)]">
                Categories
              </h5>
              <ul className="flex flex-col gap-y-1.5 pt-4">
                {allCategory &&allCategory.map((category,index) => (
                  <li key={index} className="py-1.5 flex items-center gap-x-2">
                    <span className="inline-flex items-center">
                      <i className="hgi hgi-stroke hgi-arrow-right-01 text-xl text-primary-lighter"></i>
                    </span>
                    <a
                      href={`/category/${category?.slug}`}
                      className="text-primary-lighter font-semibold hover:underline"
                    >
                      {category?.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-6 col-span-12 xl:col-span-3">
              <h5 className="text-primary-lighter pb-6 border-b border-[rgba(145,158,171,0.24)]">
                Contact Information's
              </h5>
              <ul className="flex flex-col gap-y-1.5 py-4">
                <li className="flex items-center gap-x-3">
                  <span className="size-10 inline-flex items-center justify-center rounded-full bg-[rgba(145,158,171,0.16)]">
                    <i className="hgi hgi-stroke hgi-maps-global-01 text-2xl text-primary-lighter"></i>
                  </span>
                  <p className="text-primary-lighter font-semibold">
                    Shop No.34, 34, Main Market Marg, Near Ram Leela Ground,
                    Block 8, Press Colony, Subhash Nagar, New Delhi, Delhi,
                    110027
                  </p>
                </li>
                <li className="flex items-center gap-x-3">
                  <span className="size-10 inline-flex items-center justify-center rounded-full bg-[rgba(145,158,171,0.16)]">
                    <i className="hgi hgi-stroke hgi-call text-2xl text-primary-lighter"></i>
                  </span>
                  <p className="text-primary-lighter font-semibold">
                    Call Us: +91 99713 04667
                  </p>
                </li>
                <li className="flex items-center gap-x-3">
                  <span className="size-10 inline-flex items-center justify-center rounded-full bg-[rgba(145,158,171,0.16)]">
                    <i className="hgi hgi-stroke hgi-mail-02 text-2xl text-primary-lighter"></i>
                  </span>
                  <p className="text-primary-lighter font-semibold">
                   support@hargunmusicals.com
                  </p>
                </li>
              </ul>
            </div>
          </div>
          {/* <!-- ========== Footer Top Section End ========== --> */}

          {/* <!-- ========== Footer Bottom Section Start ========== --> */}
          <div className="text-center text-white bg-[url('../images/bottom-border.png')] pt-[22px] bg-center pb-px bg-no-repeat">
            2026 Copyright By Hargun Musicals
          </div>
          {/* <!-- ========== Footer Bottom Section End ========== --> */}
        </div>
      </footer>
      {/* <!-- ========== Footer Section End ========== --> */}
    </>
  );
};

export default Footer;
