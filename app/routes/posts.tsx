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

  const sortOption: { [key: string]: SortOrder } = { [sortBy]: sortBy !== "caption" ? -1 : 1 }; // default to newest

  const query: any = { caption: { $regex: q, $options: "i" } }; // case-insensitive search
  if (filterTag) {
    query.tags = { $in: [filterTag] };
  }
  const posts = await Post.find(query).sort(sortOption).populate("user");

  const uniqueTags = await Post.aggregate([
    // Unwind the array of tags to make each tag a separate document
    { $unwind: "$tags" },
    // Group by the tag to eliminate duplicates
    { $group: { _id: "$tags" } },
    // Optionally, you might want to sort the tags alphabetically
    { $sort: { _id: 1 } },
    // Project the tag field to be the only field in the document
    { $project: { tag: "$_id", _id: 0 } }
  ]);

  // Extract just the tags from the results
  const tags = uniqueTags.map(tagDoc => tagDoc.tag);

  return Response.json({ posts, tags, q, sortBy, filterTag });
}

export default function PostsPage({
  loaderData
}: {
  loaderData: { posts: PostType[]; tags: string[]; q: string; sortBy: string; filterTag: string };
}) {
  console.log(loaderData);

  const { posts, tags, q, sortBy, filterTag } = loaderData;
  const submit = useSubmit();

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
