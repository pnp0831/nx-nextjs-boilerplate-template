import NoPermission from './(public-page)/no-permission/page';

export default function NotFound() {
  return (
    <NoPermission
      code={404}
      subTitle="The page you’re looking for isn’t available. Try another page or use the home button below."
      title="Page Not Found"
    />
  );
}
