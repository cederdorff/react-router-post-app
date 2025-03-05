import { type SortOrder } from "mongoose";
import type { FormEvent } from "react";
import { Form, Link, useSubmit } from "react-router";
import PostCard from "~/components/PostCard";
import Post, { type PostType } from "~/models/Post";
import { authenticateUser } from "~/services/auth.server";
import type { Route } from "./+types/posts";

export async function loader({ request }: Route.LoaderArgs) {
  await authenticateUser(request);

  const url = new URL(request.url);
  const q = url.searchParams.get("q") || "";
  const sortBy = url.searchParams.get("sort-by") || "createdAt";
  const filterTag = url.searchParams.get("tag") || "";
  // Define sorting option based on query parameter
  const sortOption: { [key: string]: SortOrder } = { [sortBy]: sortBy !== "caption" ? -1 : 1 }; // Default to newest first

  // Construct query for case-insensitive search by caption
  const query: any = { caption: { $regex: q, $options: "i" } };
  if (filterTag) {
    query.tags = { $in: [filterTag] };
  }

  // Fetch posts based on search criteria, sorting, and user population
  const posts = await Post.find(query).sort(sortOption).populate("user");

  // Fetch unique tags from posts
  const uniqueTags = await Post.aggregate([
    { $unwind: "$tags" }, // Unwind tags array to get individual tags
    { $group: { _id: "$tags" } }, // Group by tag to remove duplicates
    { $sort: { _id: 1 } }, // Sort tags alphabetically
    { $project: { tag: "$_id", _id: 0 } } // Project only tag field
  ]);

  // Extract just the tags from the results
  const tags = uniqueTags.map(tagDoc => tagDoc.tag);

  // Return posts, tags, search query, sorting option, and filter tag
  return Response.json({ posts, tags, q, sortBy, filterTag });
}

// ==================== Posts Page Component ==================== //
// Displays posts with search, filter, and sorting functionality
export default function PostsPage({
  loaderData
}: {
  loaderData: { posts: PostType[]; tags: string[]; q: string; sortBy: string; filterTag: string };
}) {
  const { posts, tags, q, sortBy, filterTag } = loaderData;
  const submit = useSubmit();

  // Handles search, filtering, and sorting form submission
  function handleSearchFilterAndSort(event: FormEvent) {
    const isFirstSearch = !q;
    submit(event.currentTarget as HTMLFormElement, {
      replace: !isFirstSearch
    });
  }

  return (
    <main className="page">
      <Form className="grid-filter" id="search-form" role="search" onChange={handleSearchFilterAndSort}>
        <label>
          Search by caption{" "}
          <input aria-label="Search by caption" defaultValue={q} placeholder="Search" type="search" name="q" />
        </label>
        <label>
          Filter by tag{" "}
          <select name="tag" defaultValue={filterTag}>
            <option value="">select tag</option>
            {tags.map(tag => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>
        <label>
          Sort by{" "}
          <select name="sort-by" defaultValue={sortBy}>
            <option value="createdAt">newest</option>
            <option value="caption">caption</option>
            <option value="likes">most likes</option>
          </select>
        </label>
      </Form>
      <section className="grid">
        {posts.map(post => (
          <Link key={post._id.toString()} className="post-link" to={`/posts/${post._id}`}>
            <PostCard post={post} />
          </Link>
        ))}
      </section>
    </main>
  );
}
