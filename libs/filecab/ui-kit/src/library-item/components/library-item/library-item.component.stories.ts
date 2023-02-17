import { componentWrapperDecorator, Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { foundList, genres } from './story.const';
import { LibraryItemModule } from '../../index';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LibraryItemComponent } from './library-item.component';

export default {
  component: LibraryItemComponent,
  decorators: [
    moduleMetadata({
      //👇 Imports both components to allow component composition with Storybook
      imports: [LibraryItemModule, BrowserAnimationsModule],
    }),
    //👇 Wraps our stories with a decorator
    componentWrapperDecorator(story => `<div style="margin: 3em">${story}</div>`),
  ],
  title: 'Ui-kit / Library Item',
} as Meta;

const Template: StoryFn = args => ({
  props: {
    ...args,
    list: foundList,
    genres: genres,
  },
});

export const Default = Template.bind({});

Default.args = {};
