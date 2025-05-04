/** @format */
/** @format */

import { db } from "../db/db.js";
import {
  getJudge0LanguageId,
  pollingBatchResults,
  submitBatch,
} from "../utils/judge0.utils.js";

export const createProblems = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testCases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);
      if (!languageId) {
        return res.status(400).json({
          error: `${language} Language is not Supported`,
        });
      }
      const submissions = testCases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((res) => res.token);

      const results = await pollingBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log("Result-----", result);
        // console.log(
        //   `Testcase ${i + 1} and Language ${language} ----- result ${JSON.stringify(result.status.description)}`
        // );
        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
    }

    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        tags,
        difficulty,
        examples,
        codeSnippets,
        testCases,
        referenceSolutions,
        userId: req.user.id,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Problem Created Successfully",
      problem: newProblem,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      error: "Error While Creating Problem",
    });
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const problems = await db.problem.findMany();

    if (!problems) {
      return res.status(404).json({
        error: "No Problem is Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Problem Fetched Successfully",
      problems,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error while Fetching Problems",
    });
  }
};

export const getProblemById = async (req, res) => {
  const { id } = req.params;

  try {
    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });

    if (!problem) {
      return res.status(404).json({
        error: "Problem not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Problem Fetched Successfully",
      problem,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Error While Fetching Problem by Id",
    });
  }
};

export const updateProblem = async (req, res) => {};

export const deleteProblem = async (req, res) => {
  const { id } = req.params;

  try {
    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });

    if (!problem) {
      return res.status(404).json({
        error: "Problem is Not Found",
      });
    }

    await db.problem.delete({
      id,
    });

    res.status(200).json({
      success: true,
      message: "Problem deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errror: "Error While Deleting the Problem",
    });
  }
};

export const getAllSolvedProblemsByUser = async (req, res) => {
  try {
    const problems = await db.problem.findMany({
      where: {
        solvedBy: {
          some: {
            userId: req.user.id,
          },
        },
      },
      include: {
        solvedBy: {
          where: {
            userId: req.user.id,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Problem Fetched Successfully",
      problems,
    });
  } catch (error) {
    console.error("Error fetching problems: ", error);
    res.status(500).json({
      error: "Failed to fetch problems",
    });
  }
};
