// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import worksData from './worksData.json';

type Data = {
  name: string;
  worksData: Array<object>;
};

const apiHander = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  res.status(200).json({ name: 'John Doe', worksData });
};

export default apiHander;
