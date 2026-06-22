import { profileSchema, validateContent, type Profile } from "@/lib/validation";

const data: Profile = {
  name: "Hari Kancharla",
  legalName: "Hari Krishna Kancharla",
  role: "AI Systems Engineer",
  location: "Boston, Massachusetts",
  disciplines: ["Evaluation", "Agents", "Retrieval", "Infrastructure"],
  summary:
    "I build production retrieval and inference systems, and the evaluation and reliability work that keeps them honest. At Morgan Stanley I work on retrieval and inference platforms for analyst and trading teams. My side projects keep circling the same question: how do you tell whether a system actually did what it claimed.",
  thesis:
    "Most AI systems are judged by what they produce. I care about what happens next: did the action complete, did the patch apply, did the tests pass, is the evidence inspectable, and can the system recover when a run fails.",
};

export const profile = validateContent(profileSchema, data, "profile");
