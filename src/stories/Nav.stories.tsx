import React, { FunctionComponent } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Provider } from 'react-redux';
import { store } from '../../src/store';

import { NavContent } from '../components';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components',
  component: NavContent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof NavContent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<FunctionComponent> = (args) => <Provider store={store}><NavContent {...args} /></Provider>;

export const Nav = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Nav.args = {};
