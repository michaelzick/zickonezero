export type WorksData = {
  thumb: string,
  imgs: Array<string>,
  desc: string,
  header: string,
  group: string;
  link?: string;
  linkOut?: boolean;
};

export type WorksDataType = {
  worksDataReversed: Array<WorksData>;
};

export type ShowMobileMenuType = {
  isMobileMenuShown: boolean;
};
