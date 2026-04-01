import React from 'react'
import guitar from './guitar.png'

// ===================== DATA =====================

const blogs = [
  {
    id: 1,
    image: guitar,
    category: 'Guitar Tips',
    date: '12 Jan 2025',
    comments: 8,
    title: 'How to Choose Your First Guitar: A Complete Beginner\'s Guide',
    excerpt: 'Not sure where to start? We break down everything you need to know before buying your first guitar — acoustic vs electric, budget tips, and top picks.',
    delay: '.2s',
  },
  {
    id: 2,
    image: guitar,
    category: 'Keyboard & Piano',
    date: '28 Feb 2025',
    comments: 14,
    title: 'Digital Piano vs Keyboard: Which One is Right for You?',
    excerpt: 'Confused between a digital piano and a keyboard? We compare features, pricing, and use cases to help you make the right choice for your musical journey.',
    delay: '.3s',
  },
  {
    id: 3,
    image: guitar,
    category: 'Drums & Percussion',
    date: '10 Mar 2025',
    comments: 6,
    title: 'Acoustic vs Electronic Drums: Which Kit Should You Buy in 2025?',
    excerpt: 'From studio recording to apartment practice — we help you decide whether an acoustic drum kit or an electronic kit suits your lifestyle and budget.',
    delay: '.4s',
  },
  {
    id: 4,
    image: guitar,
    category: 'Music Learning',
    date: '22 Apr 2025',
    comments: 11,
    title: '5 Things Every Beginner Musician Should Know Before Buying an Instrument',
    excerpt: 'Starting your music journey? Here are five essential things to consider — from setting a budget to choosing the right brand — so you invest wisely.',
    delay: '.5s',
  },
]

// ===================== COMPONENT =====================

const BlogHome = () => {
  return (
    <section className="pb-[70px]">
      <div className="container">
        <div
          className="flex justify-between items-center mb-10 pb-3 border-b border-gray-300 wow animate__animated animate__fadeInUp"
          data-wow-delay=".2s"
        >
          <h3>Latest from Hargun Musicals</h3>
          {/* <a
            href="blog.html"
            className="text-light-primary-text hover:underline font-bold font-urbanist lg:text-2xl lg:leading-9 text-xl leading-[30px]"
          >
            View All
          </a> */}
        </div>

        <div className="grid grid-cols-12 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="md:col-span-6 col-span-12 xl:col-span-3 wow animate__animated animate__fadeInUp"
              data-wow-delay={blog.delay}
            >
              <div className="border border-gray-300 rounded-2xl p-6 hover:transform hover:translate-y-[-5px] hover:transition-all hover:ease-[cubic-bezier(0.02,0.01,0.47,1)] hover:duration-250 transition-all ease-[cubic-bezier(0.02,0.01,0.47,1)] duration-250">

                {/* Image */}
                <div className="mb-6">
                  <img src={blog.image} alt={blog.title} className="rounded-2xl" />
                </div>

                {/* Category */}
                <div className="mb-4">
                  <a
                    href="#"
                    className="text-warning-dark bg-[rgba(255,193,7,0.16)] px-2 py-px inline-flex rounded-full text-xs leading-[18px]"
                  >
                    {blog.category}
                  </a>
                </div>

                {/* Date & Comments */}
                <div className="flex divide-x divide-[rgba(145,158,171,0.24)]">
                  <p className="text-light-secondary-text text-sm leading-[22px] inline-flex items-center gap-x-2 pr-4">
                    <span>
                      <i className="hgi hgi-stroke hgi-calendar-03 text-base text-light-secondary-text"></i>
                    </span>
                    <span>{blog.date}</span>
                  </p>
                  <p className="text-light-secondary-text text-sm leading-[22px] inline-flex items-center gap-x-2 pl-4">
                    <span>
                      <i className="hgi hgi-stroke hgi-chatting-01 text-base text-light-secondary-text"></i>
                    </span>
                    <span>Comment</span>
                    <span>({blog.comments})</span>
                  </p>
                </div>

                {/* Title */}
                <h6 className="mt-4 mb-3 hover:text-primary">
                  <a href="">{blog.title}</a>
                </h6>

                {/* Excerpt */}
                <p className="mb-4">{blog.excerpt}</p>

                {/* CTA */}
                <a
                  className="btn btn-primary btn-large rounded-[60px] group py-2 pl-5 pr-3"
                  href=""
                >
                  Read More
                  <span className="size-8 bg-white inline-flex items-center justify-center rounded-full rotate-[-40deg] transform group-hover:rotate-0 transition-all duration-300">
                    <i className="hgi hgi-stroke hgi-arrow-right-02 text-xl text-primary-darker"></i>
                  </span>
                </a>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BlogHome