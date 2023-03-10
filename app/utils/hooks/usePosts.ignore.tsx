import type { Post } from "~/schema/post";

import { useEffect, useState } from "react";
import { useEventSource } from "remix-utils";
import { PostSchema } from "~/schema/post";

export default function usePosts() {
  const postData = useEventSource("https://stream.upfluence.co/stream");
  const [posts, setPosts] = useState([] as Array<Post>);

  useEffect(() => {
    const postObject = JSON.parse(postData ?? 'null');
    const result = PostSchema.safeParse(postObject);
    if (!result.success) return

    const post = result.data;
    const existingPost = posts.at(-1)?.id === post.id;
    if (existingPost) return;

    setPosts([...posts, post]);
  }, [postData, posts]);

  return posts;
}