import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async"; // ✅ STEP 1: HELMET IMPORT KAREIN
import { Calendar, User, Loader2, ServerCrash } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchAllPosts, BlogPost } from "@/lib/features/blog/blogSlice";
import { RootState, AppDispatch } from "@/lib/store";

const BlogsPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { posts, status, error } = useSelector(
    (state: RootState) => state.blog
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllPosts());
    }
  }, [dispatch, status]);

  const siteUrl = "https://www.yourwebsite.com"; 

  // ✅ DYNAMIC META TAGS KE LIYE DATA TAIYAAR KAREIN
  const latestPost: BlogPost | undefined = posts?.[0];
  const pageTitle =
    "Our Blog - Latest Articles and Insights | Your Company Name";
  const pageDescription =
    latestPost?.metaDescription ||
    latestPost?.description ||
    "Explore our latest articles, insights, and updates. Stay informed with expert advice and industry news from Your Company Name.";
  const ogImage = latestPost?.mainImage || `${siteUrl}/default-blog-image.jpg`; // Default image ka path daalein

  return (
    <>
      {/* ✅ DYNAMIC HELMET TAGS */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={`${siteUrl}/blogs`} />

        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={`${siteUrl}/blogs`} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      <Navbar />
      <div className="bg-soft-teal min-h-screen">
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12 md:mb-16"
            >
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
                Our Latest Insights & Blog Posts
              </h1>
              <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
                Stay updated with the newest trends, design tips, and expert
                advice.
              </p>
              <div className="mt-6 h-1 w-32 bg-primary mx-auto rounded-full"></div>
            </motion.div>

            {status === "loading" && (
              <div className="flex justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            )}
            {status === "failed" && (
              <div className="text-center py-20">
                <ServerCrash className="mx-auto h-12 w-12 text-destructive" />
                <h3 className="mt-4 text-xl font-semibold text-destructive">
                  Failed to Load Posts
                </h3>
                <p className="mt-2 text-muted-foreground">{String(error)}</p>
              </div>
            )}

            {status === "succeeded" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {posts.map((post, index) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                  >
                    <Link to={`/blog/${post.slug}`}>
                      <div className="bg-card rounded-2xl shadow-soft overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full flex flex-col">
                        <div className="overflow-hidden">
                          <img
                            src={post.mainImage}
                            alt={post.imageAltText} // ✅ ALT TEXT KA ISTEMAL KAREIN
                            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="text-xl font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors duration-200">
                            {post.title}
                          </h3>
                          <p className="text-muted-foreground text-sm flex-grow mb-4">
                            {post.description}
                          </p>
                          <div className="flex items-center text-muted-foreground text-xs mt-auto">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span className="mr-4">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                            <User className="w-4 h-4 mr-2" />
                            <span>{post.author}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default BlogsPage;
