const getWorksData = async () => {
  try {
    const fetchData = await fetch(
      `${process.env.NODE_ENV === 'production' ?
        'https://www.zickonezero.com' :
        'http://localhost:3000'}/api`
    );
    const dataJson = await fetchData.json();
    const { worksData } = dataJson;
    return worksData.reverse();
  } catch (e) {
    return [{ desc: 'There was a problem with the data.' }];
  }
};

export default getWorksData;
