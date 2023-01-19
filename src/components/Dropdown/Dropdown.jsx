import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import useOnClickOutside from "../../hooks/useOnClickOutside";

import "./Dropdown.scss";

const Dropdown = ({
  withCheckmarks,
  defaultValue,
  options,
  onChoose,
  children,
  labelText,
  notBig = false,
}) => {
  const dropdownRef = useRef();
  const menuRef = useRef();

  const [value, setValue] = useState("");
  const [value2, setValue2] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const closeDrawer = () => {
    setShowDropdown(false);
  };

  const toggleDrawer = () => {
    setShowDropdown((showDropdown) => !showDropdown);
  };

  const chooseOptionHandler = (text, text2) => {
    setValue(text);
    setValue2(text2);
    closeDrawer();
  };

  useOnClickOutside(dropdownRef, closeDrawer);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  // useEffect(() => {
  //   setValue(options[0].label);
  //   setValue2(options[0].value);
  // }, [defaultValue]);

  useEffect(() => {
    if (onChoose) onChoose(value);
  }, [value, onChoose]);

  return (
    <div className="dropdown-big" ref={dropdownRef}>
      {defaultValue && !notBig ? (
        <div className="dropdown-big__main" onClick={toggleDrawer}>
          <div className="text">{value}</div>
          <img
            className="icon"
            src="/assets/vectors/icons/dropdown.svg"
            alt="dropdown"
            title="dropdown"
          />
        </div>
      ) : (
        <div onClick={toggleDrawer}>{children}</div>
      )}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            className={clsx(
              "dropdown-big__options",
              withCheckmarks && "with-checkmarks"
            )}
            ref={menuRef}
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            key={"dropdown-optoins" + Math.random()}
          >
            {withCheckmarks && (
              <div className="option label">
                {labelText}
                <img
                  className="cross"
                  src="/assets/vectors/icons/close-3.svg"
                  alt="cross"
                  onClick={closeDrawer}
                />
              </div>
            )}
            {options?.map((el, idx) => {
              const { img, label, inActive } = el;
              return (
                <div
                  className={clsx("option", label === value && "active")}
                  key={"dropdown-option-" + label + idx}
                  onClick={() => {
                    if (!inActive) chooseOptionHandler(label);
                  }}
                >
                  {img && <img src={img} alt={label} />}
                  {label}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
