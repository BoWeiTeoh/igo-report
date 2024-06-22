const Check = (props) => {
  return props.if ? props.children : null;
};

export default Check;
