function MainLayout({ children }) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Nội dung của từng trang */}
        {children}
      </div>
    );
  }
  
  export default MainLayout;