const {
  findCompanyByEmail,
  createCompany,
  findCompanyById,
  findCompanyByIdAndDelete,
  findCompanyByIdAndUpdate,
  findCompanyByName,
  findAllCompanies,
} = require("../models/company");
const { validateWebsite } = require("../utils/validators");

exports.registerCompany = async (req, res) => {
  const { name, industry, location, website, size, description } = req.body;

  if (!validateWebsite(website)) {
    return res.status(400).json({
      success: false,
      message: "Invalid website URL format.",
    });
  }

  try {
    const existingCompany = await findCompanyByName(name);

    if (existingCompany) {
      return res.status(400).json({ success: false, message: "Company already exists." });
    }

    const result = await createCompany(name, industry, location, website, size, description);

    const newCompany = await findCompanyById(result.insertId);

    return res.status(201).json({
      success: true,
      message: "Company registered successfully.",
      company: newCompany
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error!" });
  }
};

exports.allCompaines = async (req, res) => {
  try {
    const companies = await findAllCompanies();

    res.status(200).json({ success: true, companies });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error !" });
  }
};

exports.removeCompany = async (req, res) => {
  const { id } = req.params;
  try {
    const company = await findCompanyById(id);

    if (!company)
      return res
        .status(404)
        .json({ success: false, message: "Company not found !" });

    const result = await findCompanyByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Company removed successfully." });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error !" });
  }
};

exports.getCompanyData = async (req, res) => {
  const { id } = req.params;
  try {
    const company = await findCompanyById(id);
    if (!company)
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    res.status(200).json({ success: true, company });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error !" });
  }
};

exports.updateCompanyData = async (req, res) => {
  const { id } = req.params;
  try {
    const company = await findCompanyById(id);
    if (!company)
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });

    const result = await findCompanyByIdAndUpdate(id, req.body);
    const updatedCompanyData = await findCompanyById(id);

    res.status(200).json({ success: true, Company: updatedCompanyData });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error !" });
  }
};
