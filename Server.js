require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();
const { connectToDatabase } = require('./utils/db');
const contactrouter=require('./Router/Contact-route');
const adminrouter = require('./Router/admin-router');
const userrouter=require('./Router/User-routes');
const checkinRouter = require("./Router/checkin-router");
const generalParameterRoute = require("./Router/generalParameterRoute.js");
const checkoutParameterRoutes = require("./Router/checkoutParameterRoutes.js");
const postingParameterRoutes = require("./Router/postingParameterRoutes.js");
const rateTypeRoutes = require("./Router/rateTyperoutes.js");
const instruction=require("./Router/instructionRoutes.js");
const businessSourceController = require("./Router/businessSourceRoutes.js");
const guestStatusRoutes = require("./Router/guestStatusRoutes.js");
const chargeMasterRoutes = require("./Router/chargeMasterRoutes.js");
const planMasterRoutes = require("./Router/planMasterRoutes.js");
const roomFeatureRoutes = require("./Router/roomFeatureRoutes.js");
const roomCategoryRoutes = require("./Router/roomCategoryRoutes.js");
const roomMasterRoutes = require("./Router/roomMasterRoutes.js");
const roomCategorydata = require("./Router/Roomcategorydata.js");
const bookingSourceRoutes = require("./Router/BookingSourceRoutes.js");
const companyRoutes = require("./Router/companyRoutes.js");
const groupAccountRoutes = require("./Router/groupAccount.routes.js");
const ledgerAccountRoutes = require("./Router/ledgerAccountRoutes.js");
const textmasterRoutes = require("./Router/taxMasterRoutes.js");
const taxStructureRoutes = require("./Router/taxStructureRoutes.js");
const paymentMasterRoutes = require("./Router/paymentMasterRoutes.js");
const BillPrintingRoutes = require("./Router/billPrintingRoutes.js");
const KotPrintingRoutes = require("./Router/kotPrintingRoutes.js");
const userMasterRoutes = require("./Router/userMaster.routes.js");
const userPermissionRoutes = require("./Router/userPermission.routes.js");
const sidebarRoutes = require("./Router/sidebar.routes.js");
const menubarRaoutes = require("./Router/menu.routes.js");
const sundryMasterRoutes =require("./Router/sundryMasterRoutes.js");
const countryRoutes=require("./Router/countryRoutes.js");
const stateRoutes=require("./Router/stateRoutes.js");
const cityRoutes=require("./Router/cityRoutes.js");
const departmentRoutes=require("./Router/departmentRoutes.js");
const ledgerRoutes=require("./Router/ledger.routes.js");
const UnitMasterRoutes=require("./Router/UnitMasterRoutes.js");
const nightAuditChargePostingRoutes=require("./Router/nightAuditRoutes.js");
const financialYearRoutes=require("./Router/financialYearRoutes.js");
const outletRoutes=require("./Router/outletRoutes.js");
const voucherFormulaRoutes = require("./Router/voucherFormulaRoutes.js");
const serverRoutes = require("./Router/serverMasterRoutes.js");
const tableMasterRoutes = require("./Router/tableMasterRoutes.js");
const itemRoutes = require("./Router/itemRoutes.js");
const itemGroupRoutes = require("./Router/itemGroupRoutes.js");
const MenuCategoryRoutes=require("./Router/menuCategoryRoutes.js");


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
const allrouter= require('./Router/auth-router');
const errorMiddleware = require('./MIddlewares/error-Middleware');
app.use('/route', allrouter);
app.use('/contact',contactrouter)
app.use('/admin', adminrouter);
app.use('/user', userrouter);
app.use("/checkin", checkinRouter);
app.use("/parameters", generalParameterRoute);
app.use("/checkout-parameters", checkoutParameterRoutes);
app.use("/posting-parameters", postingParameterRoutes);
app.use("/rate-type", rateTypeRoutes);
app.use("/instructions", instruction);
app.use("/business-source", businessSourceController);
app.use("/guest-status", guestStatusRoutes);
app.use("/charge-master", chargeMasterRoutes);
app.use("/plan-master", planMasterRoutes);
app.use("/room-feature", roomFeatureRoutes);
app.use("/room-category", roomCategoryRoutes);
app.use("/room-master", roomMasterRoutes);
app.use("/room-category-data", roomCategorydata);
app.use("/booking-source", bookingSourceRoutes);
app.use("/company", companyRoutes);
app.use("/group-account", groupAccountRoutes);
app.use("/ledger-account", ledgerAccountRoutes);
app.use("/tax-master", textmasterRoutes);
app.use("/tax-structure", taxStructureRoutes);
app.use("/payment-master", paymentMasterRoutes);
app.use("/bill-printing", BillPrintingRoutes);
app.use("/kot-printing", KotPrintingRoutes);
app.use("/user-master", userMasterRoutes);
app.use("/user-permission", userPermissionRoutes);
app.use("/sidebar-data", sidebarRoutes);
app.use("/menu",menubarRaoutes);
app.use("/sundry",sundryMasterRoutes);
app.use("/country",countryRoutes);
app.use("/state",stateRoutes);
app.use("/city",cityRoutes);
app.use("/department",departmentRoutes);
app.use("/ledger",ledgerRoutes);
app.use("/unit",UnitMasterRoutes);
app.use("/",nightAuditChargePostingRoutes);
app.use("/financial-year",financialYearRoutes);
app.use("/outlet",outletRoutes);
app.use("/voucher-formula", voucherFormulaRoutes);
app.use("/server-master", serverRoutes);
app.use("/table-master", tableMasterRoutes);
app.use("/item", itemRoutes);
app.use("/item-group", itemGroupRoutes);
app.use("/menu-category",MenuCategoryRoutes);

app.use(errorMiddleware);

connectToDatabase(process.env.MONGODB_URI)
.then(() => {
  console.log('Connected to MongoDB successfully');
  app.listen(process.env.PORT, () => {
  console.log(`Server is running at https://axisitinfo.com:${process.env.PORT}`);
});
}).catch((error) => {
  console.error('Error connecting to the database:', error);
  throw error; // Re-throw the error to be handled by the caller
});