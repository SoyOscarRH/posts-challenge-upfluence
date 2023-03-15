import type { Post } from "~/schema/post";
import type { BubbleChart } from "~/utils/chart";

import { useCallback, useEffect } from "react";

import useOnNewPost from "~/utils/hooks/useOnNewPost";
import useStateWithCallbackAfter from "~/utils/hooks/useStateWithCallbackAfter";
import createChart from "~/utils/chart";
import { toPlural } from "../utils/toPlural";
import Chart from "~/component/Chart";

type PostChartData = { chart: BubbleChart, entries: number }

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
    const data = chart.data.datasets[0].data;
    for (let i = 0; i < data.length; i++) {
      const point = data[i];
      if (point.x === post.hour && point.y === post.day) {
        point.r += 1;
        chart.show(0, i);
        break;
      }
    }
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
        {Object.entries(charts).map(([name, item]) => (
            <Chart key={name} name={name} entries={item?.entries ?? null} />
          ))}
      </section>
    </main>
  );
}
