export const publishedFilter = ({
  data,
}: {
  data: { published?: boolean };
}) => {
  return import.meta.env.PROD ? data.published === true : true;
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
