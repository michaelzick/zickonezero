import React, { useState } from "react";
import FsLightbox from "fslightbox-react";
import { StoryFn, Meta } from "@storybook/react";

import { Thumbnail } from "../../components";

type ThumbnailStoryProps = Omit<React.ComponentProps<typeof Thumbnail>, "onThumbClick">;

const ThumbnailWrapper = (args: ThumbnailStoryProps) => {
  const [lightboxController, setLightboxController] = useState({
    toggler: false,
    productIndex: 0,
  });

  const onThumbClick = (index: number, squareLinkOut?: boolean) => {
    if (squareLinkOut) return;

    setLightboxController({
      toggler: !lightboxController.toggler,
      productIndex: index,
    });
  };

  return (
    <>
      <Thumbnail {...args} onThumbClick={onThumbClick} />
      <FsLightbox
        toggler={lightboxController.toggler}
        sources={args.imgs}
        slide={lightboxController.productIndex + 1}
      />
    </>
  );
};

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Projects",
  component: Thumbnail,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    thumb: { control: "text" },
    imgs: { control: "object" },
    desc: { control: "text" },
    header: { control: "text" },
    group: { control: "text" },
    index: { control: "number" },
  },
} as Meta<typeof Thumbnail>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof Thumbnail> = (args: ThumbnailStoryProps) => (
  <ThumbnailWrapper {...args} />
);

export const Thumb = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Thumb.args = {
  thumb: "/img/squares/saatchi-large.webp",
  imgs: [
    "/img/citi.webp",
    "/img/etsy.webp",
    "/img/giftcard.webp",
    "/img/demostoke/quiz.webp",
  ],
  desc: "World-renowned art marketplace",
  header: "Saatchi Art",
  group: "saatchi",
  index: 0,
};
