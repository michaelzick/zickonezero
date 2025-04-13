import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import { GridContent } from "../../components";
import mockData from "./mockData.json";

const onThumbClick = (e: React.MouseEvent, isManagedWork: boolean) => {
  // Handle thumbnail click event
  console.log("Thumbnail clicked!", e, isManagedWork);
};

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Projects",
  component: GridContent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    worksDataReversed: Array<string>,
    onThumbClick: Function,
  },
} as Meta<typeof GridContent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof GridContent> = (args) => (
  <GridContent {...args} onThumbClick={onThumbClick} />
);

export const Grid = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Grid.args = {
  worksDataReversed: mockData.reverse(),
};
