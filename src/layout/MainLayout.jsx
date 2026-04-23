import Header from "../components/Header"

const MainLayout = ({ children }) => {
  return (
    <div className="container-page">
      <Header />
      <main>{children}</main>
    </div>
  )
}

export default MainLayout
