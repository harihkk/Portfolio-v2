import { profileSchema, validateContent, type Profile } from "@/lib/validation";

const data: Profile = {
  name: "Hari Kancharla",
  legalName: "Hari Krishna Kancharla",
  role: "AI Systems Engineer",
  location: "Boston, Massachusetts",
  disciplines: ["Evaluation", "Agents", "Retrieval", "Infrastructure"],
  summary:
    "Hari is an AI Systems Engineer in Boston with more than four years building production LLM, retrieval, agentic, model-serving, backend, and full-stack systems. At Morgan Stanley he builds retrieval and inference platforms for analyst and trading teams, owning retrieval quality, evaluation, guardrails, and reliability at scale.",
  thesis:
    "Most AI systems are judged by what they produce. Hari's work focuses on what happens next: whether the action completed, whether the patch applies, whether the tests pass, whether the evidence is inspectable, and whether the system can recover when execution fails.",
};

export const profile = validateContent(profileSchema, data, "profile");
