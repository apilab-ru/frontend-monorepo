import { componentWrapperDecorator, Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FilterSearchModule } from "./filter-search.module";
import { FilterSearchComponent } from "./components/root/filter-search.component";
import { BASE_SEARCH_VALUES } from "./const";
import { StatusList } from "../../../models/src/status";

export default {
  component: FilterSearchComponent,
  decorators: [
    moduleMetadata({
      //👇 Imports both components to allow component composition with Storybook
      imports: [FilterSearchModule, BrowserAnimationsModule],
    }),
    //👇 Wraps our stories with a decorator
    componentWrapperDecorator(story => `<div style="margin: 3em">${story}</div>`),
  ],
  title: 'Ui-kit / Filter search',
} as Meta;

const Template: StoryFn = args => ({
  props: {
    ...args,
    list: BASE_SEARCH_VALUES,
    value: [
      { key: 'search', value: '123' },
      { key: 'status', value: StatusList.planned, negative: true }
    ],
  },
});

export const Default = Template.bind({});

Default.args = {};
