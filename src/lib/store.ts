// File: lib/store.js

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/users/userSlice";
import productReducer from "./features/products/productSlice";
import professionalPlanReducer from "./features/professional/professionalPlanSlice";
import customizationReducer from "./features/customization/customizationSlice";
import standardRequestReducer from "./features/standardRequest/standardRequestSlice";
import premiumRequestReducer from "./features/premiumRequest/premiumRequestSlice";
import inquiryReducer from "./features/corporateInquiries/inquirySlice";
import inquiryReducer1 from "./features/inquiries/inquirySlice";
import cartReducer from "./features/cart/cartSlice";
import wishlistReducer from "./features/wishlist/wishlistSlice";
import orderReducer from "./features/orders/orderSlice";
import adminReducer from "./features/admin/adminSlice";
import blogReducer from "./features/blog/blogSlice";
import galleryReducer from "./features/gallery/gallerySlice";
import videoReducer from "./features/videos/videoSlice";
import packageReducer from "./features/packages/packageSlice";
import professionalOrderReducer from "./features/professional/professionalOrderSlice";

import sellerProductReducer from "./features/seller/sellerProductSlice";
import sellerinquiryReducer from "./features/sellerinquiries/sellerinquirySlice";
import sellerReducer from "./features/seller/sellerProductSlice";
import mediaReducer from "./features/media/mediaSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    products: productReducer,
    professionalPlans: professionalPlanReducer,
    customization: customizationReducer,
    standardRequests: standardRequestReducer,
    premiumRequests: premiumRequestReducer,
    corporateInquiries: inquiryReducer,
    inquiries: inquiryReducer1,
    cart: cartReducer,
    wishlist: wishlistReducer,
    orders: orderReducer,
    admin: adminReducer,
    blog: blogReducer,
    gallery: galleryReducer,
    videos: videoReducer,
    packages: packageReducer,
    professionalOrders: professionalOrderReducer,
    seller: sellerReducer,
    sellerProducts: sellerProductReducer,
    sellerInquiries: sellerinquiryReducer,
    media: mediaReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
