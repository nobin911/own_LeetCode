/** @format */

import { db } from "../db/db.js";
import {
  getLanguageName,
  pollingBatchResults,
  submitBatch,
} from "../utils/judge0.utils.js ";

export const executeCode = async (req, res) => {
  try {
    const { sourceCode, languageId, stdin, expected_outputs, problemId } =
      req.body;

    const userId = req.user.userId;

    // validate testcases

    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({
        error: "Invalid or Missing Test Cases",
      });
    }

    //prepare each test case for judge0 batch submission

    const submissions = stdin.map((input) => ({
      sourceCode,
      languageId,
      stdin: input,
    }));

    // send batch of submissions to judge0

    const submitResponse = await submitBatch(submissions);

    const tokens = submitResponse.map((res) => res.token);

    // polling judge0 for results of all  submitted test cases

    const results = await pollingBatchResults(tokens);

    console.log("Result===============>");
    console.log(results);

    //Analyze test cases results::

    let allpassed = true;

    const detailedResults = results.map((result, i) => {
      const stdout = result.stdout?.trim();
      const expected_output = expected_outputs[i]?.trim();
      const passed = stdout === expected_output;

      if (!passed) allpassed = false;

      return {
        testCase: i + 1,
        passed,
        stdout,
        expected: expected_output,
        compile_output: result.compile_output || null,
        status: result.status.description,
        memory: result.memory ? `${result.memory} kb` : undefined,
        time: result.time ? `${result.time} s` : undefined,
      };

      // console.log(`Testcase #${i+1}`);
      // console.log(`Input for testcase #${i+1}: ${stdin[i]}`)
      // console.log(`Expected Output for testcase #${i+1}: ${expected_output}`)
      // console.log(`Actual output for testcase #${i+1}: ${stdout}`)

      // console.log(`Matched testcase #${i+1}: ${passed}`)
    });

    console.log(detailedResults);

    // store submission summary:::

    const submission = await db.submission.create({
      userId,
      problemId,
      sourceCode,
      language: getLanguageName(languageId),
      stdin: stdin.join("\n"),
      stdout: JSON.stringify(detailedResults.map((result) => result.stdout)),
      status: allpassed ? "Accepted" : "Wrong Answer",
      stderr: detailedResults.some((r) => r.stderr)
        ? JSON.stringify(detailedResults.map((r) => r.stderr))
        : null,
      compile_output: detailedResults.some((r) => r.compile_output)
        ? JSON.stringify(detailedResults.map((r) => r.compile_output))
        : null,
      memory: detailedResults.some((r) => r.memory)
        ? JSON.stringify(detailedResults.map((r) => r.memory))
        : null,
      time: detailedResults.some((r) => r.time)
        ? JSON.stringify(detailedResults.map((r) => r.time))
        : null,
    });
  } catch (error) {}
};
