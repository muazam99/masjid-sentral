import Header from "@/components/Header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};

export default Layout;
