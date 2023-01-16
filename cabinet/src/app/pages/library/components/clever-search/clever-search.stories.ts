import { CleverSearchComponent } from './clever-search.component';
import { componentWrapperDecorator, Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { LibraryModule } from '../../library.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  component: CleverSearchComponent,
  decorators: [
    moduleMetadata({
      imports: [LibraryModule, BrowserAnimationsModule],
    }),
    componentWrapperDecorator(story => `<div style="margin: 2em">${story}</div>`),
  ],
  title: 'CleverSearch',
} as Meta;

const Template: StoryFn = args => ({
  props: {
    ...args,
  },
});

export const Default = Template.bind({});

Default.args = {};
