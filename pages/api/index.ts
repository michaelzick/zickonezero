// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import worksData from './worksData.json';

type Data = {
  worksData: Array<object>;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  res.status(200).json({ worksData });
};

export default handler;
