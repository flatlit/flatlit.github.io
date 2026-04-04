import { type CollectionEntry, getCollection } from "astro:content";

export const ALLOW_UNPUBLISHED = !import.meta.env.PROD;

export const publishedFilter = ({
  data,
}: {
  data: { published?: boolean };
}) => {
  return import.meta.env.PROD ? data.published === true : true;
};

export const articleInPublishedSeriesFilter = (
  publishedSeriesIds: Set<string>,
  { data }: { data: { series?: string } },
) => {
  return import.meta.env.PROD
    ? data.series && publishedSeriesIds.has(data.series)
    : true;
};

export const seriesHasPublishedArticleFilter = (
  publishedSeriesIds: Set<string>,
  { id }: { id: string },
) => {
  return import.meta.env.PROD ? id && publishedSeriesIds.has(id) : true;
};

export const publishedOrder = (
  a: {
    data: { publishedDate: Date };
  },
  b: {
    data: { publishedDate: Date };
  },
) => b.data.publishedDate.valueOf() - a.data.publishedDate.valueOf();

export const titleOrder = (
  a: {
    data: { title: string };
  },
  b: {
    data: { title: string };
  },
) => b.data.title.localeCompare(a.data.title);

export async function findPublishedSeriesIds(): Promise<Set<string>> {
  return await getCollection("series", publishedFilter).then(
    (r) => new Set(r.map((x) => x.id)),
  );
}

export async function findSeriesIdWithPublishedArticles(): Promise<
  Set<string>
> {
  return await getCollection("articles", publishedFilter).then(
    (r) => new Set(r.map((x) => x.data.series)),
  );
}

export async function findSeriesOfArticle(
  article: CollectionEntry<"articles">,
): Promise<CollectionEntry<"series"> | null> {
  return (
    await getCollection("series", (s) => s.id === article.data.series)
  )[0];
}
