import React from "react";
export default function SavedLinkButton({ link }) { if(!link) return null; return <a href={link} target="_blank" rel="noreferrer">Open Link</a>; }
