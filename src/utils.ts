export const publishedFilter = ({
  data,
}: {
  data: { published?: boolean };
}) => {
  return import.meta.env.PROD ? data.published === true : true;
};
