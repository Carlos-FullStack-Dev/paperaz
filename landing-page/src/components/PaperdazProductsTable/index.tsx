import { useState, useEffect } from "react";
import productCheckIcon from "../../assets/produceCheckIcon.svg";
import productMenuIcon from "../../assets/produceMenuIcon.svg";
import starIcon from "../../assets/greenStar.svg";
import registerArrow from "../../assets/registerArrow.svg";
import Icon from "../Icon";
import { useAppContext } from "../../context";

const PaperdazProductsTable = ({
  toggleOpenModal,
}: {
  toggleOpenModal: () => void;
}) => {
  const { toggleRegisterModal } = useAppContext();

  const [isSwitched, setIsSwitched] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const { isRegisterModalOpen, updateTableSubmitScriptionPayload } =
    useAppContext();

  const [items, setItems] = useState([
    { feature: "Team Member", price: 2, quantity: 1 },
    { feature: "PaperLink Page", price: 2, quantity: 1 },
    {
      feature: "Fillable PDF",
      otherFeature: "(One time charge)",
      price: 5,
      quantity: 0,
    },
    {
      feature: "White Glove Service",
      otherFeature: "(One time charge)",
      price: 1,
      quantity: 0,
      isChecked: false,
      icon: true,
    },
  ]);

  const incrementQuantity = (index: number) => {
    const updatedItems = [...items];
    if (updatedItems[index].feature === "White Glove Service" && !isChecked)
      return;
    updatedItems[index].quantity++;

    setItems(updatedItems);
  };

  const decrementQuantity = (index: number) => {
    const updatedItems = [...items];
    if (updatedItems[index].feature === "White Glove Service" && !isChecked)
      return;

    if (updatedItems[index].quantity > 0) {
      updatedItems[index].quantity--;
      if (
        (updatedItems[index].feature === "Team Member" ||
          updatedItems[index].feature === "PaperLink Page") &&
        updatedItems[index].quantity === 0
      ) {
        updatedItems[index].quantity = 1;
      }
    }

    setItems(updatedItems);
  };

  const toggleSwitch = () => {
    setIsSwitched(!isSwitched);
  };

  const toggleCheck = (index: number) => {
    const updatedItems = [...items];

    if (!isChecked) {
      updatedItems[index].quantity = items[1].quantity;
    } else {
      updatedItems[index].quantity = 0;
    }
    setIsChecked(!isChecked);
    setItems(updatedItems);
  };

  const getTotalAmount = () => {
    const total = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const sum = total + 10;
    const defaultYearPrice = sum * 12;
    const percentageDiscountTotal = defaultYearPrice * 0.2;

    if (isSwitched) return defaultYearPrice - percentageDiscountTotal;

    return sum;
  };
  // const BASE_URL = import.meta.env.VITE_APP_BASE_API_URL;
  const DEV_BASE_URL = import.meta.env.VITE_APP_DEV_FRONT_URL;
  const registerURL = DEV_BASE_URL + "/register"
  const payload = {
    action: "subscribe",
    plan: isSwitched ? "yearly" : "monthly",
    companyLedger: true,
    packageName: "Custom",
    paperlink: items[1].quantity,
    publicProfile: true,
    teamMembers: items[0].quantity,
    cc: 1,
    isWhiteGloveService: isChecked,
    whiteGloveService: items[1].quantity,
    userId: null,
    fillablePdf: items[2].quantity,
    totalAmount: getTotalAmount(),
  };

  useEffect(() => {
    if (isRegisterModalOpen) {
      updateTableSubmitScriptionPayload(payload);
    }
  }, [isRegisterModalOpen, items]);

  return (
    <div id="register">
      <div className="lg:relative max-sm:hidden bg-[#EDFCE987]">
        <img
          src={starIcon}
          alt="starIcon"
          className="absolute max-lg:hidden bottom-10 left-28 transform max-sm:translate-x-1/4 translate-x-3/4 -translate-y-1/4 w-12"
        />
        <div className="absolute max-lg:hidden top-20 left-0 transform max-sm:translate-x-1/4 translate-x-3/4 -translate-y-1/4 w-20 ">
          <Icon />
        </div>
        <div className="p-20 max-md:p-10 max-sm:p-2.5 max-sm:mb-10 mt-10 ">
          <p className="text-center">Pay annually and get a 20% discount </p>
          <div className="flex items-center justify-center">
            <div
              className="mt-5 xl:w-1/2 lg:w-[70%] max-lg:w-full max-sm:w-full max-lg:overflow-x-scroll p-3 rounded-[20px] bg-white"
              style={{ border: "3px solid #5FA348" }}
            >
              <div className="flex items-center justify-center">
                <table className="w-full border-collapse overflow-x-auto">
                  <thead className="bg-white p-5">
                    <tr className="bg-white p-5">
                      <th className="p-2 pt-5">
                        <div className="flex gap-5 max-sm:gap-3 items-center justify-start">
                          <span className="border-b-2 border-green-500 pb-0.5">
                            Feature
                          </span>
                          <img
                            onClick={toggleOpenModal}
                            src={productMenuIcon}
                            alt="productMenuIcon"
                            className="cursor-pointer w-7 max-sm:w-4 text-primary bg-[#FFDE17]"
                          />
                        </div>
                      </th>
                      <th className="p-2 pt-5">
                        <span className="border-b-2 border-green-500 pb-0.5">
                          Price/unit
                        </span>
                      </th>
                      <th className="p-2 pt-5">
                        <span className="border-b-2 border-green-500 pb-0.5">
                          Quantity
                        </span>
                      </th>
                      <th className="p-2 pt-5">
                        <span className="border-b-2 border-green-500 pb-0.5">
                          Amount
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white max-sm:text-sm">
                    <tr className="pt-10 max-sm:text-sm">
                      <td className="p-2 py-7 pl-3 max-sm:text-sm items-center">
                        Business Page
                      </td>
                      <td className="p-2 py-7 text-center items-center ">
                        <div className="flex justify-center items-center">
                          <img
                            src={productCheckIcon}
                            alt="productCheckIcon"
                            className="w-4"
                          />
                        </div>
                      </td>
                      <td className="p-2 py-7 text-center items-center">
                        <div className="flex justify-center items-center">
                          <img
                            src={productCheckIcon}
                            alt="productCheckIcon"
                            className="w-4"
                          />
                        </div>
                      </td>
                      <td className="p-2 pl-5 py-7 text-center items-center">
                        $10.00
                      </td>
                    </tr>
                    {items.map((item, index) => (
                      <tr key={index} className="border-t max-sm:text-sm">
                        <td className="p-3 flex gap-1 items-center">
                          {item.icon ? (
                            <div className="flex flex-row gap-1 items-center">
                              <input
                                checked={isChecked}
                                onChange={() => toggleCheck(index)}
                                type="checkbox"
                                className="form-checkbox cursor-pointer outline-none h-4 w-4 rounded border-primary text-primary focus:ring-primary form-checkbox"
                              />
                              {item.feature}
                            </div>
                          ) : (
                            <>{item.feature}</>
                          )}

                          <span className="text-[0.5rem] text-[#707070]">
                            {item.otherFeature}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="p-5 lg:flex lg:justify-center">
                          <div className="bg-[#EFEFEF] text-center rounded-lg lg:max-w-[100px] flex flex-row  justify-center items-center p-0.5 max-sm:p-0.5">
                            <button
                              className="p-0.5 px-3.5 rounded-md max-sm:width "
                              onClick={() => decrementQuantity(index)}
                            >
                              {item.feature !== "White Glove Service"
                                ? "-"
                                : ""}
                            </button>
                            <span className="p-0.5 px-3.5 rounded-lg bg-white">
                              {item.feature === "White Glove Service" &&
                              isChecked
                                ? `${items[1].quantity}`
                                : `${item.quantity}`}
                            </span>
                            <button
                              className="p-0.5 px-3.5 rounded-md "
                              onClick={() => incrementQuantity(index)}
                            >
                              {item.feature !== "White Glove Service"
                                ? "+"
                                : ""}
                            </button>
                          </div>
                        </td>
                        <td className="pl-5 text-center">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t border-[#5FA348] ">
                <h3 className="py-7 max-sm:py-3 pl-3 font-bold max-sm:pl-20">
                  {!isSwitched ? "Monthly" : "Yearly"} Amount:
                </h3>
                <div className="flex py-7 max-sm:pb-0  max-sm:gap-3 gap-5 items-center max-sm:mb-28">
                  <p>Monthly</p>{" "}
                  <Switch isSwitched={isSwitched} toggleSwitch={toggleSwitch} />
                  <p>Yearly</p>
                </div>
                <h3 className="py-7 pr-5 max-sm:py-3  font-bold text-right max-sm:pr-20">
                  ${getTotalAmount().toFixed(2)}
                </h3>
              </div>
            </div>
          </div>
          <div className="absolute max-lg:hidden right-0 transform -translate-x-3/4 translate-y-1/4 bottom-32 w-20">
            <Icon />
          </div>
          <img
            src={starIcon}
            alt="starIcon"
            className="absolute max-lg:hidden  top-10 right-28 transform max-sm:-translate-x-1/4 -translate-x-3/4 translate-y-1/4 w-12"
          />
          <div className="text-center py-10 ml-20 mt-5">
            <a
              href={registerURL}
              className="bg-primary text-white py-3 px-10 rounded-lg shadow-md hover:shadow-xl inline-block"
            >
              Register
            </a>
            <img
              src={registerArrow}
              alt="registerArrow"
              className="inline-block pb-12 ml-3 w-32"
            />
          </div>
        </div>
      </div>

      <div className="sm:hidden mx-1 w-full max-xsm:mx-0.5">
        <div className="flex justify-around items-center py-5 max-xsm:px-[1rem] bg-[#EDFCE987]">
          <p className="max-sm:text-[0.7rem]">
            Pay annually and get a 20% discount
          </p>
          <img
            onClick={toggleOpenModal}
            src={productMenuIcon}
            alt="productMenuIcon"
            className="cursor-pointer w-10 max-sm:w-[1.5rem] text-primary bg-[#FFDE17]"
          />
        </div>
        <div className="flex items-center justify-center">
          <table className=" border-collapse max-xsm:text-[0.5rem] bg-white rounded-t-5xl                                                     ">
            <thead className="bg-white ">
              <tr className="bg-white  max-sm:p-0 p-5">
                <th className="p-2 text-start pt-5">
                  <span className="border-b-2 max-sm:text-[0.7rem] max-xsm:text-[0.55rem] border-green-500 pb-0.5">
                    Feature
                  </span>
                </th>
                <th className="p-2 pt-5">
                  <span className="border-b-2 max-sm:text-[0.7rem] max-xsm:text-[0.55rem] border-green-500 pb-0.5">
                    Price/unit
                  </span>
                </th>
                <th className="p-2 pt-5">
                  <span className="border-b-2 max-sm:text-[0.7rem] max-xsm:text-[0.55rem] border-green-500 pb-0.5">
                    Quantity
                  </span>
                </th>
                <th className="p-2  pt-5">
                  <span className="border-b-2 max-sm:text-[0.7rem] max-xsm:text-[0.55rem] border-green-500 pb-0.5">
                    Amount
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white max-sm:text-[0.7rem] max-xsm:text-[0.5rem]">
              <tr className="pt-10 max-sm:text-[0.7rem] max-xsm:text-[0.5rem]">
                <td className="p-2  items-center pl-3.5 py-7 max-sm:text-[0.7rem] max-xsm:text-[0.5rem]">
                  Business Page
                </td>
                <td className="p-2 py-7  text-center ">
                  <div className="flex justify-center items-center">
                    <img
                      src={productCheckIcon}
                      alt="productCheckIcon"
                      className="w-4 max-xsm:w-3 "
                    />
                  </div>
                </td>
                <td className="p-2 py-7 text-center">
                  <div className="flex justify-center items-center">
                    <img
                      src={productCheckIcon}
                      alt="productCheckIcon"
                      className="w-4 max-xsm:w-3"
                    />
                  </div>
                </td>
                <td className="p-2 py-7 text-center max-sm:text-[0.7rem] max-xsm:text-[0.5rem]">
                  $10.00
                </td>
              </tr>
              {items.map((item, index) => (
                <tr
                  key={index}
                  className="border-t max-sm:text-[0.7rem] max-xsm:text-[0.5rem]"
                >
                  <td className="p-3 flex flex-col gap-1">
                    {item.icon ? (
                      <div className="flex flex-row gap-1 items-center">
                        <input
                          checked={isChecked}
                          onChange={() => toggleCheck(index)}
                          type="checkbox"
                          className="form-checkbox cursor-pointer outline-none h-4 w-4 rounded border-primary text-primary focus:ring-primary form-checkbox"
                        />
                        {item.feature}
                      </div>
                    ) : (
                      <>{item.feature}</>
                    )}

                    <span className="max-sm:text-[0.5rem] max-xsm:text-[0.4rem] text-[#707070]">
                      {item.otherFeature}
                    </span>
                  </td>
                  <td className="p-3 text-center">${item.price.toFixed(2)}</td>
                  <td className="p-5 lg:flex lg:justify-center">
                    <div className="bg-[#EFEFEF] text-center rounded-lg lg:max-w-[100px] flex flex-row  justify-center items-center p-0.5 max-sm:p-0.5">
                      <button
                        className="p-0.5 px-3.5 rounded-md max-sm:px-1 "
                        onClick={() => decrementQuantity(index)}
                      >
                        {item.feature !== "White Glove Service" ? "-" : ""}
                      </button>
                      <span className="p-0.5 px-3.5 max-sm:px-2 rounded-lg bg-white">
                        {item.feature === "White Glove Service" && isChecked
                          ? `${items[1].quantity}`
                          : `${item.quantity}`}
                      </span>
                      <button
                        className="p-0.5 px-3.5 max-sm:px-1 rounded-md "
                        onClick={() => incrementQuantity(index)}
                      >
                        {item.feature !== "White Glove Service" ? "+" : ""}
                      </button>
                    </div>
                  </td>
                  <td className="pl-5 text-center max-sm:px-1">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col items-center justify-center border-t border-[#5FA348] max-sm:text-[0.5rem]">
          <div className="flex py-7 max-sm:pb-0 max-sm:text-[0.5rem] pb-30 max-sm:gap-3 gap-5 items-center ">
            <p>Monthly</p>{" "}
            <Switch isSwitched={isSwitched} toggleSwitch={toggleSwitch} />
            <p>Yearly</p>
          </div>
          <div className="flex justify-around gap-20 mt-5 items-center">
            <h3 className="py-7 max-sm:py-3 font-bold  max-sm:text-[0.5rem]">
              {!isSwitched ? "Monthly" : "Yearly"} Amount:
            </h3>
            <h3 className="py-7 max-sm:py-3 max-sm:text-[0.5rem] font-bold">
              ${getTotalAmount().toFixed(2)}
            </h3>
          </div>
        </div>
        <div className="text-center py-5">
          <button
            onClick={toggleRegisterModal}
            className="bg-primary text-white py-2.5 max-xsm:py-1.5 px-10 rounded-lg shadow-md hover:shadow-xl"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaperdazProductsTable;

interface SwitchProps {
  isSwitched: boolean;
  toggleSwitch: () => void;
}

const Switch = ({ isSwitched, toggleSwitch }: SwitchProps) => {
  return (
    <div className="flex items-center focus:bg-none">
      <label className="cursor-pointer focus:bg-none">
        <div
          className={`relative bg-[#EBEBEB]  max-sm:w-12 max-sm:h-5 rounded-full w-14 h-7 transition duration-300 ease-in-out`}
        >
          <div
            className={`absolute left-0 ${
              isSwitched ? "translate-x-6" : "translate-x-0"
            } w-7 h-7 max-sm:w-5 max-sm:h-5 bg-primary rounded-full shadow-md transform transition-transform duration-300 ease-in-out`}
          />
        </div>
        <input type="checkbox" className="hidden" onClick={toggleSwitch} />
      </label>
    </div>
  );
};
