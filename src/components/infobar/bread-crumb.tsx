"use client";
import React from "react";

type Props = {};

function BreadCrumb({}: Props) {
  return (
    <div className="flex flex-col ">
      <div className="flex gap-5 items-center">
        <h2 className="text-3xl font-bold capitalize">Title</h2>
      </div>
      <p className="text-gray-500 text-sm">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam, illum!
        Atque, at facilis quis, amet facere debitis tenetur mollitia reiciendis
        pariatur laboriosam, id sit quod.
      </p>
    </div>
  );
}

export default BreadCrumb;
