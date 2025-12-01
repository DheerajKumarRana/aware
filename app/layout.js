import { Lato, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/cart-context";
import { WishlistProvider } from "@/components/wishlist/wishlist-context";
import CartDrawer from "@/components/cart/CartDrawer";
import { AuthProvider } from "@/components/auth/auth-context";
import LoginModal from "@/components/auth/LoginModal";

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: '--font-lato'
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: '--font-montserrat'
});

export const metadata = {
  title: "Aware - Elevated Essentials",
  description: "Modern clothing for the conscious creator.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${lato.variable} ${montserrat.variable}`}>
      <body>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Header />
              <CartDrawer />
              <LoginModal />
              {children}
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
