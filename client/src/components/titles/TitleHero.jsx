import React from "react";
import Badge from "../common/Badge";
import StarRating from "../common/StarRating";
import { getMediaColor } from "../../utils/titleUtils";
export default function TitleHero({ title }) { const c=getMediaColor(title.type); return <div className="glass" style={{overflow:"hidden",position:"relative"}}><img src={title.banner} alt={title.title} style={{width:"100%",height:280,objectFit:"cover"}}/><div style={{position:"absolute",left:20,bottom:20}}><h1 style={{fontFamily:"Rajdhani",fontSize:34,margin:0}}>{title.title}</h1><Badge color={c}>{title.type}</Badge> <StarRating value={title.rating}/></div></div>; }
