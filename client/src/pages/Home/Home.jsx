import React from 'react'
import Hero from '../../components/Hero/Hero'
import Category from '../../components/Category/Category'
import FeatureProduct from '../../components/FeatureProduct/FeatureProduct'
import ProductWithCategory from '../../components/ProductWithCategory/ProductWithCategory'
import BannerGrid from '../../components/BannerGrid/BannerGrid'
import BlogHome from '../../components/BlogHome/BlogHome'
import NewsLetter from '../../components/NewsLetter/NewsLetter'
import PromoBanner from '../../components/PromoBanner/PromoBanner'
import AboutHome from '../../components/AboutHome/AboutHome'
import TestimonialHome from '../../components/TestimonialHome/TestimonialHome'
import QualityHome from '../../components/QualityHome/QualityHome'
import FeatureHome from '../../components/FeatureHome/FeatureHome'


const Home = () => {
  return (
    <>
      <Hero />
      {/* <Category /> */}
      <FeatureProduct />
      <AboutHome />
      <QualityHome />
      {/* <BannerGrid /> */}
      <ProductWithCategory />
      {/* <PromoBanner /> */}
      <FeatureHome />
      <TestimonialHome />
      <BlogHome />
      <NewsLetter />
    </>
  )
}

export default Home
