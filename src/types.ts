export type WorksData = {
  thumb: string,
  imgs: Array<string>,
  desc: string,
  header: string,
  group: string;
};

export type WorksDataType = {
  worksDataReversed: Array<WorksData>;
};

export type ShowMobileMenuType = {
  isMobileMenuShown: Boolean;
};
