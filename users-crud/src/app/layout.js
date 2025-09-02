"use client";

import { Provider } from "react-redux";
import { store, persistor } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-100">
      <body className="d-flex flex-column min-vh-100">
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Header />
            <main className="container my-4 flex-grow-1">{children}</main>
            <Footer />
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
