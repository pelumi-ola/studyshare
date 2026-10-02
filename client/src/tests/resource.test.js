import { describe, it, expect } from "vitest";

describe("StudyShare Resource Search", () => {
  it("should find Mathematics resources", () => {
    const resources = [
      { title: "Mathematics Revision Guide" },
      { title: "History Notes" },
      { title: "Mathematics Past Questions" },
    ];

    const result = resources.filter((resource) =>
      resource.title.toLowerCase().includes("mathematics"),
    );

    expect(result).toHaveLength(2);
  });

  it("should return no result when there is no match", () => {
    const resources = [
      { title: "Mathematics Revision Guide" },
      { title: "History Notes" },
    ];

    const result = resources.filter((resource) =>
      resource.title.toLowerCase().includes("physics"),
    );

    expect(result).toHaveLength(0);
  });
});
