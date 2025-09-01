import worksData from './worksData.json';

const getWorksData = async () => {
  try {
    // For static export, directly use the imported data instead of making HTTP requests
    return [...worksData].reverse();
  } catch (error) {
    console.error('Error processing works data:', error);
    return [];
  }
};

export default getWorksData;
