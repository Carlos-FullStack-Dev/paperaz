import loginIcon from "../../assets/loginIcon.svg";
import signinIcon from "../../assets/signLinkIcon.svg";
import { useAppContext } from "../../context";
import Modal from "../../components/modal";

const Login = () => {
  const { isLoginModalOpen, toggleLoginModal } = useAppContext();
  const paperlinkLogin = () => {
    const url = `https://dev.paperlink.app/login`;
    window.location.href = url;
  }
  const signlinkLogin = () => {
    const url = `https://dev.paperlink.app/login`;
    window.location.href = url;
  }

  return (
    <Modal
      isModalOpen={isLoginModalOpen}
      toggleOpenModal={toggleLoginModal}
      width="w-[500px]"
    >
      <div className="flex items-center justify-center px-3 py-3 max-sm:pb-5 rounded-lg">
        <div className="w-full">
          <div className="flex flex-row gap-3 items-center justify-center" onClick={() => paperlinkLogin()}>
            <img src={loginIcon} alt="loginIcon" className="w-10 max-xsm:w-7" />
            <h2 className="text-center text-3xl max-sm:text-lg text-primary">
              Paper<span className="text-black">Link</span> Console
            </h2>
          </div>
          <div className="flex flex-row gap-3 items-center justify-center  pb-10 pt-10" onClick={() => signlinkLogin()}>
            <img src={signinIcon} alt="signinIcon" className="w-10 max-xsm:w-7" />
            <h2 className="text-center text-3xl max-sm:text-lg text-primary">
              <span className="text-orange-500">SigninLink</span> Console
            </h2>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Login;
