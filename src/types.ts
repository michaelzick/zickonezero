export type WorksData = {
  thumb: string,
  imgs: Array<string>,
  desc: string,
  header: string,
  group: string;
};

export type Props = {
  worksDataReversed: Array<WorksData>;
};