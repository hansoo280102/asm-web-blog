import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess, updateBookmarks } from "../redux/user/userSlice"; // Import action

export default function OAuth() {
  const dispatch = useDispatch();
  const auth = getAuth(app);
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultFromGoogle.user.displayName,
          email: resultFromGoogle.user.email,
          photoURL: resultFromGoogle.user.photoURL,
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data)); // Cập nhật trạng thái người dùng
        navigate("/"); // Chuyển hướng về trang chính
      } else if (data.error === "Account already exists") {
        alert("Account already exists");
        const userId = data.userId; // Giả sử bạn có userId trong response
        fetchBookmarks(userId); // Gọi hàm để lấy bookmarks cho user
      } else if (data.error === "Account does not exist") {
        alert("Account does not exist");
      } else {
        alert("Sign in failed! Please try again.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBookmarks = async (userId) => {
    try {
      const res = await fetch(`/api/post/getbookmarkedposts?userId=${userId}`);
      const bookmarks = await res.json();
      if (res.ok) {
        dispatch(updateBookmarks(bookmarks)); // Cập nhật bookmarks
      }
    } catch (error) {
      console.log("Error fetching bookmarks:", error);
    }
  };

  const location = useLocation();
  const isSignIn = location.pathname === "/sign-in";
  const isSignUp = location.pathname === "/sign-up";

  return (
    <Button
      type="button"
      gradientDuoTone="pinkToOrange"
      outline
      onClick={handleGoogleClick}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      {isSignIn && "Sign in with Google"}
      {isSignUp && "Sign up with Google"}
    </Button>
  );
}
