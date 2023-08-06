import { Meta, StoryFn, moduleMetadata, componentWrapperDecorator } from '@storybook/angular';
import { UserModule } from "@shared/user";
import { UserFormComponent } from "./user-form.component";

export default {
  component: UserFormComponent,
  decorators: [
    moduleMetadata({
      //👇 Imports both components to allow component composition with Storybook
      imports: [UserModule],
    }),
    //👇 Wraps our stories with a decorator
    componentWrapperDecorator(story => `<div style="margin: 3em">${story}</div>`),
  ],
  title: 'TaskList',
} as Meta;

const Template: StoryFn = args => ({
  props: {
    ...args,
  },
});

export const Default = Template.bind({});

Default.args = {
  name: 'Viktor',
  git: 'apilab-ru'
}
