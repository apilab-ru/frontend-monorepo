import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { UiTableModule } from './table.module';
import { TABLE_MOCK_DATA } from './mock.data';

const meta: Meta = {
  title: 'Ui-kit / Table',
  decorators: [moduleMetadata({ imports: [UiTableModule, CommonModule] })],
  render: args => ({
    props: args,
    template: `<ui-table [list]="list" style="{{ style }}">
      <ui-table-head class="number">#id</ui-table-head>
      <ui-table-head>Name</ui-table-head>
      <ui-table-head>Description</ui-table-head>
      <ui-table-head class="controls">Controls</ui-table-head>
      <tr *uiTableIterator="let item of list" uiTableTr>
        <td uiTableTd>#{{ item.num }}</td>
        <td uiTableTd>{{ item.name }}</td>
        <td uiTableTd>{{ item.description }}</td>
        <td uiTableTd><button>Add Item</button></td>
      </tr>
    </ui-table>`,
  }),
};
export default meta;

export const Default: StoryObj = {
  args: { list: TABLE_MOCK_DATA, style: 'max-width: 800px; display: block;' },
};

export const FixedBlocks: StoryObj = {
  args: { list: TABLE_MOCK_DATA, style: 'max-width: 600px; display: block;' },
};
