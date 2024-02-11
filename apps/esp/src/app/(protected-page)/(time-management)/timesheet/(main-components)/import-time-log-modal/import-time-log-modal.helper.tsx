import { getTimelogTemplateValidation } from '@esp/apis/file-management';
import { useQuery } from '@tanstack/react-query';

export function useGetTimeLogTemplateValidation() {
  const { data } = useQuery({
    queryKey: ['time-log-template-validation'],
    queryFn: () => getTimelogTemplateValidation(),
    staleTime: 60 * 10 * 1000, // ms 10minutes
    cacheTime: 60 * 10 * 1000, // ms 10minutes
  });

  return {
    data: data?.data,
  };
}
