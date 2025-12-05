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
    worksDataReversed: { control: "object" },
    onThumbClick: { action: "clicked" },
  },
} as Meta<typeof GridContent>;

type GridContentStoryProps = Omit<React.ComponentProps<typeof GridContent>, "onThumbClick">;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof GridContent> = (args: GridContentStoryProps) => (
  <GridContent {...args} onThumbClick={onThumbClick} />
);

export const Grid = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Grid.args = {
  worksDataReversed: mockData.reverse(),
};
