import React from "react";
import { Helmet } from "react-helmet";
import Routes from "./Routes";
import CookieConsent from "./components/CookieConsent";
import { getSecurityHeaders } from "./utils/securityHeaders";

function App() {
  const securityHeaders = getSecurityHeaders(import.meta.env.DEV);
  const csp = securityHeaders['Content-Security-Policy'];

  return (
    <>
      <Helmet>
        <meta httpEquiv="Content-Security-Policy" content={csp} />
        <meta name="referrer" content={securityHeaders['Referrer-Policy']} />
        <meta httpEquiv="X-XSS-Protection" content={securityHeaders['X-XSS-Protection']} />
        <meta httpEquiv="X-Content-Type-Options" content={securityHeaders['X-Content-Type-Options']} />
      </Helmet>
      <Routes />
      <CookieConsent />
    </>
  );
}

export default App;
