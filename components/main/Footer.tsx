import React from "react";
import {
  RxGithubLogo,
  RxInstagramLogo,
  RxLinkedinLogo,
} from "react-icons/rx";

import { FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="w-full h-full bg-transparent text-gray-200 shadow-lg p-[15px] ">
        <div className="w-full flex flex-col items-center justify-center m-auto">
            
            <div className="mb-[20px] text-[15px] text-center">
                Inspirated by WebChain Dev
            </div>

            <div className="mb-[20px] text-[15px] text-center">
                &copy; Aaeon 2023 Inc. All rights reserved
            </div>    
        </div>
    </div>
  )
}

export default Footer