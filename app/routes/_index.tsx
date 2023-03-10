import type { Post } from "~/schema/post";
import type { BubbleChart } from "~/utils/chart";

import { useCallback, useEffect } from "react";

import useOnNewPost from "~/utils/hooks/useOnNewPost";
import useStateWithCallbackAfter from "~/utils/hooks/useStateWithCallbackAfter";
import createChart from "~/utils/chart";

type PostChartData = { chart: BubbleChart, entries: number }

const toNiceName = {
  pin: "Pins from Pinterest",
  instagram_media: "Instagram Media",
  youtube_video: "YouTube Videos",
  article: "Articles",
  tweet: "Tweets",
  facebook_status: "Facebook"
} as Record<string, string>;

function toPlural(word: string, count: number) {
  return count === 1 ? word : word + 's';
}

export default function Index() {
  const [charts, setCharts] = useStateWithCallbackAfter<Record<string, PostChartData | null>>({});

  useEffect(function removeAfterUnMount() {
    return function cleanup() {
      Object
        .values(charts)
        .forEach(item => item?.chart.destroy());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addNew = useCallback((post: Post, { chart, entries }: PostChartData) => {
    chart.data.datasets[0].data = chart.data.datasets[0].data
      .map(({ x, y, r }) => ({ x, y, r: y === post.day && x === post.hour ? r + 1 : r }));
    chart.update();

    return { chart, entries: entries + 1 };
  }, []);

  useOnNewPost(post => {
    const item = charts[post.type];
    if (item) {
      setCharts(others => ({ ...others, [post.type]: addNew(post, item) }));
    } else {
      setCharts(others => ({ ...others, [post.type]: null }), function addOnceCreated() {
        const newItem = addNew(post, { chart: createChart(post.type), entries: 0 });
        setCharts(charts => ({ ...charts, [post.type]: newItem }));
      });
    }
  });

  const moreThanOne = Object.entries(charts).length > 1;
  const totalPosts = Object.values(charts).reduce((acc, item) => acc + (item?.entries ?? 0), 0);

  return (
    <main className="flex flex-col items-center gap-8">
      <h1 className="text-3xl font-bold">
        Commit activity by day and hour
      </h1>
      <p className="text-center text-xl">
        This page is updated in real time with the latest posts from the post processed on Upfluence
        <br />
        Until now we have analyzed {totalPosts} {toPlural('post', totalPosts)}.
      </p>
      <section className={`flex flex-row items-center gap-8 overflow-scroll w-10/12 snap-proximity snap-x py-4 ${moreThanOne ? 'justify-start px-[10vw]' : 'justify-center'}`}>
        {Object.entries(charts)
          .map(([name, item]) => (
            <article key={name} className="bg-gray-100 p-4 rounded-lg my-4 shadow-sm snap-center flex flex-col items-center">
              {item && (
                <>
                  <h2 className="text-2xl font-bold">{toNiceName[name] ?? "Social Media"}</h2>
                  <p>{item.entries} {toPlural('post', item.entries)} analyzed</p>
                </>
              )}
              <div className="w-[60vw] pt-4">
                <canvas id={name}></canvas>
              </div>
            </article>
          ))}
      </section>
    </main>
  );
}
