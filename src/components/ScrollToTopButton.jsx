import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa6";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Hàm xử lý cuộn trang
  // Hàm xử lý cuộn trang
  const toggleVisibility = () => {
    setIsVisible(window.scrollY !== 0);
  };

  // Hàm cuộn trang lên đầu
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-5 right-5 p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
      >
        <FaArrowUp />
      </button>
    )
  );
}
