import { Footer } from "@/components/marketing/Footer";
import { Navbar } from "@/components/marketing/Navbar";

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
