import Header from "../components/Header"
import Footer from "../components/Footer"

const MainLayout = ({ children }) => {
  return (
    <div className="container-page flex min-h-dvh flex-col pb-0">
      <Header />
      <main className="flex-1 pt-6">{children}</main>
      <Footer />
    </div>
  )
}

export default MainLayout
