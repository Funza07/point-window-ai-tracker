import React from "react";
import Badge from "../common/Badge";
import GenrePill from "../common/GenrePill";
import StarRating from "../common/StarRating";
import Button from "../common/Button";
import { getMediaColor } from "../../utils/titleUtils";

export default function TitleCard({ title, onView, onAdd, inLib }) {
  const c = getMediaColor(title.type);
  return <div className="glass" style={{overflow:"hidden"}}>
    <div style={{position:"relative",height:200}}>
      <img src={title.cover} alt={title.title} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
      <div style={{position:"absolute",top:10,left:10}}><Badge color={c}>{title.type}</Badge></div>
    </div>
    <div style={{padding:12}}>
      <p style={{fontFamily:"Rajdhani",fontWeight:800,fontSize:16,margin:"0 0 6px"}}>{title.title}</p>
      <StarRating value={title.rating} />
      <div style={{display:"flex",flexWrap:"wrap",gap:4,margin:"8px 0"}}>{title.genres?.slice(0,3).map((g)=><GenrePill key={g} genre={g}/>)}</div>
      <div style={{display:"flex",gap:8}}>
        <Button variant="ghost" style={{flex:1}} onClick={()=>onView(title)}>Details</Button>
        <Button style={{flex:1}} disabled={inLib} onClick={()=>onAdd(title)}>{inLib?"Saved":"+ Add"}</Button>
      </div>
    </div>
  </div>;
}
