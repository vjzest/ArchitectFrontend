import fs from 'fs';
import 'dotenv/config';

const BASE_URL = 'https://houseplanfiles.com';
const backendUrl = process.env.VITE_BACKEND_URL;

function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') 
    .replace(/[^\w\-]+/g, '') 
    .replace(/\-\-+/g, '-'); 
}


async function fetchAllPaginatedData(endpoint) {
  let allItems = [];
  let currentPage = 1;
  let totalPages = 1;
  const limitPerPage = 100; 

  console.log(`\nFetching all data from endpoint: ${endpoint}`);

  do {
    const url = `${backendUrl}${endpoint}?page=${currentPage}&limit=${limitPerPage}`;
    console.log(` -> Fetching: ${url}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${endpoint} on page ${currentPage}. Status: ${response.status}`);
    }
    const data = await response.json();
    const items = data.products || data.plans || [];
    if (items.length > 0) {
      allItems = allItems.concat(items);
    }

    if (currentPage === 1) {
      totalPages = data.pages || 1;
      console.log(` -> Total pages to fetch: ${totalPages}`);
    }
    
    console.log(` -> Fetched ${items.length} items from page ${currentPage}/${totalPages}. Total items collected: ${allItems.length}`);
    currentPage++;
    
  } while (currentPage <= totalPages);

  console.log(`✅ Finished fetching for ${endpoint}. Total items: ${allItems.length}`);
  return allItems;
}

async function generateSitemap() {
  console.log('🚀 Starting sitemap generation...');
  if (!backendUrl) {
    console.error('❌ Error: VITE_BACKEND_URL is not defined in your .env file.');
    process.exit(1);
  }

  try {
    const [products, professionalPlans] = await Promise.all([
      fetchAllPaginatedData('/api/products'),
      fetchAllPaginatedData('/api/professional-plans'),
    ]);
    
    const staticPages = [
      { path: "/", priority: 1.0, changefreq: "daily" },
      { path: "/products", priority: 0.9, changefreq: "weekly" },
      { path: "/blogs", priority: 0.9, changefreq: "weekly" },
      { path: "/about", priority: 0.8 },
      { path: "/contact", priority: 0.8 },
      { path: "/terms", priority: 0.7 },
      { path: "/privacy-policy", priority: 0.7 },
    ];
    
    const today = new Date().toISOString().split("T")[0];

    const staticUrls = staticPages.map((page) => `
  <url>
    <loc>${BASE_URL}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq || "monthly"}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('');

    const productUrls = products.map((product) => {
      const productName = product.name || product.Name || "untitled-product";
      const lastmod = product.updatedAt ? product.updatedAt.split("T")[0] : today;
      return `
  <url>
    <loc>${BASE_URL}/product/${slugify(productName)}-${product._id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
    }).join('');

    const planUrls = professionalPlans.map((plan) => {
      const planName = plan.planName || plan.name || "untitled-plan";
      const lastmod = plan.updatedAt ? plan.updatedAt.split("T")[0] : today;
      return `
  <url>
    <loc>${BASE_URL}/professional-plan/${slugify(planName)}-${plan._id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
    }).join('');

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${productUrls}
${planUrls}
</urlset>`;

    fs.writeFileSync('public/sitemap.xml', sitemapXml, 'utf8');

    console.log('\n🎉 Sitemap generated successfully!');
    console.log(`   File location: public/sitemap.xml`);
    console.log(`   - Static pages: ${staticPages.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Professional Plans: ${professionalPlans.length}`);
    console.log(`   - Total URLs: ${staticPages.length + products.length + professionalPlans.length}`);

  } catch (error) {
    console.error('❌ An error occurred during sitemap generation:', error);
  }
}

generateSitemap();