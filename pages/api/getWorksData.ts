const getWorksData = async () => {
  try {
    const fetchData = await fetch(
      `${process.env.NODE_ENV === 'production' ?
        'https://www.zickonezero.com' :
        'http://localhost:3000'}/api`
    );
    console.log(process.env.NODE_ENV)
    const dataJson = await fetchData.json();
    const { worksData } = dataJson;
    return worksData.reverse();
  } catch (error) {
    return [{ error }];
  }
};

export default getWorksData;
