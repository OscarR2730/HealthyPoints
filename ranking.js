// ranking.js
import { db } from "./firebase.js";
import { watchAuth } from "./auth.js";
import {
 collection, getDocs, query, orderBy, limit
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const rankingList=document.getElementById("rankingList");
const myPos=document.getElementById("myPosition");
let currentUser=null;

watchAuth(async u=>{
 if(!u) return location.href="login.html";
 currentUser=u;
 await loadR();
});

async function loadR(){
 const q=query(collection(db,"users"),orderBy("points","desc"),limit(50));
 const s=await getDocs(q);
 const arr=[];
 s.forEach(d=>arr.push({id:d.id,name:d.data().name,points:d.data().points||0}));

 rankingList.innerHTML="";
 arr.slice(0,3).forEach((u,i)=>{
  rankingList.innerHTML+=`<li><strong>${i+1}. ${u.name}</strong> - ${u.points} pts</li>`;
 });

 const idx=arr.findIndex(x=>x.id===currentUser.uid);
 if(idx<0) myPos.textContent="¡Suma puntos para entrar al ranking!";
 else myPos.textContent=`Estás en posición #${idx+1} con ${arr[idx].points} pts`;
}
