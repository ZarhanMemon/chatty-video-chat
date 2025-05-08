import Sidebar from "../components/SideBar.jsx";

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="min-h-screen flex flex-col">


      {/* Layout below Navbar: Sidebar + Main */}
      <div className="flex flex-1">
        {showSidebar && (
            <Sidebar />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
