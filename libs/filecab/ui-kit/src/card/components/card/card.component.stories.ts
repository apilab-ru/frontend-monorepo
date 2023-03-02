import { componentWrapperDecorator, Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FilecabCardComponent } from './card.component';
import { MOCK_LIBRARY_ITEM } from "../../../mocks/library-item";
import { GENRES } from "../../../mocks/genres";
import { FilecabCardModule } from "../../card.module";

export default {
  component: FilecabCardComponent,
  decorators: [
    moduleMetadata({
      //👇 Imports both components to allow component composition with Storybook
      imports: [FilecabCardModule, BrowserAnimationsModule],
    }),
    //👇 Wraps our stories with a decorator
    componentWrapperDecorator(story => `<div style="margin: 3em; max-width: 355px">${story}</div>`),
  ],
  title: 'Cabinet / Card',
} as Meta;

const Template: StoryFn = args => ({
  props: {
    ...args,
    item: MOCK_LIBRARY_ITEM,
    genres: GENRES,
  },
});

export const Default = Template.bind({});

Default.args = {
  isLibraryMode: false,
};
