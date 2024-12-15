"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify"; // Sanitize HTML for safety

export default function AdminBlogs() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs");
      if (!res.ok) throw new Error("Failed to fetch blogs");
      const result = await res.json();
      setData(result.data);
    } catch (err) {
      console.error("Error fetching blogs:", err.message);
    } finally {
      setLoading(false);
    }
  }

  const truncateContent = (content) => {
    const sanitized = DOMPurify.sanitize(content);
    return sanitized.length > 250 ? sanitized.slice(0, 250) + "..." : sanitized;
  };

  const handleSeeMore = (id) => {
    router.push(`/blogs/${id}`);
  };

  return (
    <div className="mt-28 p-4">
      <h2 className="text-2xl font-bold mb-6 text-center pt-10 text-black">
        Blogs
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          data.map((item) => (
            <div
              key={item._id}
              className="p-4 bg-white border rounded-lg shadow-md"
            >
              <div className="text-center mb-4">
                <span className="bg-blue-100 text-blue-500 text-xs font-semibold py-1 px-3 rounded-full">
                  {item.kategori}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-5 text-center">
                {item.title}
              </h3>
              <h4 className="text-sm text-gray-500 mb-10 text-center">
                {item.subTitle}
              </h4>
              <div
                className="text-sm text-gray-700 mb-4"
                dangerouslySetInnerHTML={{
                  __html: truncateContent(item.content),
                }}
              ></div>
              <div className="mt-4 text-center">
                <button
                  onClick={() => handleSeeMore(item._id)}
                  className="bg-blue-800 text-white py-2 px-4 rounded-lg hover:bg-blue-300 hover:cursor-pointer transition-colors"
                >
                  See More
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
