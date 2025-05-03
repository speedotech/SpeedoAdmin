import React from "react";
import { Helmet } from "react-helmet";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        />
      </Helmet>
      <div style={{ width: '100%', textAlign: 'center', marginTop: '40px' }}>
        <h2>Welcome to the dashboard</h2>
      </div>
    </>
  );
};

export default Index;
