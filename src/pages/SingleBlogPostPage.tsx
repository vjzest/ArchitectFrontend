import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async"; 
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogSidebar from "@/components/BlogSidebar"; 
import { Loader2, ServerCrash, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  fetchPostBySlug,
  clearCurrentPost,
} from "@/lib/features/blog/blogSlice";
import { RootState, AppDispatch } from "@/lib/store";

const SingleBlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch: AppDispatch = useDispatch();
  const { post, status, error } = useSelector((state: RootState) => state.blog);

  useEffect(() => {
    if (slug) {
      dispatch(fetchPostBySlug(slug));
    }
    return () => {
      dispatch(clearCurrentPost());
    };
  }, [dispatch, slug]);

  // --- LOADING STATE ---
  if (status === "loading") {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-soft-teal">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
        <Footer />
      </>
    );
  }

  if (status === "failed" || !post) {
    return (
      <>
        <Helmet>
          <title>Post Not Found | Your Company Name</title>
          <meta
            name="description"
            content="The blog post you are looking for could not be found."
          />
        </Helmet>
        <Navbar />
        <div className="bg-soft-teal min-h-screen flex flex-col items-center justify-center text-center p-4">
          <ServerCrash className="h-16 w-16 text-destructive mb-4" />
          <h1 className="text-4xl font-bold text-foreground">Post Not Found</h1>
          <p className="mt-2 text-muted-foreground">
            {String(error) ||
              "The blog post you are looking for does not exist or may have been moved."}
          </p>
          <Button asChild className="mt-6">
            <Link to="/blogs">Back to All Blogs</Link>
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  const siteUrl = "https://houseplanfiles.com"; 
  const canonicalUrl = `${siteUrl}/blog/${post.slug}`;
  return (
    <>
      <Helmet>
        <title>{`${post.title} | Your Company Name`}</title>
        <meta
          name="description"
          content={post.metaDescription || post.description}
        />
        <meta
          name="keywords"
          content={post.metaKeywords?.join(", ") || post.tags?.join(", ")}
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={post.title} />
        <meta
          property="og:description"
          content={post.metaDescription || post.description}
        />
        <meta property="og:image" content={post.mainImage} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.createdAt} />
        <meta property="article:author" content={post.author} />
        {post.tags?.map((tag) => (
          <meta property="article:tag" content={tag} key={tag} />
        ))}

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta
          name="twitter:description"
          content={post.metaDescription || post.description}
        />
        <meta name="twitter:image" content={post.mainImage} />
      </Helmet>

      <Navbar />
      <div className="bg-soft-teal py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto">
            {/* Main Blog Content Area */}
            <main className="w-full lg:w-2/3 bg-card p-6 sm:p-8 rounded-2xl shadow-soft">
              <article>
                <header className="mb-8">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight mb-3">
                    {post.title}
                  </h1>
                  <div className="flex items-center text-muted-foreground text-sm space-x-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1.5" />
                      <span>By {post.author}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </header>

                <div className="mb-8 rounded-lg overflow-hidden">
                  <img
                    src={post.mainImage}
                    alt={post.imageAltText}
                    title={post.imageTitleText || post.title}
                    className="w-full h-auto object-cover"
                  />
                </div>

                <div
                  className="prose lg:prose-lg max-w-none text-foreground space-y-4"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </article>

              {/* "Leave a Comment" Form Section */}
              <section className="mt-12 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Leave a Comment
                </h2>
                <form className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Your email address will not be published. Required fields
                    are marked *
                  </p>
                  <div>
                    <textarea
                      placeholder="Your comment..."
                      rows={6}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Name *"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email *"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity duration-200"
                    >
                      Post Comment
                    </button>
                  </div>
                </form>
              </section>
            </main>

            {/* Sidebar */}
            <BlogSidebar />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SingleBlogPostPage;
