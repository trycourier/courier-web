import React from "react";

const HelloWorld = (props: { name: string }) => {
  return <div>Hello, World! {props.name} </div>;
};

export default HelloWorld;