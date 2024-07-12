// import { useNavigate } from "react-router-dom";
import starLogo from "../../assets/star.svg";
// import navigations from "../../navigations";
const DEV_BASE_URL = import.meta.env.VITE_APP_DEV_FRONT_URL;


function AllPaperdazLinks() {
  // const navigate = useNavigate();
  const links = [
    { name: "PaperLink", url : DEV_BASE_URL },
    { name: "SigninLink", url : "" },
    { name: "TimeLink", url : "" },
    { name: "HostLink", url : "" },
    { name: "RxLink", url : "" },
  ];
  return (
    <div className="lg:relative bg-[#77C360] w-full max-sm:h-[70px] h-[120px] flex flex-row justify-center lg:gap-0  max-md:gap-3 max-[350px]:gap-1 max-sm:gap-3 items-center overflow-x-auto overflow-hidden ">
      <img
        src={starLogo}
        alt="starLogo"
        className="absolute max-lg:hidden bottom-0 left-0 transform max-sm:translate-x-1/4 translate-x-3/4 -translate-y-1/4 w-10 max-sm:w-6 h-auto"
      />
      {links.map(({ name, url }, index) => (
        <div
          key={index}
          className="text-center md:gap-0 max-sm:gap-2 max-[350px]:gap-1 max-md:max-sm:gap-1 flex justify-center lg:justify-around items-center"
        >
          <a
            // onClick={() => {
            //   if (name === "PaperLink") {
            //     navigate(navigations.PAPER_LINK, {
            //       state: { path: "paperdaz-link" },
            //     });
            //   } else {
            //     navigate(navigations.LANDING_PAGE, {
            //       state: { path: "paperdaz-card" },
            //     });
            //   }
            // }}
            href={url}
            className="text-white max-[350px]:text-[0.6rem] max-md:text-[0.7rem] max-xsm:text-[0.5rem] lg:hover:font-bold lg:mx-20 mx-10 max-sm:mx-0 text-lg max-sm:text-[0.8rem] md:max-sm:text-base whitespace-nowrap hover:underline cursor-pointer "
          >
            {name}
          </a>
          {index !== links?.length - 1 && (
            <div className="bg-white h-10 w-[1px] " />
          )}
        </div>
      ))}

      <img
        src={starLogo}
        alt="starLogo"
        className="absolute max-lg:hidden top-0 right-0 transform max-sm:-translate-x-1/4 -translate-x-3/4 translate-y-1/4 w-10 max-sm:w-6 h-auto"
      />
    </div>
  );
}

export default AllPaperdazLinks;
