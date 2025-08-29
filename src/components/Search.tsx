// Search.tsx
import React, { useState } from "react";
import { Authenticator, Divider } from "@aws-amplify/ui-react";
import CustomHeader from "./CustomMessaging";
import SearchImageAttributes from "./SearchImageAttributes";
import EpisodeSearch from "./EpisodeSearch";
import ImageSearch from "./ImageSearch";

const Search: React.FC = () => {
  const [duaAccepted, setDuaAccepted] = useState(false);

  const services = {
    handleSignUp: async (formData: any) => {
      formData.signUpAttributes = {
        ...formData.signUpAttributes,
        "custom:duaAccepted": "true",
      };
      return formData;
    },
  };

  return (
    <Authenticator
      hideSignUp={!duaAccepted}
      services={services}
      className="authenticator-popup"
      components={{
        Header: () => (
          <CustomHeader
            duaAccepted={duaAccepted}
            onDuaAgreed={() => setDuaAccepted(true)}
          />
        ),
      }}
    >
      {() => (
        <main>
          <br /><br /><br />
          <ImageSearch />
          <Divider />
          <EpisodeSearch />
          <Divider />
          <SearchImageAttributes />
          <Divider />
        </main>
      )}
    </Authenticator>
  );
};

export default Search;
