import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Thumbnail } from "../../components";
import { string } from "prop-types";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Projects",
  component: Thumbnail,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    thumb: string,
    imgs: Array,
    desc: string,
    header: string,
    group: string,
    index: Number,
    onThumbClick: Function,
  },
} as ComponentMeta<typeof Thumbnail>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Thumbnail> = (args) => (
  <Thumbnail {...args} />
);

export const Thumb = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Thumb.args = {
  thumb: "/img/squares/saatchi-large.webp",
  imgs: [
    "/img/citi.webp",
    "/img/etsy.webp",
    "/img/giftcard.webp",
    "/img/quiz.webp",
  ],
  desc: "World-renowned art marketplace",
  header: "Saatchi Art",
  group: "saatchi",
  index: 0,
};
