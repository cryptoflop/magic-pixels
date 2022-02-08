import React, { useState } from 'react';

function Auctionhouse({}) {
  const [plates, setPlates] = useState(Array(30).fill(1));

  return (
    <div className="grid absolute w-full h-full">
      <div className=" text-base pb-2">{plates?.length + ' Plates'}</div>
      <div className="flex flex-col space-y-4 overflow-y-scroll">
        {plates.map((_, i) => (
          <div key={i} className="border-2 border-pink-500 p-4">
            {i}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Auctionhouse;
