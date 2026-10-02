import { describe, it, expect } from "vitest";

describe("StudyShare Resource", () => {
  it("should return the correct resource title", () => {
    const resource = {
      title: "Mathematics Revision Guide",
      type: "Revision Guide",
    };

    expect(resource.title).toBe("Mathematics Revision Guide");
  });

  it("should identify a PDF resource", () => {
    const resource = {
      title: "History Past Questions",
      fileType: "pdf",
    };

    expect(resource.fileType).toBe("pdf");
  });
});
