import { componentWrapperDecorator, Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { types } from './story.helper';
import { STATUS_LIST } from '../../../const/const';
import { PopupAddItemModule } from '@shared/popup-add-item/popup-add-item.module';
import { CardEditComponent } from './card-edit.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  component: CardEditComponent,
  decorators: [
    moduleMetadata({
      //👇 Imports both components to allow component composition with Storybook
      imports: [PopupAddItemModule, BrowserAnimationsModule],
    }),
    //👇 Wraps our stories with a decorator
    componentWrapperDecorator(story => `<div style="padding: 3em; max-width: 300px">${story}</div>`),
  ],
  title: 'Popup / CardEdit',
} as Meta;

const Template: StoryFn = args => ({
  props: {
    ...args,
    types: types,
    name: 'Пил Харбор',
    statuses: STATUS_LIST,
    item: {
      comment: 'Test',
      status: 'planned',
      item: { episodes: 10 },
    },
  },
});

export const Default = Template.bind({});

Default.args = {};
