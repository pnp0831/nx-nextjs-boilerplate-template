'use client';

import OrganizationsSelectionInput from '@esp/components/organizations-select/index';
import { useGetUnits } from '@esp/components/organizations-select/organizations-select.helper';
import { IOrganizationUnitOptions } from '@esp/components/organizations-select/organizations-select.type';
import useAuth from '@esp/hooks/useAuth';
import { Box } from '@mui/material';
import { ESPButton } from '@ui-kit/components/button';
import { ESPFormControlRhfParams } from '@ui-kit/components/form-control';
import { ESPInput } from '@ui-kit/components/text-input';
import { ESPTypography } from '@ui-kit/components/typography';
import { useMemo, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';

import OrganizationsSelection from './organizations-selection-demo';

const EMPLOYEES = [
  {
    userName: 'Chi Hua',
    employeeId: '39837602-c8b2-aab5-e705-8f143de2679f',
    unitName: 'SSTVN',
  },
  {
    userName: 'Khanh Le ',
    employeeId: 'a145385f-590d-6eef-085e-45278684db77',
    unitName: 'Division 5',
  },
  {
    userName: 'Binh Vo ',
    unitName: 'Hybris - PIMB2B',
    employeeId: 'c2565fc4-a572-9d9f-fd57-ca3bc2fc1fec',
  },
  {
    userName: 'Minh Nguyen',
    employeeId: 'ff9baf39-9999-d652-e8c8-98636c46115d',
    unitName: 'UI/UX team',
  },
  {
    userName: 'Anh Pham',
    employeeId: 'd332196b-dfd8-7c56-7105-86df02e2d977',
    unitName: 'Division 2',
  },
  {
    userName: 'Bao Le',
    employeeId: 'bfbc19c8-fc8b-c32e-655e-c05d09b2740a',
    unitName: 'BIM-Framing',
  },
  {
    userName: 'An Ton',
    employeeId: '20e4e883-2f5f-509f-9379-11d7b638f631',
    unitName: 'ISC Design Service',
  },
  {
    userName: 'Binh Duong',
    employeeId: '24566907-4007-ab3d-4186-a406effc866e',
    email: 'biduong@strongtie.com',
    unitName: 'ICS-Design-Columbus',
  },
  {
    userName: 'Tien Hoang',
    employeeId: '5d7cd6a9-a4a2-0ba9-8864-44221250145b',
    email: 'tihoang@strongtie.com',
    unitName: 'ICS-Design-Stockton',
  },
  {
    userName: 'Lam Nguyen',
    employeeId: '13ca8d25-5734-7427-efa8-490b2d795f08',
    email: 'languyen@strongtie.com',
    unitName: 'ICS-Design-McKinney',
  },
];

interface IForm {
  unit?: IOrganizationUnitOptions;
  units: IOrganizationUnitOptions[];
}

const Setting = () => {
  const [employeeId, setEmployeeId] = useState('');

  const [employeeIdForFilter, setEmployeeIdForFilter] = useState('');
  useGetUnits(employeeIdForFilter);

  const { user } = useAuth();

  const defaultUnits: IOrganizationUnitOptions = useMemo(() => {
    return {
      isEmployee: true,
      label: user?.name as string,
      value: user?.employeeId as string,
    };
  }, [user?.name, user?.employeeId]);

  const { control, setValue } = useForm<IForm>({
    defaultValues: {
      unit: defaultUnits,
      units: [defaultUnits],
    },
  });

  return (
    <>
      <Box display="flex" mb="1rem">
        <ESPInput
          onChange={(e) => setEmployeeId(e.target.value)}
          value={employeeId}
          placeholder="Input employeeId"
          label="Input employeeId"
        />

        <ESPButton onClick={() => setEmployeeIdForFilter(employeeId)}>Apply</ESPButton>
      </Box>

      <Box display="flex" mb="1rem">
        {[
          {
            employeeId: defaultUnits.value,
            userName: defaultUnits.label,
            unitName: '',
          },
          ...EMPLOYEES,
        ].map((e) => (
          <Box
            sx={{
              padding: '0.5rem',
              marginRight: '0.5rem',
              background: (theme) => theme.palette.gray_dark.main,
              width: 'max-content',
              cursor: 'pointer',
              border: e.employeeId === employeeIdForFilter ? '1px solid' : 'none',
            }}
            key={e.employeeId}
            onClick={() => {
              setEmployeeId(e.employeeId as string);
              setEmployeeIdForFilter(e.employeeId as string);
              setValue('unit', undefined);
              setValue('units', []);
            }}
          >
            {e.userName} - {e.unitName}
          </Box>
        ))}
      </Box>

      <Box sx={{ width: '30rem', mb: '1rem' }}>
        <ESPTypography variant="bold_l">Dropdown Autocomplete</ESPTypography>
        <Box display="flex" justifyContent="space-between" mt="0.5rem">
          <Box mr="0.5rem">
            <Controller
              name="units"
              control={control}
              render={(params) => {
                return (
                  <OrganizationsSelection
                    multiple
                    employeeIdDemo={employeeIdForFilter}
                    label="Multiple"
                    rhfParams={params as unknown as ESPFormControlRhfParams<FieldValues>}
                  />
                );
              }}
            />
          </Box>
          <Box>
            <Controller
              name="unit"
              control={control}
              render={(params) => (
                <OrganizationsSelection
                  employeeIdDemo={employeeIdForFilter}
                  rhfParams={params as unknown as ESPFormControlRhfParams<FieldValues>}
                />
              )}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ width: '30rem', mb: '1rem' }}>
        <ESPTypography variant="bold_l">Search Autocomplete</ESPTypography>
        <Box display="flex" justifyContent="space-between" mt="0.5rem">
          <Box mr="0.5rem">
            <Controller
              name="units"
              control={control}
              render={(params) => (
                <OrganizationsSelectionInput
                  multiple
                  employeeIdDemo={employeeIdForFilter}
                  label="Multiple"
                  rhfParams={params as unknown as ESPFormControlRhfParams<FieldValues>}
                />
              )}
            />
          </Box>
          <Box>
            <Controller
              name="unit"
              control={control}
              render={(params) => (
                <OrganizationsSelectionInput
                  employeeIdDemo={employeeIdForFilter}
                  rhfParams={params as unknown as ESPFormControlRhfParams<FieldValues>}
                />
              )}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ width: '30rem', mt: '5rem' }}>
        <ESPTypography variant="bold_l">Dropdown Autocomplete ( Exclude Units )</ESPTypography>
        <Box display="flex" justifyContent="space-between" mt="0.5rem">
          <Box mr="0.5rem">
            <Controller
              name="units"
              control={control}
              render={(params) => {
                return (
                  <OrganizationsSelection
                    multiple
                    employeeIdDemo={employeeIdForFilter}
                    label="Multiple"
                    rhfParams={params as unknown as ESPFormControlRhfParams<FieldValues>}
                    excludeUnit
                  />
                );
              }}
            />
          </Box>
          <Box>
            <Controller
              name="unit"
              control={control}
              render={(params) => (
                <OrganizationsSelection
                  employeeIdDemo={employeeIdForFilter}
                  rhfParams={params as unknown as ESPFormControlRhfParams<FieldValues>}
                  excludeUnit
                />
              )}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ width: '30rem', mb: '1rem' }}>
        <ESPTypography variant="bold_l">Search Autocomplete ( Exclude Units )</ESPTypography>
        <Box display="flex" justifyContent="space-between" mt="0.5rem">
          <Box mr="0.5rem">
            <Controller
              name="units"
              control={control}
              render={(params) => (
                <OrganizationsSelectionInput
                  multiple
                  employeeIdDemo={employeeIdForFilter}
                  label="Multiple"
                  rhfParams={params as unknown as ESPFormControlRhfParams<FieldValues>}
                  excludeUnit
                />
              )}
            />
          </Box>
          <Box>
            <Controller
              name="unit"
              control={control}
              render={(params) => (
                <OrganizationsSelectionInput
                  employeeIdDemo={employeeIdForFilter}
                  rhfParams={params as unknown as ESPFormControlRhfParams<FieldValues>}
                  excludeUnit
                />
              )}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Setting;
