// generate-sitemap.js

const fs = require("fs");
const axios = require("axios");
const path = require("path");
const BASE_URL = "https://houseplanfiles.com";
const API_URL =
  "https://vercel.com/cmt-ais-projects-4975cf20/architect-backend/api";
const SITEMAP_PATH = path.resolve(__dirname, "public", "sitemap.xml");
async function fetchAllItems(endpoint) {
  try {
    const { data } = await axios.get(`${API_URL}/${endpoint}`);
    return Array.isArray(data)
      ? data
      : data.products || data.posts || data.plans || [];
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error.message);
    return [];
  }
}

async function generateSitemap() {
  console.log("Starting sitemap generation...");

  const today = new Date().toISOString().split("T")[0];
  const staticRoutes = [
    "/",
    "/products",
    "/cart",
    "/checkout",
    "/thank-you",
    "/services",
    "/about",
    "/download",
    "/careers",
    "/contact",
    "/register",
    "/login",
    "/apply",
    "/terms",
    "/privacy",
    "/payment-policy",
    "/refund-policy",
    "/blogs",
    "/floor-plans",
    "/3D-plans",
    "/interior-designs",
    "/construction-products",
    "/customize/floor-plans",
    "/customize/interior-designs",
    "/customize/3d-elevation",
    "/customize/3d-video-walkthrough",
    "/corporate-inquiry/standard",
    "/corporate-inquiry/premium",
    "/brand-partners",
    "/booking-form",
    "/premium-booking-form",
    "/gallery",
  ].map((route) => ({
    loc: `${BASE_URL}${route}`,
    lastmod: today,
    changefreq: route === "/" ? "daily" : "monthly",
    priority:
      route === "/"
        ? "1.0"
        : route.includes("products") || route.includes("blogs")
          ? "0.9"
          : "0.8",
  }));
  console.log(`Found ${staticRoutes.length} static routes.`);

  // --- 2. Dynamic Blog Posts ---
  const posts = await fetchAllItems("blogs"); // Endpoint: /api/blogs
  const blogRoutes = posts.map((post) => ({
    loc: `${BASE_URL}/blog/${post.slug}`,
    lastmod: new Date(post.updatedAt).toISOString().split("T")[0],
    changefreq: "weekly",
    priority: "0.9",
  }));
  console.log(`Found ${blogRoutes.length} blog posts.`);
  const products = await fetchAllItems("products"); // Endpoint: /api/products
  const productRoutes = products.map((product) => ({
    loc: `${BASE_URL}/product/${product._id}`, // Ya product.slug agar hai
    lastmod: new Date(product.updatedAt).toISOString().split("T")[0],
    changefreq: "weekly",
    priority: "0.9",
  }));
  console.log(`Found ${productRoutes.length} products.`);
  const professionalPlans = await fetchAllItems("professional-plans/approved"); // Maan rahe hain ki aisa endpoint hai
  const professionalPlanRoutes = professionalPlans.map((plan) => ({
    loc: `${BASE_URL}/professional-plan/${plan._id}`,
    lastmod: new Date(plan.updatedAt).toISOString().split("T")[0],
    changefreq: "weekly",
    priority: "0.9",
  }));
  console.log(`Found ${professionalPlanRoutes.length} professional plans.`);

  // --- Sabhi routes ko combine karein ---
  const allRoutes = [
    ...staticRoutes,
    ...blogRoutes,
    ...productRoutes,
    ...professionalPlanRoutes,
  ];

  // --- XML content banayein ---
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allRoutes
    .map(
      (route) => `
  <url>
    <loc>${route.loc}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
    )
    .join("")}
</urlset>`;
  try {
    fs.writeFileSync(SITEMAP_PATH, sitemapXml);
    console.log(`Sitemap generated successfully at ${SITEMAP_PATH}`);
  } catch (error) {
    console.error(`Failed to write sitemap file:`, error.message);
  }
}

generateSitemap();
