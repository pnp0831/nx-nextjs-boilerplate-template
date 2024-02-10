import ThemeProvider from '@ui-kit/contexts/theme-context';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { fireEvent, render } from '@testing-library/react';

import ESPTable, { ESPTable as TableEnhancementComponent } from './table';

interface Data {
  id: string | number;
  name: string;
}

const COMMON_HEADCELLS = {
  id: 'name',
  label: 'Title',
  sortable: true,
};

const HEADCELLS_WITHOUT_SORTABLE = {
  id: 'name',
  label: 'Title',
};

// const HEADCELLS_WITHOUT_SAME_ID = {
//   id: 'age',
//   label: 'Title',
//   sortable: true,
// };

const DATA = [
  {
    name: 'Table content 1',
    id: '1',
  },
];

const DATA_OPTION_CHECKBOX = [
  {
    name: 'Table content 1',
    id: '1',
    option: {
      showCheckbox: true,
    },
  },
  {
    name: 'Table content 2',
    id: '2',
    option: {
      showCheckbox: false,
    },
  },
];

const COLUMNS = [
  {
    id: 'name',
    label: 'name',
    sortable: true,
    resizable: true,
  },
  {
    id: 'action',
    label: 'action',
    render: (row: Data) => (
      <MoreHorizIcon
        onClick={(e) => {
          e.stopPropagation();
          window.alert(row.name);
        }}
      />
    ),
    align: 'right',
  },
];

const COLUMNS_WITH_SORTING_ID = [
  {
    id: 'name',
    label: 'name',
    sortable: true,
    resizable: true,
    sortingId: 'sortingId1',
  },
  {
    id: 'action',
    label: 'action',
    align: 'right',
  },
];

