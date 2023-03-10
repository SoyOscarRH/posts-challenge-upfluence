import type { Post } from "~/schema/post";

import { useEffect, useRef } from "react";
import { PostSchema } from "~/schema/post";

function useOnNewPost(callback: (post: Post) => void) {
  const currentCallback = useRef(callback);
  useEffect(() => {
    currentCallback.current = callback;
  }, [callback]);

  useEffect(
    function setUpSSE() {
      const eventSource = new EventSource("https://stream.upfluence.co/stream");
      eventSource.addEventListener("message", (event) => {
        const postObject = JSON.parse(event.data ?? "null");
        const result = PostSchema.safeParse(postObject);
        if (!result.success) return;

        const post = result.data;
        currentCallback.current(post);
      });

      return function cleanup() {
        eventSource.close();
      };
    },
    []
  );
};

export default useOnNewPost;