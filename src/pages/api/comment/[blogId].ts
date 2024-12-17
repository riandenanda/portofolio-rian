import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { commentId } = req.query;

  // Validate `commentId`
  if (typeof commentId !== "string") {
    res.status(400).json({ error: "Invalid commentId parameter" });
    return;
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);

    switch (req.method) {
      case "DELETE":
        try {
          // Delete the comment based on commentId only
          const result = await db.collection("comments").deleteOne({
            _id: new ObjectId(commentId),
          });

          if (result.deletedCount === 1) {
            res.status(200).json({ message: "Comment deleted successfully" });
          } else {
            res.status(404).json({ error: "Comment not found" });
          }
        } catch (error) {
          console.error("Error deleting comment:", error);
          res.status(500).json({ error: "Failed to delete comment" });
        }
        break;

      default:
        res.setHeader("Allow", ["DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Failed to connect to the database" });
  }
}
