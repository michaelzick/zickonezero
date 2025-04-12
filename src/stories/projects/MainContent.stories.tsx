import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { MainContent } from "../../components";

import { Provider } from "react-redux";
import { store } from "../../store";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Projects",
  component: MainContent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof MainContent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof MainContent> = () => (
  <Provider store={store}>
    <MainContent />
  </Provider>
);

export const Main = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Main.args = {};
