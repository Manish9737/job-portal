const { addJob, findJobById, allJobs, updateJob, removeJob, findJobsByFilters } = require("../models/jobs");

exports.createJob = async (req, res) => {
  const {
    title,
    description,
    company_id,
    salary_range,
    location,
    job_type,
    skills_required,
    experience_level,
  } = req.body;

  try {
    const result = await addJob(
      title,
      description,
      company_id,
      salary_range,
      location,
      job_type,
      skills_required,
      experience_level
    );

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      jobId: result.insertId,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.allJobs = async (req, res) => {
  try {
    const jobs = await allJobs();
    if(!jobs || jobs.length == 0) {
      return res.status(404).json({ success: false, message: "No jobs found"});
    }

    res.status(200).json({ success: true, jobs})
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal server error !"})
  }
}

exports.findJobById = async(req, res ) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ success: false, message: "Job id is required"});
    }

    const job = await findJobById(id);
    if(!job) {
      return res.status(404).json({ success: false, message: "Job not found"});
    }
    res.status(200).json({ success: true, job });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error !"})
  }
}

exports.updateJobById = async(req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    if (!id) {
      return res.status(400).json({ success: false, message: "Job id is required"});
    }

    const job = await findJobById(id);
    if(!job) {
      return res.status(404).json({ success: false, message: "Job not found"});
    }
    
    const updatedJob = await updateJob(id, updates);

    res.status(200).json({ success: true, job: updatedJob });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error !"});
  }
}

exports.deleteJobById = async(req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ success: false, message: "Job id is required"});
    }

    const job = await findJobById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found"});
    }

    await removeJob(id);
    res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error !"})
  }
}

exports.filterJobs = async (req, res) => {
  try {
    const { title, location, salary_min } = req.query;

    const jobs = await findJobsByFilters(title, location, salary_min);
    
    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};