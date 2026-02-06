const menu = require("../menudata/menu.json");
const UserPermission = require("../Models/UserPermission");
const Registereduser = require("../Models/User");

// 🔥 FILTER FUNCTION (same as before)
const filterMenuByPermission = (menu, permissions) => {
  return menu
    .map(section => {

      // ===== SIMPLE MENU =====
      if (section.items) {
        const items = section.items.filter(item =>
          permissions.some(p =>
            p.section === section.title &&
            p.screenName === item.title &&
            p.permissions.view === true
          )
        );
        return items.length ? { ...section, items } : null;
      }

      // ===== NESTED MENU =====
      if (section.subMenu) {
        const subMenu = section.subMenu
          .map(sub => {
            const children = sub.children.filter(child =>
              permissions.some(p =>
                p.section === section.title &&
                p.screenName === child.title &&
                p.permissions.view === true
              )
            );

            return children.length ? { ...sub, children } : null;
          })
          .filter(Boolean);

        return subMenu.length ? { ...section, subMenu } : null;
      }

      return null;
    })
    .filter(Boolean);
};

// 🎯 API
const getUserMenu = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const userId = req.userId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(403).json({ message: "Invalid Hotel" });
    }

    /* =================================================
       🔑 OWNER → FULL MENU (NO PERMISSION CHECK)
    ================================================= */
    if (req.loginType === "OWNER") {
      return res.status(200).json(menu); // 🔥 full access
    }

    /* =================================================
       👤 USER → PERMISSION BASED MENU
    ================================================= */
    const permissions = await UserPermission.find({
      hotelId: hotel._id,
      userMasterId: userId
    }).select("section screenName permissions");

    const filteredMenu = filterMenuByPermission(menu, permissions);

    res.status(200).json(filteredMenu);

  } catch (err) {
    res.status(500).json({
      message: "Menu load failed",
      error: err.message
    });
  }
};

module.exports = { getUserMenu };
