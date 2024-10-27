/* eslint-disable no-unused-vars */
import { Link, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import { useEffect, useState } from "react";
import { Button, Spinner } from "flowbite-react";
import PostCard from "../components/PostCard";

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }

        setPost(data.posts[0]);
        setLikeCount(data.posts[0].numberOfLikes); // Cập nhật số lượng like ban đầu

        const userId = localStorage.getItem("userId");
        const likedFromStorage = JSON.parse(
          localStorage.getItem(`liked-${data.posts[0]._id}-${userId}`)
        );
        const bookmarkedFromStorage = JSON.parse(
          localStorage.getItem(`bookmarked-${data.posts[0]._id}-${userId}`)
        );

        setLiked(likedFromStorage || false);
        setBookmarked(bookmarkedFromStorage || false);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchRecentPosts();
  }, []);

  const handleLikePost = async () => {
    const userId = localStorage.getItem("userId");
    setLikeLoading(true);

    // Cập nhật trạng thái liked và likeCount ngay lập tức
    const newLikedStatus = !liked;
    const newLikeCount = newLikedStatus ? likeCount + 1 : likeCount - 1;

    setLiked(newLikedStatus); // Cập nhật trạng thái liked
    setLikeCount(newLikeCount); // Cập nhật số lượng like ngay lập tức

    // Lưu trạng thái vào localStorage
    localStorage.setItem(
      `liked-${post?._id}-${userId}`,
      JSON.stringify(newLikedStatus)
    );

    try {
      const res = await fetch(`/api/post/like/${post?._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        const data = await res.json();
        // Cập nhật lại likeCount từ phản hồi
        setLikeCount(data.numberOfLikes); // Sử dụng số lượng like từ phản hồi
      } else {
        // Nếu có lỗi, quay lại trạng thái trước đó
        setLiked(liked); // Khôi phục trạng thái liked
        setLikeCount(likeCount); // Khôi phục số lượng like
      }
    } catch (error) {
      console.error("Error liking post:", error);
      // Khôi phục trạng thái nếu có lỗi
      setLiked(liked);
      setLikeCount(likeCount);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleBookmarkPost = async () => {
    const userId = localStorage.getItem("userId");
    setLikeLoading(true);
    try {
      const res = await fetch(`/api/post/bookmark/${post?._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        const data = await res.json();
        setBookmarked(!bookmarked); // Đảo ngược trạng thái bookmarked

        // Lưu trạng thái bookmarked vào localStorage cho người dùng
        localStorage.setItem(
          `bookmarked-${post?._id}-${userId}`,
          JSON.stringify(!bookmarked)
        );
      }
    } catch (error) {
      console.error("Error bookmarking post:", error);
    } finally {
      setLikeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl"></Spinner>
      </div>
    );
  }

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {post && post.category}
        </Button>
      </Link>
      <img
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
        src={post && post.image}
        alt={post && post.title}
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span>{post && (post.content.length / 1000).toFixed(0)} mins read</span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>

      {/* Hiển thị document nếu có */}
      {post && post.document && (
        <div className="p-3 max-w-2xl mx-auto w-full">
          <a
            href={post.document}
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download this document
          </a>
        </div>
      )}

      <div className="flex items-center justify-center w-full space-x-4">
        <button
          onClick={handleLikePost}
          disabled={likeLoading} // Vô hiệu hóa nút khi đang xử lý
          className={`text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${
            liked ? "bg-blue-500 text-white" : ""
          }`}
        >
          {likeLoading ? "Loading..." : liked ? "Liked" : "Like"} ({likeCount})
        </button>

        <button
          onClick={handleBookmarkPost}
          className={`text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${
            bookmarked ? "bg-blue-500 text-white" : ""
          }`}
        >
          {bookmarked ? "Bookmarked" : "Bookmark"}
        </button>
      </div>

      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      <div>
        <CommentSection postId={post._id} />
      </div>
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-x mt-5 ">Recent Articles</h1>
        <div className="flex flex-wrap gap-5 mt-5 justify-center">
          {recentPosts &&
            recentPosts.map((recentPost) => (
              <PostCard key={recentPost._id} post={recentPost} />
            ))}
        </div>
      </div>
    </main>
  );
}
