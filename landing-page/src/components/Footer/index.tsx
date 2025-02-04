import { useNavigate } from "react-router-dom";
import footerLogo from "../../assets/footerlogo.svg";
import {
  FaFacebookSquare,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import navigations from "../../navigations";
const DEV_BASE_URL = import.meta.env.VITE_APP_DEV_FRONT_URL;
function Footer() {
  const navigate = useNavigate();

  const register = () => {
    navigate(navigations.PAPER_LINK, {
      state: { path: "register" },
    });
  };

  return (
    <footer className="bg-black text-gray-300">
      <div className="container max-md:text-center mx-auto py-8 px-4 md:px-8 lg:px-5 xl:px-7">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 max-sm:gap-3 item-center">
          <div className="mb-8 lg:mr-[100px] ">
            <div className="flex flex-col item-center justify-center text-center">
              <div className="flex item-center justify-center text-center ">
                <img
                  src={footerLogo}
                  alt="logo"
                  className="w-[120px] md:w-[200px] cursor-pointer "
                  onClick={() =>
                    navigate(navigations.LANDING_PAGE, {
                      state: { home: "home" },
                    })
                  }
                />
              </div>
              <p className="my-2">Today’s Paper</p>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl max-xl:text-lg font-semibold mb-4 underline">
              Company
            </h2>
            <div className="max-sm:text-lg">
              <p
                onClick={() => {
                  navigate(navigations.LANDING_PAGE, {
                    state: { path: "about-us" },
                  });
                }}
                className="mb-2 hover:underline cursor-pointer"
              >
                About
              </p>
              <p
                onClick={() =>
                  navigate(navigations.LANDING_PAGE, {
                    state: { path: "paperdaz-card" },
                  })
                }
                className="mb-2 hover:underline cursor-pointer"
              >
                Paperdaz Lab
              </p>
              <p
                className="mb-2 hover:underline cursor-pointer"
                onClick={register}
              >
                Register
              </p>
              <p
                onClick={() => navigate(navigations.PRIVACY_POLICY)}
                className="mb-2 hover:underline cursor-pointer"
              >
                Privacy Policy
              </p>
              <p
                onClick={() => navigate(navigations.TERMS_AND_CONDITIONS)}
                className="mb-2 hover:underline cursor-pointer"
              >
                Terms & Conditions
              </p>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl max-xl:text-lg font-semibold mb-4 underline">
              Products
            </h2>
            <div className="max-sm:text-lg">
              <a
                href={DEV_BASE_URL}
                // onClick={() =>
                //   navigate(navigations.PAPER_LINK, {
                //     state: { path: "paperdaz-link" },
                //   })
                // }
                className="mb-2 hover:underline cursor-pointer "
              >
                PaperLink
              </a>
              <p
                onClick={() =>
                  navigate(navigations.LANDING_PAGE, {
                    state: { path: "paperdaz-card" },
                  })
                }
                className="mb-2 hover:underline cursor-pointer "
              >
                SigninLink
              </p>
              <p
                onClick={() =>
                  navigate(navigations.LANDING_PAGE, {
                    state: { path: "paperdaz-card" },
                  })
                }
                className="mb-2 hover:underline cursor-pointer "
              >
                TimeLink
              </p>
              <p
                onClick={() =>
                  navigate(navigations.LANDING_PAGE, {
                    state: { path: "paperdaz-card" },
                  })
                }
                className="mb-2 hover:underline cursor-pointer "
              >
                HostLink
              </p>
              <p
                onClick={() =>
                  navigate(navigations.LANDING_PAGE, {
                    state: { path: "paperdaz-card" },
                  })
                }
                className="mb-2 hover:underline cursor-pointer "
              >
                RxLink
              </p>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl max-xl:text-lg  font-semibold mb-4 underline">
              Support
            </h2>
            <div className="max-sm:text-lg">
              <p
                onClick={() => navigate(navigations.FAQ)}
                className="mb-2 hover:underline cursor-pointer"
              >
                QnA’s
              </p>
              <p
                onClick={() =>
                  navigate(navigations.CONTACT_US, {
                    state: { path: "contact" },
                  })
                }
                className="mb-2 hover:underline cursor-pointer "
              >
                Contact
              </p>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl  max-xl:text-lg  font-semibold mb-4 underline">
              Get Latest Updates
            </h2>
            <div className="flex mb-2 item-center justify-start max-md:justify-center">
              <div className="mr-4">
                <p className="bg-[#151313] p-2 rounded-full">
                  <a
                    href="https://www.facebook.com/profile.php?id=100083511528467"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaFacebookSquare size={24} className="text-[#77C360]" />
                  </a>
                </p>
              </div>
              <div className="mr-4">
                <p className="bg-[#151313] p-2 rounded-full">
                  <a
                    href="https://twitter.com/Paperdaz_"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaTwitter size={24} className="text-[#77C360]" />
                  </a>
                </p>
              </div>
              <div className="mr-4">
                <p className="bg-[#151313] p-2 rounded-full">
                  <a
                    href="https://www.instagram.com/paperdaz_/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaInstagram size={24} className="text-[#77C360]" />
                  </a>
                </p>
              </div>
              <div>
                <p className="bg-[#151313] p-2 rounded-full">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.linkedin.com/company/paperdaz/mycompany/?viewAsMember=true"
                  >
                    <FaLinkedin size={24} className="text-[#77C360]" />
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 pt-8 mt-8 text-center">
          <p>
            &copy; {new Date().getFullYear()} Paperdaz. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
