import { componentWrapperDecorator, Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MediaItemComponent } from "./media-item.component";
import { MediaItemModule } from "../../media-item.module";
import { MOCK_LIBRARY_ITEM } from "../../../mocks/library-item";
import { GENRES } from "../../../mocks/genres";

export default {
  component: MediaItemComponent,
  decorators: [
    moduleMetadata({
      //👇 Imports both components to allow component composition with Storybook
      imports: [MediaItemModule, BrowserAnimationsModule],
    }),
    //👇 Wraps our stories with a decorator
    componentWrapperDecorator(story => `<div style="margin: 3em; font-size: 20px">${story}</div>`),
  ],
  title: 'Ui-kit / Media Item',
} as Meta;

const Template: StoryFn = args => ({
  props: {
    ...args,
    mediaItem: MOCK_LIBRARY_ITEM.item,
    genres: GENRES,
  },
});

export const Default = Template.bind({});

Default.args = {};