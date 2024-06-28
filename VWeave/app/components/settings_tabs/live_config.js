import Editor, { useMonaco } from "@monaco-editor/react";
import { useState, useEffect } from 'react';

import { useRouter } from "next/router";
import Api from "../api/api";

export default function LiveConfig({ setToggleState }) {
    const monaco = useMonaco();
    const router = useRouter();
   

   
    return (
        <div style={{width: "600px", margin: "0 auto"}}>
            <div >
               <p style={{fontFamily:"INTER-REGULAR",fontSize:"18px",textAlign:"center"}}>Settings in VWeave</p>
            </div>
            
            <div style={{display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "20px"}}>
                {/* <button style={{padding: "10px 20px", backgroundColor: "#dfdfd", color: "#000", borderRadius: "5px", fontSize: "14px", border: "1px solid #000", cursor: "pointer"}}>Cancel</button>
                <button style={{padding: "10px 20px", backgroundColor: "#2863eb", color: "#fff", borderRadius: "5px", fontSize: "14px", border: "1px solid #2863eb", cursor: "pointer"}}>Save</button> */}
            </div>
        </div>
    );
}
