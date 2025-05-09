/** @format */

import { db } from "../db/db.js";

export const getAllSubmission = async (req, res) => {
  try {
    const userId = req.user.id;
    const submissions = await db.submission.findMany({
      where: {
        userId: userId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Submissions Fetched Successfully",
      submissions,
    });
  } catch (error) {
    console.log("Fetch Submissions Error: ", error);
    res.status(500).json({
      error: "Faliled to fetch submissions",
    });
  }
};

export const getAllSubmissionForProblem = async (req, rs) => {
  try {
    const userId = req.user.id;

    const problemId = req.params.problemId;

    const submissions = await db.submission.findMany({
      where: {
        userId: userId,
        problemId: problemId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Submission fetched successfully",
      submissions,
    });
  } catch (error) {
    console.error("Fetch Submissions Error:", error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
};

export const getAllTheSubmissionsForProblem = async (req, res) => {
  try {
    const problemId = req.params.problemId;
    const submissionCount = await db.submission.count({
      where: {
        problemId: problemId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Submissions Fetched Successfully",
      count: submissionCount,
    });
  } catch (error) {
    console.error("Fetching Submissions Error: ", error);
    res.status(500).json({ error: "Failed to fetch submissions Count" });
  }
};
