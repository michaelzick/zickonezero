import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import { Provider } from "react-redux";
import { store } from "../../store";

import { TopNavContent } from "../../components";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Nav",
  component: TopNavContent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as Meta<typeof TopNavContent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof TopNavContent> = () => (
  <Provider store={store}>
    <TopNavContent />
  </Provider>
);

export const TopNav = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
TopNav.args = {};
