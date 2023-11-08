import Auth0Provider from "../Auth0Provider";
import AboutPage from "./about/page";
import LoginCheck from "./LoginCheck";

export default function Page({
  searchParams,
}: {
  searchParams: { error: string };
}) {
  return (
    <LoginCheck>
      <AboutPage />
    </LoginCheck>
  );
}
