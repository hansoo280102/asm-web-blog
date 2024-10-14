/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function PostPage() {
  const { postSlug } = useParams();

  useEffect(() => {
    console.log(postSlug);
  }, [postSlug]);
  return <div>PostPage</div>;
}
