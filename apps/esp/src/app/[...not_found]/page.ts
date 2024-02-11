import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Not Found',
};

// https://stackoverflow.com/questions/75302340/not-found-page-does-not-work-in-next-js-13
export default function NotFoundCatchAll() {
  notFound();
}
