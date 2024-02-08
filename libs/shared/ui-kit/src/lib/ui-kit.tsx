import styles from './ui-kit.module.scss';

/* eslint-disable-next-line */
export interface UiKitProps {}

export function UiKit(props: UiKitProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to UiKit!</h1>
    </div>
  );
}

export default UiKit;
