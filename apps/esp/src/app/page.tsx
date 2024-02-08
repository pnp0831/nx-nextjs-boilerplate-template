import Uikit from '@sstvn/ui-kit/lib/ui-kit';
import Image from 'next/image';

export default function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.scss file.
   */
  return (
    <div>
      <Uikit />
      <Image src="/icons/logo.png" alt="logo" width={150} height={120} />
      home page
    </div>
  );
}
