/** @format */

import { db } from "../db/db.j";
import { pollingBatchResults } from "../utils/judge0.utils.js";
import {
  getJudge0LanguageId,
  pllingBatchResults,
  submitBatch,
} from "../utils/judge0.utils.js";

export const createProblem = async (req, res) => {
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
    }
  } catch (error) {}
};
