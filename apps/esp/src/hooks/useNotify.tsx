import { useNotify as useNotifyContext } from '@ui-kit/contexts/notify-context';

const useNotify = () => {
  const notify = useNotifyContext();

  return notify;
};

export default useNotify;
