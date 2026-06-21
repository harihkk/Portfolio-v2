import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import StatusTag from "@/components/editorial/StatusTag";

afterEach(cleanup);

describe("StatusTag", () => {
  it("renders the published label", () => {
    render(<StatusTag status="published" />);
    expect(screen.getByText("Published")).toBeInTheDocument();
  });
  it("renders the alpha label", () => {
    render(<StatusTag status="alpha" />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
  });
});
