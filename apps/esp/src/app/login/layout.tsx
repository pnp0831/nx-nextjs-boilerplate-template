import React from 'react';

export const metadata = {
  title: 'Login',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactElement;
}): React.ReactElement {
  return children;
}
