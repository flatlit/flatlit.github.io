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
