import React, { useState } from "react";
import SideBarNavItem from "./sideBarNav/sideBarNavItem.jsx";
import routes from "../../../routers/routes.jsx";
import { useNavigate } from "react-router-dom";
import SideBarDropdown from "./sideBarDropdown/sideBarDropdown.jsx";
import SideBarDropdownItem from "./sideBarDropdown/sideBarDropdownItem.jsx";

const SideBarMenu = (props) => {
  const [activeLink, setActiveLink] = useState(null);
  const navigate = useNavigate();

  const handleNavContainerClick = (link) => {
    if (activeLink === link) {
      setActiveLink(null);
    } else {
      setActiveLink(link);
    }
  };

  const handleNavItemClick = (link) => {
    navigate(link);
    setActiveLink(link);
  };

  return routes.map((d) => {
    if (d.path === "*") {
      return null;
    }
    if (d.children) {
      return (
        <SideBarDropdown
          path={d.path}
          name={d.name}
          key={d.path}
          icon={d.icon}
          permission={d.permission}
          onClick={handleNavContainerClick}
          activeLink={activeLink}
        >
          {d.children.map((v) => {
            return (
              <SideBarDropdownItem
                link={v.path}
                key={v.path}
                permission={v.permission}
                onClick={handleNavItemClick}
                icon={v.icon}
                name={v.name}
              />
            );
          })}
        </SideBarDropdown>
      );
    } else {
      return (
        <SideBarNavItem
          link={d.path}
          key={d.path}
          icon={d.icon}
          permission={d.permission}
          onClick={handleNavItemClick}
          isActive={activeLink === d.path}
          name={d.name}
        />
      );
    }
  });
};

export default SideBarMenu;