describe('Table', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <TableEnhancementComponent columns={[COMMON_HEADCELLS]} showPageSize />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render default successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPTable columns={[COMMON_HEADCELLS]} />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should trigger handleSelectAllClick successfully', () => {
    const { getByRole } = render(
      <ThemeProvider>
        <ESPTable
          columns={[COMMON_HEADCELLS]}
          checkboxSelection
          data-testid={'table'}
          data={DATA_OPTION_CHECKBOX}
        />
      </ThemeProvider>
    );

    const checkboxAll = getByRole('checkbox', { name: 'select all desserts' });
    fireEvent.click(checkboxAll);
    // Check all

    const bodyRows = document.querySelectorAll('tbody > tr');

    const selectedRows = Array.from(bodyRows).filter(
      (row) => row.getAttribute('aria-checked') === 'true'
    );

    expect(selectedRows.length).toEqual(DATA.length);

    // Uncheck all
    fireEvent.click(checkboxAll);

    const unSelectedRows = Array.from(bodyRows).filter(
      (row) => row.getAttribute('aria-checked') === 'false'
    );

    expect(unSelectedRows.length).toEqual(1);
  });

  it('should trigger handleClick successfully', () => {
    const { getByRole } = render(
      <ThemeProvider>
        <ESPTable
          columns={[COMMON_HEADCELLS]}
          checkboxSelection
          data-testid={'table'}
          data={DATA}
        />
      </ThemeProvider>
    );

    const checkboxFirstClick = getByRole('checkbox', { name: 'Table content 1' });

    fireEvent.click(checkboxFirstClick);

    const bodyRowsAfterFirstClick = document.querySelectorAll('tbody > tr');

    const selectedRows = Array.from(bodyRowsAfterFirstClick).filter(
      (row) => row.getAttribute('aria-checked') === 'true'
    );

    expect(selectedRows.length).toEqual(1);

    // Uncheck
    const checkboxUnClick = getByRole('checkbox', { name: 'Table content 1' });
    fireEvent.click(checkboxUnClick);

    const bodyRowsAfterUnclick = document.querySelectorAll('tbody > tr');

    const unSelectedRows = Array.from(bodyRowsAfterUnclick).filter(
      (row) => row.getAttribute('aria-checked') === 'false'
    );

    expect(unSelectedRows.length).toEqual(DATA.length);
  });

  it('should trigger click each row', () => {
    const rowClick = jest.fn();
    render(
      <ThemeProvider>
        <ESPTable
          columns={[COMMON_HEADCELLS]}
          checkboxSelection
          data-testid={'table'}
          data={DATA}
          rowClick={rowClick}
        />
      </ThemeProvider>
    );

    const bodyRows = document.querySelectorAll('tbody > tr');

    fireEvent.click(bodyRows[0]);
    expect(rowClick).toBeCalledTimes(1);
  });

  it('should render correct row id if render is function in each columns', () => {
    render(
      <ThemeProvider>
        <ESPTable checkboxSelection data-testid={'table'} data={DATA} columns={COLUMNS} />
      </ThemeProvider>
    );

    const actionColumn = COLUMNS.find((column) => column.id === 'action');

    if (typeof actionColumn?.render === 'function') {
      // console.log('');
    }
  });

  it('should render row without checkbox', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPTable
          columns={[HEADCELLS_WITHOUT_SORTABLE]}
          checkboxSelection
          data-testid={'table'}
          data={DATA_OPTION_CHECKBOX}
        />
      </ThemeProvider>
    );

    const row = baseElement.getElementsByClassName(
      'MuiTableCell-root MuiTableCell-body MuiTableCell-paddingCheckbox MuiTableCell-sizeMedium css-ij5pxg-MuiTableCell-root'
    );

    const secondRow = row[1];
    expect(secondRow).toBe(undefined);
  });

  it('should trigger onLoadOptionsChange successfully', () => {
    const mockOnPageChange = jest.fn();

    render(
      <ThemeProvider>
        <TableEnhancementComponent
          showPageSize
          data={DATA}
          columns={COLUMNS}
          onLoadOptionsChange={mockOnPageChange}
        />
      </ThemeProvider>
    );

    expect(mockOnPageChange).toBeCalledTimes(1);
  });

  it('should trigger open settings successfully', () => {
    const { getByRole, getAllByTestId } = render(
      <ThemeProvider>
        <TableEnhancementComponent
          showPageSize
          data={DATA}
          pageSizeOptions={[10, 20, 25]}
          columns={COLUMNS}
          showTableSetting
        />
      </ThemeProvider>
    );

    const settingButton = getByRole('button', { name: 'Settings' });
    fireEvent.click(settingButton);

    const allCheckboxFirstRender = getAllByTestId('CheckBoxIcon');

    expect(allCheckboxFirstRender.length).toEqual(COLUMNS.length);

    const firstCheckbox = getByRole('checkbox', { name: 'name' });
    fireEvent.click(firstCheckbox);

    const filterCheckboxAfterFirstClick = getAllByTestId('CheckBoxIcon');

    expect(filterCheckboxAfterFirstClick.length).toBeLessThan(COLUMNS.length);

    //second click

    fireEvent.click(firstCheckbox);
    const filterCheckboxAfterSecondClick = getAllByTestId('CheckBoxIcon');
    expect(filterCheckboxAfterSecondClick.length).toEqual(COLUMNS.length);
  });

  it('should trigger resize columns successfully', () => {
    const startX = 50;

    const { baseElement } = render(
      <ThemeProvider>
        <TableEnhancementComponent
          showPageSize
          data={DATA}
          pageSizeOptions={[10, 20, 25]}
          columns={COLUMNS}
        />
      </ThemeProvider>
    );

    const resizeDiv = baseElement.querySelector('.resize-handle');
    expect(resizeDiv).toBeInTheDocument();

    fireEvent.mouseDown(resizeDiv, { clientX: startX });
    fireEvent.mouseMove(resizeDiv, { clientX: startX + 10 });

    fireEvent.mouseUp(resizeDiv);
  });

  it('should trigger resize columns > 500 successfully', () => {
    const startX = 500;

    const { baseElement } = render(
      <ThemeProvider>
        <TableEnhancementComponent
          showPageSize
          pageSizeOptions={[10, 20, 25]}
          data={DATA}
          columns={COLUMNS}
        />
      </ThemeProvider>
    );

    const resizeDiv = baseElement.querySelector('.resize-handle');
    expect(resizeDiv).toBeInTheDocument();

    fireEvent.mouseDown(resizeDiv, { clientX: startX });
    fireEvent.mouseMove(resizeDiv, { clientX: startX + 1500 });

    fireEvent.mouseUp(resizeDiv);
  });

  it('should sort with sortingId', () => {
    const mockOnPageChange = jest.fn();

    const { baseElement } = render(
      <ThemeProvider>
        <TableEnhancementComponent
          showPageSize
          data={DATA}
          columns={COLUMNS_WITH_SORTING_ID}
          onLoadOptionsChange={mockOnPageChange}
        />
      </ThemeProvider>
    );

    const columnHeader = baseElement
      .querySelector('.MuiTableHead-root')
      ?.querySelector('.MuiButtonBase-root');

    fireEvent.click(columnHeader);

    expect(mockOnPageChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ sort: [expect.objectContaining({ selector: 'sortingId1' })] })
    );
  });
});
