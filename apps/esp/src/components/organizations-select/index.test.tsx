import ContextNeededWrapper from '@esp/__mocks__/context-needed-wrapper';
import { mockCommonUser, mockFullOptionUnitsData } from '@esp/__mocks__/data-mock';
import { useGetUnits } from '@esp/components/organizations-select/organizations-select.helper';
import { render } from '@testing-library/react';

import OrganizationsSelection from '.';

jest.mock('@esp/components/organizations-select/organizations-select.helper', () => ({
  useGetUnits: jest.fn(),
  getEmployeeIds: jest.fn(),
}));

jest.mock('@esp/hooks/useAuth', () => {
  return {
    __esModule: true,
    default: jest.fn(() => ({
      signIn: jest.fn(),
      signOut: jest.fn(),
      user: mockCommonUser,
    })),
  };
});

describe('OrganizationsSelection', () => {
  beforeAll(() => {
    (useGetUnits as jest.Mock).mockReturnValue({ optionUnits: mockFullOptionUnitsData });
  });

  // it('should render ui correctly with props multiple', () => {
  //   const { getByRole, getByText } = render(<OrganizationsSelection multiple />, {
  //     wrapper: ContextNeededWrapper,
  //   });

  //   const list = getByRole('combobox');

  //   fireEvent.change(list, {
  //     target: {
  //       value: 'quang',
  //     },
  //   });

  //   const optionsElement = getByText(new RegExp('Quang Pham', 'i'));
  //   expect(optionsElement).toBeInTheDocument();
  //   fireEvent.click(optionsElement);
  // });

  it('should render ui correctly with props excludeUnits', () => {
    const { baseElement } = render(<OrganizationsSelection excludeUnit />, {
      wrapper: ContextNeededWrapper,
    });

    expect(baseElement).not.toBeNull();
  });

  it('should render ui correctly with default props', () => {
    const { baseElement } = render(<OrganizationsSelection />, {
      wrapper: ContextNeededWrapper,
    });

    expect(baseElement).not.toBeNull();
  });
});
