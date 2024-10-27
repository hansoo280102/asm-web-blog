import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashBookmark() {
  const { currentUser } = useSelector((state) => state.user);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");

  useEffect(() => {
    const fetchBookmarkedPosts = async () => {
      try {
        const url = `/api/post/getbookmarkedposts?userId=${currentUser._id}`;
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) {
          setBookmarkedPosts(data);
          if (data.length < 9) {
            setShowMore(false);
          }
        } else {
          console.error("Failed to fetch bookmarked posts:", data.message);
        }
      } catch (error) {
        console.log("Error fetching bookmarked posts:", error.message);
      }
    };

    if (currentUser) {
      fetchBookmarkedPosts();
    }
  }, [currentUser]);

  const handleShowMore = async () => {
    try {
      const startIndex = bookmarkedPosts.length;
      const url = `/api/post/getbookmarkedposts?userId=${currentUser._id}&startIndex=${startIndex}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setBookmarkedPosts((prevPosts) => [...prevPosts, ...data]);
        if (data.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteBookmark = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/post/removebookmark/${postIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setBookmarkedPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {bookmarkedPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Uploaded</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {bookmarkedPosts.map((post) => (
                <Table.Row
                  key={post._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <p>You have no bookmarked posts yet.</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to remove this bookmark?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteBookmark}>
                Yes, I&apos;m sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
