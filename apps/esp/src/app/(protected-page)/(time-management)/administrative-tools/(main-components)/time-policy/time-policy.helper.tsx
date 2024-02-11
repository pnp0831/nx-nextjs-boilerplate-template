import { getTimePolicies, ITimePolicies, putTimePolicies } from '@esp/apis/time-management';
import { queryClient } from '@esp/contexts/react-query-context';
import useAuth from '@esp/hooks/useAuth';
import { MAX_FOR_MAX_DUR, MIN_FOR_MAX_DUR } from '@esp/utils/helper';
import { IRHFInput, max, min, number, required, sanitizeRules } from '@esp/utils/rhf-validation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Dayjs } from 'dayjs';
import { FieldValues } from 'react-hook-form';

export interface ITPFormData {
  statementDate: string | number;
  allowedLateIn: string | number;
  allowedEarlyOut: string | number;
  minimumDurationPerLog: string | number;
  maximumDurationPerLog: number | Dayjs;
  branchId: string;
  organizationId: string;
}

export interface ITPInput<T extends FieldValues> extends IRHFInput<T> {
  label: string;
  row: number;
  endAdornment: boolean;
  isDivider: boolean;
  toolTipContent: string;
}

export const TIME_POLICY_INPUT: ITPInput<ITPFormData>[] = [
  {
    name: 'statementDate',
    label: 'Statement date',
    rules: sanitizeRules(required(), number(), min(1), max(28)),
    row: 1,
    endAdornment: false,
    isDivider: false,
    toolTipContent: 'Statement Date is abc',
  },
  {
    name: '' as keyof ITPFormData,
    label: '',
    rules: {},
    row: 2,
    endAdornment: true,
    isDivider: true,
    toolTipContent: '',
  },
  {
    name: 'allowedLateIn',
    label: 'Allowed late in',
    rules: sanitizeRules(required(), number(), min(0), max(30)),
    row: 3,
    endAdornment: true,
    isDivider: false,
    toolTipContent: 'Allowed late in is abc',
  },
  {
    name: 'allowedEarlyOut',
    label: 'Allowed early out',
    rules: sanitizeRules(required(), number(), min(0), max(30)),
    row: 3,
    endAdornment: true,
    isDivider: false,
    toolTipContent: 'Allowed early out is abc',
  },
  {
    name: '' as keyof ITPFormData,
    label: '',
    rules: sanitizeRules(),
    row: 4,
    endAdornment: true,
    isDivider: true,
    toolTipContent: '',
  },
  {
    name: 'minimumDurationPerLog',
    label: 'Minimum duration per log',
    rules: sanitizeRules(required(), number(), min(5), max(480)),
    row: 5,
    endAdornment: true,
    isDivider: false,
    toolTipContent: 'Minimum duration per log is abc',
  },
  {
    name: 'maximumDurationPerLog',
    label: 'Maximum duration per log',
    rules: sanitizeRules(required(), {
      validate: (value) => {
        const isMaxDurationValid =
          (value as Dayjs).isBefore(MAX_FOR_MAX_DUR) && (value as Dayjs).isAfter(MIN_FOR_MAX_DUR);

        return isMaxDurationValid
          ? true
          : 'This value should be more than 5 minutes and less than 12 hours';
      },
    }),
    row: 5,
    endAdornment: true,
    isDivider: false,
    toolTipContent: 'Maximum duration per log is abc',
  },
];

export function useGetTimePolicies() {
  const { user } = useAuth();

  const queryKey = ['time-policies', user?.branchId, user?.organizationId];

  const { data } = useQuery({
    queryKey,
    queryFn: () => getTimePolicies(user?.branchId as string, user?.organizationId as string),
    staleTime: 10000,
  });

  const updateTimePolicies = (data: ITimePolicies) => putTimePolicies(data);

  const mutation = useMutation({
    mutationKey: queryKey,
    mutationFn: updateTimePolicies,
    onSuccess: (_, data) => {
      queryClient.setQueryData(queryKey, {
        data: data,
      });
    },
  });

  return {
    data: data?.data,
    mutation,
  };
}

export const MAX_DURATION_FIELD = 'maximumDurationPerLog';
