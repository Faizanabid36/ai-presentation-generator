import React from 'react';

export function IconButton(props){
  const {children, onClick, className} = props;

  return (<button className = {className} onClick={onClick}>{children}</button>)
}

export function TextButton(props){
  const {children, onClick,  className} = props;

  return (<button onClick={onClick} className={`border-2 border-black rounded-2xl p-3 text-xl flex gap-2 justify-center items-center ${className}`}>{children}</button>)
}

export function LinkButton(props){
  const {children, onClick, href, className} = props;

  return (<a onClick={onClick} href={href} className={`border-0 rounded-2xl text-xl flex gap-2 justify-center items-center ${className}`}>{children}</a>)
}
