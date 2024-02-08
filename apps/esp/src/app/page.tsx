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
      <Image src="/icons/avatar.png" alt="s" width={30} height={30} />
      home page
    </div>
  );
}
