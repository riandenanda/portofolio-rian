import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(
  req: NextRequest,
  { params }: { params: { replycommentId: string } }
) {
  try {
    const { reply } = await req.json(); // Extract 'reply' from the request body

    if (!reply || reply.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Reply cannot be empty" },
        { status: 400 }
      );
    }

    // Connect to the MongoDB database
    const client = await clientPromise;
    const db = client.db();

    const commentId = params.replycommentId; // Get the commentId from the URL params

    // Update the comment by adding the reply to the 'replies' field
    const result = await db.collection("comments").updateOne(
      { _id: new ObjectId(commentId) },
      {
        $push: { replies: { reply, date: new Date() } }, // Push the reply with a timestamp
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Failed to add reply" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Reply added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while replying to comment:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
