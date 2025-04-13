import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import { MainContent } from "../../components";

import { Provider } from "react-redux";
import { store } from "../../store";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Projects",
  component: MainContent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as Meta<typeof MainContent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof MainContent> = () => (
  <Provider store={store}>
    <MainContent />
  </Provider>
);

export const Main = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Main.args = {};
