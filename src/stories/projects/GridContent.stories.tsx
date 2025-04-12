import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { GridContent } from "../../components";
import mockData from "./mockData.json";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Projects",
  component: GridContent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    worksDataReversed: Array<string>,
    onThumbClick: Function,
  },
} as ComponentMeta<typeof GridContent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof GridContent> = (args) => (
  <GridContent {...args} />
);

export const Grid = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Grid.args = {
  worksDataReversed: mockData.reverse(),
};
