const {
  createApplication,
  findApplicationById,
  allApplications,
  removeApplication,
  findApplicationByJobAndUser,
  findApplicationsByJobId,
} = require("../models/applications");

exports.createApplication = async (req, res) => {
  const { jobId, userId } = req.body;
  const resumeFile = req.files?.resume?.[0]?.filename;
  const coverLetterFile = req.files?.coverLetter?.[0]?.filename;
  
  console.log(jobId, userId, resumeFile, coverLetterFile)
  try {
    if (!jobId || !userId || !resumeFile || !coverLetterFile) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const existingApplication = await findApplicationByJobAndUser(jobId, userId);
    if (existingApplication) {
      return res.status(400).json({ success: false, message: 'User has already applied for this job.' });
    }

    const result = await createApplication(jobId, userId, `/applications/${resumeFile}`, `/applications/${coverLetterFile}`);
    if (!result.insertId) {
        return res.status(500).json({ success: false, message: "Failed to create application!" });
    }  
    
    const newApplication = await findApplicationById(result.insertId);

    if (!newApplication) {
        return res.status(500).json({ success: false, message: "Application not found!" });
    }
  
    res.status(201).json({ success: true, Application: newApplication });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error !" });
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    const applications = await allApplications();
    res.status(200).json({ success: true, applications: applications });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error !" });
  }
};

exports.getApplicationById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: "Please provide an id" });
    }

    const application = await findApplicationById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ success: true, application: application });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error !" });
  }
};

exports.deleteApplicationById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: "Please provide an id" });
    }

    await removeApplication(id);
    res
      .status(200)
      .json({ success: true, message: "Application deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error !" });
  }
};

exports.filterApplications = async (req, res) => {
  try {
    const { user_id, job_id } = req.query;

    let applications;
    if (user_id) {
      applications = await getApplicationsByUserId(user_id);
    } else if (job_id) {
      applications = await findApplicationsByJobId(job_id);
    } else {
      applications = await allApplications(); 
    }

    res.status(200).json({success: true, applications});
  } catch (error) {
    console.error(error);
    return res.status(500).json({success: false, message: 'Internal server error'});
  }
};