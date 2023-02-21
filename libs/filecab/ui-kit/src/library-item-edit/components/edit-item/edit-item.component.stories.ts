import { componentWrapperDecorator, Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { LibraryItemEditModule } from '../../library-item-edit.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditItemComponent } from './edit-item.component';
import { StatusList } from '@filecab/models/status';

export default {
  component: EditItemComponent,
  decorators: [
    moduleMetadata({
      //👇 Imports both components to allow component composition with Storybook
      imports: [LibraryItemEditModule, BrowserAnimationsModule]
    }),
    //👇 Wraps our stories with a decorator
    componentWrapperDecorator(story => `<div style="margin: 3em; max-width: 310px">${story}</div>`)
  ],
  title: 'Ui-kit / Edit Item'
} as Meta;

const Template: StoryFn = args => ({
  props: {
    ...args,
    meta: {
      comment: 'Some comment',
      status: StatusList.process,
      star: 5,
      progress: 16,
    }
  }
});

export const Default = Template.bind({});

Default.args = {};
