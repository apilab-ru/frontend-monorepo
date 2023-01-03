import { componentWrapperDecorator, Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { foundList, genres } from './story.const';
import { PopupAddItemModule } from '@shared/popup-add-item/popup-add-item.module';
import { FoundedListComponent } from './founded-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  component: FoundedListComponent,
  decorators: [
    moduleMetadata({
      //👇 Imports both components to allow component composition with Storybook
      imports: [PopupAddItemModule, BrowserAnimationsModule],
    }),
    //👇 Wraps our stories with a decorator
    componentWrapperDecorator(story => `<div style="margin: 3em">${story}</div>`),
  ],
  title: 'Popup / Founded list',
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
