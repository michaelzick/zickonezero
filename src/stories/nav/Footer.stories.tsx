import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import { FooterContent } from "../../components";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Nav",
  component: FooterContent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as Meta<typeof FooterContent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof FooterContent> = () => <FooterContent />;

export const Footer = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Footer.args = {};
