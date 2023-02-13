import { LibraryModule } from '../../library.module';
import { componentWrapperDecorator, Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LIBRARY_ITEM, STORY_GENRES } from '@shared/storybook/genres';
import { CardComponent } from './card.component';

export default {
  component: CardComponent,
  decorators: [
    moduleMetadata({
      //👇 Imports both components to allow component composition with Storybook
      imports: [LibraryModule, BrowserAnimationsModule],
    }),
    //👇 Wraps our stories with a decorator
    componentWrapperDecorator(story => `<div style="margin: 3em">${story}</div>`),
  ],
  title: 'Cabinet / Card',
} as Meta;

const Template: StoryFn = args => ({
  props: {
    ...args,
    item: LIBRARY_ITEM,
    genres: STORY_GENRES,
  },
});

export const Default = Template.bind({});

Default.args = {};
