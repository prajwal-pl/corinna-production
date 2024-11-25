import React from "react";

type Props = {
  children: React.ReactNode;
};

const OwnerLayout = ({ children }: Props) => {
  return <div>{children}</div>;
};

export default OwnerLayout;
