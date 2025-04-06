import { RNChildProp } from "@/@types/interface/Interface";
import React from "react";
import { ubuntu, ubuntuMono } from "@/@types/font/Font";

export function layout({children}: RNChildProp){
  return(
    <main className={`${ubuntu.className} ${ubuntuMono.className} antialiased`}>
      <div>{children}</div>
    </main>
  )
}