import Header from "./Header"
import Footer from "./Footer"
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header></Header>
      <main>{children}</main>
      <Footer></Footer>
    </>
  );
}
