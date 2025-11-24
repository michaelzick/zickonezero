import { type ReactNode } from 'react';
import {
  DemoStokeWhyGrid,
  DemoStokeWhyCard,
  DemoStokeWhyBadge,
  DemoStokeWhyTitle,
  DemoStokeWhyCopy,
} from '../../../styles';

type WhyItem = {
  title: string;
  description: ReactNode;
};

type WhyHighlightsProps = {
  items: WhyItem[];
};

const WhyHighlights = ({ items }: WhyHighlightsProps) => {
  return (
    <DemoStokeWhyGrid>
      {items.map(({ title, description }, index) => (
        <DemoStokeWhyCard key={title}>
          <DemoStokeWhyBadge aria-hidden='true'>{index + 1}</DemoStokeWhyBadge>
          <DemoStokeWhyTitle>{title}</DemoStokeWhyTitle>
          <DemoStokeWhyCopy>{description}</DemoStokeWhyCopy>
        </DemoStokeWhyCard>
      ))}
    </DemoStokeWhyGrid>
  );
};

export default WhyHighlights;
