import React from "react";
import ThemeButton from "../../sharedItem/ThemeButton";
import { ImMail2 } from "react-icons/im";
import { BsWhatsapp } from "react-icons/bs";
import { Link } from "react-router";
import { RxExternalLink } from "react-icons/rx";
import Navbar from "../../sharedItem/Navbar";

const data = [
  {
    id: 1,
    name: "BrickBase",
    image: "https://i.ibb.co.com/0VW7M2g4/Screenshot-2025-07-21-173448.png",
    link: "https://brickbase-47887.web.app/",
  },
  {
    id: 2,
    name: "Runfinity",
    image: "https://i.ibb.co.com/GQK5DBPj/Screenshot-2025-08-09-001551.png",
    link: "https://marathon-management-syst-9bb4a.web.app/",
  },
  {
    id: 3,
    name: "Find Mate",
    image: "https://i.ibb.co.com/HDCphMqd/Screenshot-2025-06-25-161456.png",
    link: "https://find-mate-app.web.app/",
  },
];

const Home = () => {
  return (
    <div>
      <div className="lg:hidden">
        <ThemeButton></ThemeButton>
      </div>

      <div className="w-11/12 mx-auto my-3 grid grid-cols-12 gap-5 mt-6">
        <section className="main col-span-11 xl:col-span-9 lg:mr-10">
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iure porro
            quidem delectus aliquid quia cupiditate nihil veniam asperiores
            provident aperiam ab deserunt, ex rem. Eos sit excepturi dignissimos
            nulla enim laboriosam accusamus hic sequi similique quaerat!
            Voluptas reiciendis corrupti quasi atque. A mollitia ipsa laudantium
            nostrum fugit, deleniti nam sed.
          </p>
        </section>

        <aside className="hidden xl:block col-span-3 sticky top-8 h-fit">
          <div className="mb-2">
            <ThemeButton></ThemeButton>
          </div>
          <div className="space-y-3 mb-4">
            <div className="px-4 py-2 bg-gray-400 rounded-md">
              <h1 className="text-2xl mb-2 border-b-2 pb-2">Sponsor</h1>
              <p className="mb-2">My Other Creation - </p>
              <div className="">
                {data.map((data) => (
                  <div key={data.id}>
                    <div className="flex gap-2 items-center mb-2">
                      <p>{data.name}</p>
                      <Link to={data.link}>
                        <RxExternalLink />
                      </Link>
                    </div>
                    <img className="mb-2" src={data.image} alt="" />
                  </div>
                ))}
              </div>
            </div>
            <div className="border-2 px-4 py-2 rounded-md">
              <h1 className="text-2xl mb-2 border-b-2 pb-2">Contact</h1>
              <div className="space-y-2">
                <p className="flex gap-3 text-lg items-center">
                  <ImMail2 size={20} />
                  shahan.al.munim
                  <br />
                  @gmail.com
                </p>
                <p className="flex gap-3 text-lg items-center">
                  <BsWhatsapp size={20} />
                  +8801705620458
                </p>
              </div>
            </div>
          </div>
          <p>&copy; {new Date().getFullYear()} BrainBox by MMunim</p>
        </aside>
      </div>
      <Navbar></Navbar>
    </div>
  );
};

export default Home;
