import type { LoaderArgs } from "@remix-run/node";

import { eventStream } from "remix-utils";
import EventSourcePolyfill from "eventsource"
import { PostSchema } from "~/schema/post";


export async function loader({ request }: LoaderArgs) {
  const source = new EventSourcePolyfill("https://stream.upfluence.co/stream");

  return eventStream(request.signal, function setup(send) {
    source.addEventListener("message", ({ data }) => {
      const postObject = JSON.parse(data ?? 'null');
      const result = PostSchema.safeParse(postObject);
      if (!result.success) return

      send({ data: JSON.stringify(result.data) });
    });

    return function clear() { source.close(); };
  });
}