const getWorksData = async () => {
  const fetchData = await fetch(
    `${process.env.NODE_ENV === 'production' ?
      'https://www.zickonezero.com' :
      'http://localhost:3000'}/api/handler`
  );
  const dataJson = await fetchData.json();
  const { worksData } = dataJson;
  return worksData.reverse();
};

export default getWorksData;
