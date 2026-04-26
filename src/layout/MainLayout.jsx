import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="container-page">
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;