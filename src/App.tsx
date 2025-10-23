import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { store } from "./lib/store";
import ScrollToTop from "@/components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import ServicePage from "./pages/ServicesPage";
import AboutUs from "@/components/AboutUs";
import ContactUs from "@/pages/ContactUs";
import Register from "@/pages/MultiRoleRegisterPage";
import Login from "@/pages/Login";
import BrowseProductsPage from "./pages/BrowseProductsPage";
import ThreeDPlansPage from "./pages/ThreeDPlansPage";
import InteriorDesignsPage from "./pages/InteriorDesignsPage";
import ConstructionProductsPage from "./pages/ConstructionProductsPage";
import CustomizeRequestPage from "./pages/CustomizeRequestPage";
import CareersPage from "./pages/CareersPage";
import ApplicationPage from "./pages/ApplicationPage";
import DownloadsPage1 from "./pages/DownloadsPage";
import BlogsPage from "./pages/BlogsPage";
import SingleBlogPostPage from "./pages/SingleBlogPostPage";
import ThankYou from "./pages/ThankYou";
import InteriorDesignRequestPage from "./pages/InteriorDesignRequestPage";
import ThreeDElevationPage from "./pages/ThreeDElevationPage";
import CorporateInquiryPage from "./pages/CorporateInquiryPage";
import BrandPartnersSection from "./components/BrandPartnersSection";
import BookingPage from "./pages/BookingPage";
import PremiumBookingPage from "./pages/PremiumBookingPage";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PaymentPolicy from "./pages/PaymentPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import ThreeDWalkthroughPage from "./pages/ThreeDVideoWalkthorugh";
import ProfessionalProductDetail from "./pages/ProfessionalProduct";
import GalleryPage from "./pages/GalleryPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import DashboardLayout from "./pages/Userdashboard/DashboardLayout";
import DashboardPage from "./pages/Userdashboard/DashboardPage";
import OrdersPage from "./pages/Userdashboard/OrdersPage";
import DownloadsPage from "./pages/Userdashboard/DownloadsPage";
import AddressesPage from "./pages/Userdashboard/AddressesPage";
import AccountDetailsPage from "./pages/Userdashboard/AccountDetailsPage";
import BlackScreenshotGuard from "./components/BlackScreenshotGuard";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AllProductsPage from "./pages/admin/products/AllProductsPage";
import AddProductPage from "./pages/admin/products/AddProductPage";
import AllUsersPage from "./pages/admin/users/AllUsersPage";
import AddNewUserPage from "./pages/admin/users/AddNewUserPage";
import AdminProfilePage from "./pages/admin/ProfilePage";
import AdminOrdersPage from "./pages/admin/OrdersPage";
import CustomersPage from "./pages/admin/CustomersPage";
import ReportsPage from "./pages/admin/ReportsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import AdminCustomizationRequestsPage from "./pages/admin/AdminCustomizationRequestsPage";
import StandardRequestsPage from "./pages/admin/StandardRequestsPage";
import PremiumRequestsPage from "./pages/admin/PremiumRequestsPage";
import AllInquiriesPage from "./pages/admin/AllInquiriesPage";
import AllInquiriesSCPage from "./pages/admin/AllInquiriesSCPage";
import AdminBlogsPage from "./pages/admin/AdminBlogsPage";
import AdminAddEditBlogPage from "./pages/admin/AdminAddEditBlogPage";
import AddGalleryImagePage from "./pages/admin/AddGalleryImagePage";
import ManageGalleryPage from "./pages/admin/ManageGalleryPage";
import VideoUploadPage from "./pages/admin/VideoUploadPage";
import PackageEditPage from "./pages/admin/packages/PackageEditPage";
import PackageListPage from "./pages/admin/packages/PackageListPage";
import SellerInquirypage from "./pages/admin/sellerEnquirypage";
import ProfessionalLayout from "./pages/professional/ProfessionalLayout";
import ProfessionalDashboardPage from "./pages/professional/DashboardPage";
import MyProductsPage from "./pages/professional/MyProductsPage";
import AddProductPageProf from "./pages/professional/AddProductPage";
import ProfilePageProf from "./pages/professional/ProfilePage";
import ProfessionalOrdersPage from "./pages/professional/OrdersPage";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import FloatingCurrencySwitcher from "./components/FloatingCurrencySwitcher";
import SellerLayout from "./pages/seller/SellerLayout";
import SellerDashboardPage from "./pages/seller/DashboadPage";
import SellerProductsPage from "./pages/seller/MyProductpage";
import SellerAddproduct from "./pages/seller/addProduct";
import SellerProfilePage from "./pages/seller/profile";
import SellerInquiryPage from "./pages/seller/SellerInquiriesPage";
import MediaPage from "./pages/admin/MediaPage";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <HelmetProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <CartProvider>
            <WishlistProvider>
              <CurrencyProvider>
                <TooltipProvider>
                  <BlackScreenshotGuard>
                    <Toaster />
                    <Sonner />
                    <ScrollToTop />
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/products" element={<Products />} />
                      <Route
                        path="/product/:slug"
                        element={<ProductDetail />}
                      />
                      <Route
                        path="/professional-plan/:slug"
                        element={<ProductDetail />}
                      />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route
                        path="/order-success/:orderId"
                        element={<OrderSuccessPage />}
                      />
                      <Route path="/thank-you" element={<ThankYou />} />
                      <Route path="/services" element={<ServicePage />} />
                      <Route path="/about" element={<AboutUs />} />
                      <Route path="/download" element={<DownloadsPage1 />} />
                      <Route path="/careers" element={<CareersPage />} />
                      <Route path="/contact" element={<ContactUs />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/apply" element={<ApplicationPage />} />
                      <Route path="/terms" element={<TermsAndConditions />} />
                      <Route
                        path="/privacy-policy"
                        element={<PrivacyPolicy />}
                      />
                      <Route
                        path="/payment-policy"
                        element={<PaymentPolicy />}
                      />
                      <Route path="/refund-policy" element={<RefundPolicy />} />
                      <Route path="/blogs" element={<BlogsPage />} />
                      <Route
                        path="/blog/:slug"
                        element={<SingleBlogPostPage />}
                      />
                      <Route
                        path="/category/:categoryName"
                        element={<BrowseProductsPage />}
                      />
                      <Route
                        path="/plans/:regionName"
                        element={<BrowseProductsPage />}
                      />
                      <Route
                        path="/floor-plans"
                        element={<BrowseProductsPage />}
                      />
                      <Route path="/3D-plans" element={<ThreeDPlansPage />} />
                      <Route
                        path="/interior-designs"
                        element={<InteriorDesignsPage />}
                      />
                      <Route
                        path="/house-designs-products"
                        element={<ConstructionProductsPage />}
                      />
                      <Route
                        path="/customize/floor-plans"
                        element={<CustomizeRequestPage />}
                      />
                      <Route
                        path="/customize/interior-designs"
                        element={<InteriorDesignRequestPage />}
                      />
                      <Route
                        path="/customize/3d-elevation"
                        element={<ThreeDElevationPage />}
                      />
                      <Route
                        path="/customize/3d-video-walkthrough"
                        element={<ThreeDWalkthroughPage />}
                      />
                      <Route
                        path="/corporate-inquiry/:packageType"
                        element={<CorporateInquiryPage />}
                      />
                      <Route
                        path="/brand-partners"
                        element={<BrandPartnersSection />}
                      />
                      <Route path="/booking-form" element={<BookingPage />} />
                      <Route
                        path="/premium-booking-form"
                        element={<PremiumBookingPage />}
                      />
                      <Route path="/gallery" element={<GalleryPage />} />

                      <Route
                        element={
                          <ProtectedRoute allowedRoles={["user", "admin"]} />
                        }
                      >
                        <Route path="/dashboard" element={<DashboardLayout />}>
                          <Route index element={<DashboardPage />} />
                          <Route path="orders" element={<OrdersPage />} />
                          <Route path="downloads" element={<DownloadsPage />} />
                          <Route path="addresses" element={<AddressesPage />} />
                          <Route
                            path="account-details"
                            element={<AccountDetailsPage />}
                          />
                        </Route>
                      </Route>

                      <Route
                        element={
                          <ProtectedRoute
                            allowedRoles={["professional", "admin"]}
                          />
                        }
                      >
                        <Route
                          path="/professional"
                          element={<ProfessionalLayout />}
                        >
                          <Route
                            index
                            element={<ProfessionalDashboardPage />}
                          />
                          <Route
                            path="my-products"
                            element={<MyProductsPage />}
                          />
                          <Route
                            path="my-orders"
                            element={<ProfessionalOrdersPage />}
                          />
                          <Route
                            path="add-product"
                            element={<AddProductPageProf />}
                          />
                          <Route path="profile" element={<ProfilePageProf />} />
                        </Route>
                      </Route>

                      <Route
                        element={
                          <ProtectedRoute allowedRoles={["seller", "admin"]} />
                        }
                      >
                        <Route path="/seller" element={<SellerLayout />}>
                          <Route index element={<SellerDashboardPage />} />
                          <Route
                            path="products"
                            element={<SellerProductsPage />}
                          />
                          <Route
                            path="products/add"
                            element={<SellerAddproduct />}
                          />
                          <Route
                            path="profile"
                            element={<SellerProfilePage />}
                          />
                          <Route
                            path="inquiries"
                            element={<SellerInquiryPage />}
                          />
                        </Route>
                      </Route>

                      <Route
                        element={<ProtectedRoute allowedRoles={["admin"]} />}
                      >
                        <Route path="/admin" element={<AdminLayout />}>
                          <Route index element={<AdminDashboardPage />} />
                          <Route
                            path="products"
                            element={<AllProductsPage />}
                          />
                          <Route
                            path="products/add"
                            element={<AddProductPage />}
                          />
                          <Route path="orders" element={<AdminOrdersPage />} />
                          <Route path="customers" element={<CustomersPage />} />
                          <Route path="reports" element={<ReportsPage />} />
                          <Route path="settings" element={<SettingsPage />} />
                          <Route path="users" element={<AllUsersPage />} />
                          <Route
                            path="users/add"
                            element={<AddNewUserPage />}
                          />
                          <Route
                            path="profile"
                            element={<AdminProfilePage />}
                          />
                          <Route
                            path="gallery"
                            element={<ManageGalleryPage />}
                          />
                          <Route path="media" element={<MediaPage />} />
                          <Route
                            path="seller-enquiries"
                            element={<SellerInquirypage />}
                          />
                          <Route
                            path="gallery/add"
                            element={<AddGalleryImagePage />}
                          />
                          <Route
                            path="packages"
                            element={<PackageListPage />}
                          />
                          <Route
                            path="packages/add"
                            element={<PackageEditPage />}
                          />
                          <Route
                            path="packages/edit/:id"
                            element={<PackageEditPage />}
                          />
                          <Route
                            path="standard-requests"
                            element={<StandardRequestsPage />}
                          />
                          <Route
                            path="premium-requests"
                            element={<PremiumRequestsPage />}
                          />
                          <Route
                            path="customization-requests"
                            element={<AdminCustomizationRequestsPage />}
                          />
                          <Route
                            path="inquiries"
                            element={<AllInquiriesPage />}
                          />
                          <Route
                            path="inquiries-sc"
                            element={<AllInquiriesSCPage />}
                          />
                          <Route path="blogs" element={<AdminBlogsPage />} />
                          <Route
                            path="blogs/add"
                            element={<AdminAddEditBlogPage />}
                          />
                          <Route
                            path="blogs/edit/:slug"
                            element={<AdminAddEditBlogPage />}
                          />
                          <Route
                            path="addvideos"
                            element={<VideoUploadPage />}
                          />
                        </Route>
                      </Route>

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <FloatingCurrencySwitcher />
                  </BlackScreenshotGuard>
                </TooltipProvider>
              </CurrencyProvider>
            </WishlistProvider>
          </CartProvider>
        </QueryClientProvider>
      </Provider>
    </HelmetProvider>
  </BrowserRouter>
);
export default App;
