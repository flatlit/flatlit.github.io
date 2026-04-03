import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";
import { collections } from "../content.config";
import { publishedFilter, publishedOrder } from "../utils";

export async function GET(context) {
  const allCollections = Object.keys(collections).map((s) =>
    getCollection(s, publishedFilter),
  );
  const items = (await Promise.all(allCollections).then((x) => x.flat())).sort(
    publishedOrder,
  );

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: items.map((item) => ({
      ...item.data,
      link: `/${item.collection}/${item.id}/`,
    })),
  });
}
