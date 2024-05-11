import React from 'react';
import { Children } from 'react';
export function IconContainer(props){
  const {children, className} = props;

  return (<div className = {className}>{children}</div>)
}
export function Box(props){
  const {children, className} = props;
  const headerChildren = Children.toArray(children).filter((child)=>{return child.type.name == "BoxHeader"});
  const contentChildren = Children.toArray(children).filter((child)=>{return child.type.name == "BoxContent"});
  
  return (
    <div className={`flex flex-col relative ${className}`}>
      <div className="flex p-4 justify-between align-center -top-7 text-xl absolute w-full">{headerChildren}</div>
      <div className="p-8 border-2 border-black rounded-2xl outline-none gap-6 flex flex-col justify-center align-center">{contentChildren}</div>
    </div>
  )
}

export function BoxHeader(props){
  const {children, className} = props;
  let newChildren = Children.map(children, child => {
    const className = `bg-white rounded-2xl p-2 py-0 ${child.props.className}`
    const props = {...child.props, className: className}
    return React.cloneElement(child, props);
  })
  
  return (
    <>{newChildren}</>
  )
}

export function BoxContent(props){
  const {children, className} = props;

  return (
    <div className={`flex relative ${className} gap-4`}>{children}</div>
  )
}


