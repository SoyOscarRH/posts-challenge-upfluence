import { toPlural } from "~/utils/toPlural";

const toNiceName = {
  pin: "Pins from Pinterest",
  instagram_media: "Instagram Media",
  youtube_video: "YouTube Videos",
  article: "Articles",
  tweet: "Tweets",
  facebook_status: "Facebook"
} as Record<string, string>;


function Chart({ name, entries }: { name: string, entries: number | null }) {
  return (
    <article key={name} className="bg-gray-100 p-4 rounded-lg my-4 shadow-sm snap-center flex flex-col items-center">
      {entries != null && (
        <>
          <h2 className="text-2xl font-bold">{toNiceName[name] ?? "Social Media"}</h2>
          <p>{entries} {toPlural('post', entries)} analyzed</p>
        </>
      )}
      <div className="w-[60vw] pt-4">
        <canvas id={name}></canvas>
      </div>
    </article>
  )
}

export default Chart;